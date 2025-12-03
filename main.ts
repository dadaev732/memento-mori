/**
 * Memento Mori Plugin - Main entry point
 * Visualize your life in weeks with a beautiful life calendar
 */

import { Plugin, WorkspaceLeaf } from 'obsidian';
import { MementoMoriSettings, DEFAULT_SETTINGS, Event, Goal, WeekStats } from './src/types';
import { MementoMoriSettingTab } from './src/settings';
import { MementoMoriView, VIEW_TYPE_MEMENTO_MORI } from './src/view';
import { processCodeBlock } from './src/codeblock';
import { weeksLivedSince, parseDate } from './src/calculations';

/**
 * Generate a unique ID for events/goals
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Migrate old string-based events to new Event objects
 */
function migrateEventsFromStrings(oldEvents: string[]): Event[] {
    return oldEvents
        .filter((str) => str && str.trim())
        .map((str) => {
            const colonIndex = str.indexOf(':');
            if (colonIndex === -1) return null;

            const date = str.substring(0, colonIndex).trim();
            const description = str.substring(colonIndex + 1).trim();

            return {
                id: generateId(),
                date,
                title: description,
            };
        })
        .filter((e): e is Event => e !== null && !!e.date && !!e.title);
}

/**
 * Migrate old string-based goals to new Goal objects
 */
function migrateGoalsFromStrings(oldGoals: string[]): Goal[] {
    return oldGoals
        .filter((str) => str && str.trim())
        .map((str) => {
            const parts = str.split(':');
            if (parts.length < 2) return null;

            const startDate = parts[0].trim();
            const endDate = parts[1].trim();
            const description = parts.slice(2).join(':').trim();

            return {
                id: generateId(),
                startDate,
                endDate,
                title: description,
            };
        })
        .filter((g): g is Goal => g !== null && !!g.startDate && !!g.endDate);
}

/**
 * Migrate events from description-only to title+notes structure
 */
function migrateEventsToTitleNotes(events: Event[]): Event[] {
    return events.map((event) => {
        // Skip if already migrated
        if ('title' in event && event.title !== undefined) {
            return event;
        }

        // Migrate: description -> title
        const oldEvent = event as any;
        return {
            id: event.id,
            date: event.date,
            title: oldEvent.description || '',
        };
    });
}

/**
 * Migrate goals from description-only to title+notes structure
 */
function migrateGoalsToTitleNotes(goals: Goal[]): Goal[] {
    return goals.map((goal) => {
        // Skip if already migrated
        if ('title' in goal && goal.title !== undefined) {
            return goal;
        }

        // Migrate: description -> title
        const oldGoal = goal as any;
        return {
            id: goal.id,
            startDate: goal.startDate,
            endDate: goal.endDate,
            title: oldGoal.description || '',
        };
    });
}

export default class MementoMoriPlugin extends Plugin {
    settings: MementoMoriSettings = DEFAULT_SETTINGS;
    weeklyStatsCache: Map<number, WeekStats> | null = null;

    async onload() {
        console.log('Loading Memento Mori plugin');

        // Load settings
        await this.loadSettings();

        // Compute weekly stats on load if enabled
        if (this.settings.showWeeklyStats && this.settings.birthdate) {
            this.weeklyStatsCache = await this.computeWeeklyStats();
        }

        // Register custom view
        this.registerView(VIEW_TYPE_MEMENTO_MORI, (leaf) => new MementoMoriView(leaf, this));

        // Register code block processor
        this.registerMarkdownCodeBlockProcessor('memento-mori', (source, el) => {
            el.empty();
            el.addClass('memento-mori-codeblock');
            processCodeBlock(source, el, this.settings, this.weeklyStatsCache || undefined);
        });

        // Add command to open view
        this.addCommand({
            id: 'open-memento-mori-view',
            name: 'Open Memento Mori view',
            callback: () => this.activateView(),
        });

        // Add command to refresh view
        this.addCommand({
            id: 'refresh-memento-mori-view',
            name: 'Refresh Memento Mori view',
            callback: () => this.refreshView(),
        });

        // Add ribbon icon
        this.addRibbonIcon('calendar-clock', 'Open Memento Mori', () => {
            this.activateView();
        });

        // Add settings tab
        this.addSettingTab(new MementoMoriSettingTab(this.app, this));
    }

    async onunload() {
        console.log('Unloading Memento Mori plugin');
    }

    /**
     * Load settings from data.json
     */
    async loadSettings() {
        const loadedData = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);

        // Migration: Migrate old string-based events/goals to new format
        let migrationNeeded = false;

        if (this.settings.events.length > 0 && typeof this.settings.events[0] === 'string') {
            console.log('Migrating events from string format to JSON format');
            this.settings.events = migrateEventsFromStrings(this.settings.events as any);
            migrationNeeded = true;
        }

        if (this.settings.goals.length > 0 && typeof this.settings.goals[0] === 'string') {
            console.log('Migrating goals from string format to JSON format');
            this.settings.goals = migrateGoalsFromStrings(this.settings.goals as any);
            migrationNeeded = true;
        }

        // Migration: Convert events to title+notes structure
        if (this.settings.events.length > 0) {
            const needsEventMigration = this.settings.events.some(
                (e: any) => !('title' in e) && 'description' in e
            );
            if (needsEventMigration) {
                console.log('Migrating events to title+notes structure');
                this.settings.events = migrateEventsToTitleNotes(this.settings.events);
                migrationNeeded = true;
            }
        }

        // Migration: Convert goals to title+notes structure
        if (this.settings.goals.length > 0) {
            const needsGoalMigration = this.settings.goals.some(
                (g: any) => !('title' in g) && 'description' in g
            );
            if (needsGoalMigration) {
                console.log('Migrating goals to title+notes structure');
                this.settings.goals = migrateGoalsToTitleNotes(this.settings.goals);
                migrationNeeded = true;
            }
        }

        // Migration: Remove deprecated color/theme properties

        if (this.settings.hasOwnProperty('theme')) {
            delete (this.settings as any).theme;
            migrationNeeded = true;
        }

        const deprecatedColorProps = [
            'backgroundColor',
            'filledColor',
            'emptyColor',
            'lastWeekColor',
            'textColor',
            'currentYearBgColor',
            'bonusBgColor',
            'eventColor',
            'goalColor',
            'expectationLineColor',
        ];

        for (const prop of deprecatedColorProps) {
            if (this.settings.hasOwnProperty(prop)) {
                delete (this.settings as any)[prop];
                migrationNeeded = true;
            }
        }

        const deprecatedFontProps = [
            'fontSizeMultiplier',
            'fontSizeMultiplierStats',
            'fontSizeMultiplierNotes',
        ];

        for (const prop of deprecatedFontProps) {
            if (this.settings.hasOwnProperty(prop)) {
                delete (this.settings as any)[prop];
                migrationNeeded = true;
            }
        }

        if (this.settings.hasOwnProperty('shadeBonusYears')) {
            delete (this.settings as any).shadeBonusYears;
            migrationNeeded = true;
        }

        if (migrationNeeded) {
            await this.saveSettings();
        }
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

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_MEMENTO_MORI);

        if (leaves.length > 0) {
            // View already exists, reveal it
            leaf = leaves[0];
        } else {
            // Create new leaf in right sidebar
            leaf = workspace.getRightLeaf(false);
            if (leaf) {
                await leaf.setViewState({
                    type: VIEW_TYPE_MEMENTO_MORI,
                    active: true,
                });
            }
        }

        // Reveal the leaf
        if (leaf) {
            workspace.revealLeaf(leaf);
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
                leaf.view.onOpen(); // Re-render
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
        } catch (e) {
            console.warn('Invalid birthdate, skipping stats computation');
            return statsMap;
        }

        const totalWeeks = this.settings.years * 52;
        const files = this.app.vault.getMarkdownFiles();

        console.log(`Computing weekly stats for ${files.length} files...`);

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

            const stats = statsMap.get(weekIndex)!;
            stats.notesCreated++;

            // Read file content and count words
            try {
                const content = await this.app.vault.cachedRead(file);
                stats.wordsWritten += this.countWords(content);
            } catch (e) {
                console.warn(`Error reading file ${file.path}:`, e);
                // Continue processing other files
            }
        }

        console.log(`Weekly stats computed for ${statsMap.size} weeks`);
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
