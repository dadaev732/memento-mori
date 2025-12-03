/**
 * Code block processor for rendering life calendar in markdown notes
 */

import { parseYaml } from 'obsidian';
import { MementoMoriSettings, RenderConfig, WeekStats } from './types';
import { generateMementoMoriSVG } from './rendering';
import { weeksLivedSince, parseDate } from './calculations';

/**
 * Parse code block configuration from YAML-style source
 * Merges with default settings from plugin
 */
export function parseCodeBlockConfig(source: string, defaultSettings: MementoMoriSettings): RenderConfig {
    // Start with a copy of default settings
    const config: any = { ...defaultSettings };

    try {
        // Parse YAML content
        const parsed = parseYaml(source);

        if (parsed && typeof parsed === 'object') {
            // Merge parsed config with defaults
            Object.assign(config, parsed);
        }
    } catch (error) {
        console.warn('Error parsing code block config:', error);
        // Fall back to default settings
    }

    // Parse birthdate
    let birthdateObj: Date;
    try {
        birthdateObj = parseDate(config.birthdate);
    } catch (e) {
        throw new Error(`Invalid birthdate: ${config.birthdate}. Expected YYYY-MM-DD format.`);
    }

    // Get current date
    const today = new Date();

    // Calculate weeks lived
    const weeksLived = weeksLivedSince(birthdateObj, today);

    // Build render config
    const renderConfig: RenderConfig = {
        ...config,
        birthdateObj,
        today,
        weeksLived
    };

    return renderConfig;
}

/**
 * Process code block and render SVG
 */
export function processCodeBlock(
    source: string,
    el: HTMLElement,
    defaultSettings: MementoMoriSettings,
    weeklyStats?: Map<number, WeekStats>
): void {
    try {
        // Parse configuration
        const config = parseCodeBlockConfig(source, defaultSettings);

        // Add stats to config if provided
        if (weeklyStats && config.showWeeklyStats !== false) {
            config.weeklyStats = weeklyStats;
        }

        // Generate SVG
        const svg = generateMementoMoriSVG(config);

        // Append to element
        el.appendChild(svg);
    } catch (error) {
        // Show error message
        const message = error instanceof Error ? error.message : String(error);
        el.createEl('div', {
            text: `Error rendering Memento Mori: ${message}`,
            cls: 'memento-mori-error'
        });
    }
}
