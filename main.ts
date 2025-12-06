/**
 * Memento Mori Plugin - Main entry point
 * Visualize your life in weeks with a beautiful life calendar
 */

import { Plugin } from 'obsidian';
import { MementoMoriSettings, DEFAULT_SETTINGS, WeekStats } from './src/types';
import { MementoMoriSettingTab } from './src/settings';
import { MementoMoriView, VIEW_TYPE_MEMENTO_MORI } from './src/view';
import { processCodeBlock } from './src/codeblock';
import { weeksLivedSince, parseDate } from './src/calculations';

export default class MementoMoriPlugin extends Plugin {
    settings: MementoMoriSettings = DEFAULT_SETTINGS;
    weeklyStatsCache: Map<number, WeekStats> | null = null;

    onload(): void {
        this.loadSettings()
            .then(() => {
                if (this.settings.showWeeklyStats && this.settings.birthdate) {
                    return this.computeWeeklyStats();
                }
                return null;
            })
            .then((stats) => {
                if (stats) {
                    this.weeklyStatsCache = stats;
                }
            })
            .catch(console.error);

        this.registerView(VIEW_TYPE_MEMENTO_MORI, (leaf) => new MementoMoriView(leaf, this));

        this.registerMarkdownCodeBlockProcessor('memento-mori', (source, el) => {
            el.empty();
            el.addClass('memento-mori-codeblock');
            processCodeBlock(source, el, this.settings, this.weeklyStatsCache || undefined);
        });

        this.addCommand({
            id: 'open-view',
            name: 'Open view',
            callback: () => {
                this.activateView().catch(console.error);
            },
        });

        this.addCommand({
            id: 'refresh-view',
            name: 'Refresh view',
            callback: () => this.refreshView(),
        });

        this.addRibbonIcon('skull', 'Open memento mori', () => {
            this.activateView().catch(console.error);
        });

        this.addSettingTab(new MementoMoriSettingTab(this.app, this));
    }

    onunload() {}

    /**
     * Load settings from data.json
     */
    async loadSettings() {
        const loadedData = (await this.loadData()) as Partial<MementoMoriSettings> | null;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData ?? {});
    }

    /**
     * Save settings to data.json
     */
    async saveSettings() {
        await this.saveData(this.settings);

        // Invalidate cache when settings change
        this.weeklyStatsCache = null;

        // Refresh all active views
        this.refreshView();
    }

    /**
     * Activate (or reveal) the Memento Mori view
     */
    async activateView() {
        const { workspace } = this.app;

        // Check if view already exists
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_MEMENTO_MORI);

        if (leaves.length > 0) {
            // View already exists, just reveal it
            await workspace.revealLeaf(leaves[0]);
        } else {
            // Create new leaf explicitly in left sidebar
            await workspace.ensureSideLeaf(VIEW_TYPE_MEMENTO_MORI, 'left', {
                active: true,
                reveal: true,
            });
        }
    }

    /**
     * Refresh all active Memento Mori views
     */
    refreshView() {
        const { workspace } = this.app;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_MEMENTO_MORI);

        for (const leaf of leaves) {
            if (leaf.view instanceof MementoMoriView) {
                void leaf.view.onOpen(); // Re-render
            }
        }
    }

    /**
     * Compute weekly statistics from vault files
     */
    async computeWeeklyStats(): Promise<Map<number, WeekStats>> {
        const statsMap = new Map<number, WeekStats>();

        // Validate birthdate
        if (!this.settings.birthdate) {
            return statsMap;
        }

        let birthdateObj: Date;
        try {
            birthdateObj = parseDate(this.settings.birthdate);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn('Invalid birthdate, skipping stats computation:', message);
            return statsMap;
        }

        const totalWeeks = this.settings.years * 52;
        const files = this.app.vault.getMarkdownFiles();

        for (const file of files) {
            // Map file creation time to week index
            const creationDate = new Date(file.stat.ctime);
            const weekIndex = weeksLivedSince(birthdateObj, creationDate);

            // Skip files outside calendar bounds
            if (weekIndex < 0 || weekIndex >= totalWeeks) {
                continue;
            }

            // Initialize stats for this week if needed
            if (!statsMap.has(weekIndex)) {
                statsMap.set(weekIndex, { notesCreated: 0, wordsWritten: 0 });
            }

            const stats = statsMap.get(weekIndex);
            if (!stats) continue;
            stats.notesCreated++;

            // Read file content and count words
            try {
                const content = await this.app.vault.cachedRead(file);
                stats.wordsWritten += this.countWords(content);
            } catch {
                // Continue processing other files - silently skip files that can't be read
            }
        }

        return statsMap;
    }

    /**
     * Count words in markdown content
     */
    countWords(content: string): number {
        // Remove code blocks
        content = content.replace(/```[\s\S]*?```/g, '');

        // Remove inline code
        content = content.replace(/`[^`]*`/g, '');

        // Remove markdown links but keep link text
        content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

        // Split by whitespace and count non-empty tokens
        const words = content.split(/\s+/).filter((word) => word.length > 0);
        return words.length;
    }
}
