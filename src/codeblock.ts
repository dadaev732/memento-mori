import { parseYaml } from 'obsidian';
import { MementoMoriSettings, RenderConfig, WeekStats, Event, Goal } from './types';
import { generateMementoMoriSVG } from './rendering';
import { weeksLivedSince, parseDate } from './calculations';

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function parseCodeBlockConfig(
    source: string,
    defaultSettings: MementoMoriSettings
): RenderConfig {
    const config: any = { ...defaultSettings };

    try {
        const parsed = parseYaml(source);

        if (parsed && typeof parsed === 'object') {
            Object.assign(config, parsed);

            if (config.events && Array.isArray(config.events)) {
                config.events = config.events.map(
                    (event: Event | Omit<Event, 'id'>): Event => {
                        if (!('id' in event) || !event.id) {
                            return { id: generateId(), ...event } as Event;
                        }
                        return event as Event;
                    }
                );
            }

            if (config.goals && Array.isArray(config.goals)) {
                config.goals = config.goals.map((goal: Goal | Omit<Goal, 'id'>): Goal => {
                    if (!('id' in goal) || !goal.id) {
                        return { id: generateId(), ...goal } as Goal;
                    }
                    return goal as Goal;
                });
            }
        }
    } catch (error) {
        console.warn('Error parsing code block config:', error);
    }

    let birthdateObj: Date;
    try {
        birthdateObj = parseDate(config.birthdate);
    } catch (e) {
        throw new Error(`Invalid birthdate: ${config.birthdate}. Expected YYYY-MM-DD format.`);
    }

    const today = new Date();

    const weeksLived = weeksLivedSince(birthdateObj, today);

    const renderConfig: RenderConfig = {
        ...config,
        birthdateObj,
        today,
        weeksLived,
    };

    return renderConfig;
}

export function processCodeBlock(
    source: string,
    el: HTMLElement,
    defaultSettings: MementoMoriSettings,
    weeklyStats?: Map<number, WeekStats>
): void {
    try {
        const config = parseCodeBlockConfig(source, defaultSettings);

        if (weeklyStats && config.showWeeklyStats !== false) {
            config.weeklyStats = weeklyStats;
        }

        const svg = generateMementoMoriSVG(config);

        el.appendChild(svg);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        el.createEl('div', {
            text: `Error rendering Memento Mori: ${message}`,
            cls: 'memento-mori-error',
        });
    }
}
