import { ItemView, WorkspaceLeaf } from 'obsidian';
import type MementoMoriPlugin from '../main';
import { generateMementoMoriSVG, cleanupTooltip } from './rendering';
import { weeksLivedSince, parseDate } from './calculations';
import { RenderConfig, WeekStats } from './types';

export const VIEW_TYPE_MEMENTO_MORI = 'memento-mori-view';

export class MementoMoriView extends ItemView {
    plugin: MementoMoriPlugin;

    constructor(leaf: WorkspaceLeaf, plugin: MementoMoriPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_MEMENTO_MORI;
    }

    getDisplayText(): string {
        return 'Memento Mori';
    }

    getIcon(): string {
        return 'skull';
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('memento-mori-view');

        try {
            if (!this.plugin.settings.birthdate) {
                container.createEl('div', {
                    text: 'Please set your birthdate in the plugin settings.',
                    cls: 'memento-mori-error',
                });
                return;
            }

            let birthdateObj: Date;
            try {
                birthdateObj = parseDate(this.plugin.settings.birthdate);
            } catch (e) {
                container.createEl('div', {
                    text: `Invalid birthdate format: ${this.plugin.settings.birthdate}. Expected YYYY-MM-DD.`,
                    cls: 'memento-mori-error',
                });
                return;
            }

            const today = new Date();

            const weeksLived = weeksLivedSince(birthdateObj, today);

            let weeklyStats: Map<number, WeekStats> | undefined;
            if (this.plugin.settings.showWeeklyStats) {
                if (this.plugin.weeklyStatsCache) {
                    weeklyStats = this.plugin.weeklyStatsCache;
                } else {
                    weeklyStats = await this.plugin.computeWeeklyStats();
                    this.plugin.weeklyStatsCache = weeklyStats;
                }
            }

            const config: RenderConfig = {
                ...this.plugin.settings,
                birthdateObj,
                today,
                weeksLived,
                weeklyStats,
            };

            const svg = generateMementoMoriSVG(config);

            container.appendChild(svg);
        } catch (error) {
            console.error('Error rendering Memento Mori view:', error);
            const message = error instanceof Error ? error.message : String(error);
            container.createEl('div', {
                text: `Error rendering view: ${message}`,
                cls: 'memento-mori-error',
            });
        }
    }

    async onClose(): Promise<void> {
        cleanupTooltip();
    }
}
