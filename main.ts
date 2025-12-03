/**
 * Memento Mori Plugin - Main entry point
 * Visualize your life in weeks with a beautiful life calendar
 */

import { Plugin, WorkspaceLeaf, addIcon } from 'obsidian';

// Custom memento mori icon SVG
const MEMENTO_MORI_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10.5" stroke-width="1.6" stroke-dasharray="5 0.4" stroke-linecap="butt" />
  <g transform="translate(3.00, 3.00) scale(0.18)" stroke="none" fill="currentColor">
    <path d="m85.988 47.109-2.8203-1.7891c0.73828-2.2812 0.89062-4.8906 1.2617-7.2383 0.69141-4.3984-1.2617-10.77-3.75-14.391-2.8789-4.1992-8.2617-7.5781-12.809-9.7109-7.8281-3.6484-16.648-4.0508-25.148-3.6914-4.25 0.17969-8.0391 0.32813-11.949 2.0898-11.031 4.9805-17.922 15.809-17.738 27.969 0.12891 8.2617 4.0781 18.5 11.031 23.469 1.0391 0.73828 2.2188 1.4805 4.5898 2.2188 2.3711 0.73828 4.5898 0.44141 5.0391 0.44141 1.4688 0 3.0312-0.26172 4.4219-0.73828 1.8281-0.64844 4.2109-2.4492 5.3008-4.0391 0.58203-0.87891 0.94141-1.8984 1.5312-2.7891 0.94922-1.4219 2.4805-2.3906 4.1289-2.8789 6.3398-1.8789 13.23 1.9102 19.648 1.8516 0.23047-0.011718 0.46875-0.011718 0.67188 0.10156 0.16016 0.078125 0.28125 0.21875 0.37891 0.37109 1.0703 1.5117 0.28906 2.9883-1.2695 3.5898-0.69141 0.26172-1.3906 0.51172-2.1289 0.53906-0.71094 0.019531-1.3984-0.32812-1.9883-0.51172-0.30859 0.16016-0.46094 3.1211-0.44141 3.5 0.17969 2.3789 3.0586 2.0898 4.7617 2.3398 0.12891 0.019531 0.26172 0.039062 0.39062 0.058594 1.0898 0.16797 2.1797 0.36719 3.2578 0.62891 0.69141 0.14844 1.3789 0.32812 2.0703 0.51953 0.80078 0.21875 1.6016 0.46875 2.3906 0.73828 0.30859 0.10938 0.60156 0.21875 0.87109 0.35156 1.2305 0.53906 2.0781 1.2812 2.9609 2.4492h1.9297c0.33984-5.2812 1.1016-10.77-0.58984-15.852 0 0 1.3086-2.9297 1.3281-2.9688 0.78906-1.7578 5.7188-4.6797 2.668-6.6289zm-13.297 6.1914c-0.80859-0.39844-1.4609-1.0508-2.1602-1.6094-1.1484-0.92188-2.4492-1.6094-3.6211-2.5-1.1719-0.87891-2.2383-2.0312-2.6289-3.4609-0.64844-2.3984 0.87891-5.1406 3.1797-5.8711 1.8516-0.58984 4.2305-1.7305 6.1719-0.78125 2.1484 1.0586 2.7617 4.7812 2.9883 7.3086 0.039062 0.35938 0.058594 0.69141 0.078125 0.98828 0.17969 2.3555-0.52734 7.6758-4.0078 5.9258z"/>
    <path d="m59.008 61.75c-0.015624-0.082031-0.042968-0.16016-0.089843-0.22656-0.10547-0.15234-0.28516-0.23047-0.45703-0.29297-1.6641-0.61328-3.9414-0.83984-5.6992-0.625-1.9922 0.24219-4.2227 0.92188-4.6836 3.1211-0.51562 2.4648-0.35156 5.8906-0.042969 8.4023 0.57812 4.6914 3.0312 8.3008 7.5586 9.8516 2.2695 0.77734 4.6719 1.1562 6.8867 2.0781 2.1484 0.89453 4.0508 2.2695 6.0508 3.4609 2 1.1875 4.1836 2.2188 6.5078 2.293 4.3008 0.14062 6.3555-3.6211 7.0039-7.3672 0.19531-1.1367 0.89062-4.7422-0.11328-5.4219-0.23438-0.16016-4.3867 0.24609-4.3906 0.27734 0 0-0.29687 1.4805-1.332 1.4805-2.9688 0.003906-5.1055-1.9414-7.4375-3.4648-1.7539-1.1484-3.4961-2.3242-5.2461-3.4766-2.6758-1.7578-5.1758-2.6094-4.8789-6.3477 0.089844-1.1484 0.35156-2.2773 0.37891-3.4297 0.003906-0.10547 0.003906-0.21094-0.015626-0.3125z"/>
    <rect x="69.098" y="64.559" width="3.2578" height="6.0742"/>
    <rect x="74.43" y="65.41" width="3.2578" height="6.0742"/>
    <rect x="64.82" y="71.801" width="3.2578" height="6.0742"/>
    <rect x="70.727" y="74.836" width="3.2578" height="6.0742"/>
  </g>
</svg>`;
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

        // Register custom icon
        addIcon('memento-mori-icon', MEMENTO_MORI_ICON);

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
        this.addRibbonIcon('memento-mori-icon', 'Open Memento Mori', () => {
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
