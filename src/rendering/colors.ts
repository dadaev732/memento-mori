/**
 * Color resolution and theming
 * Separates DOM access from rendering logic for better testability
 */

export interface ColorPalette {
    backgroundColor: string;
    filledColor: string;
    emptyColor: string;
    lastWeekColor: string;
    textColor: string;
    currentYearBgColor: string;
    bonusBgColor: string;
    eventColor: string;
    goalColor: string;
    expectationLineColor: string;
}

/**
 * Resolve Obsidian CSS variables to actual color values
 * Reads computed styles from document body to get theme-appropriate colors
 */
export function resolveObsidianColors(): ColorPalette {
    const computed = getComputedStyle(document.body);

    return {
        backgroundColor: getCSSVar(computed, '--background-primary', '#ffffff'),
        filledColor: getCSSVar(computed, '--text-normal', '#000000'),
        emptyColor: getCSSVar(computed, '--text-faint', '#cccccc'),
        lastWeekColor: getCSSVar(computed, '--interactive-accent', '#7c3aed'),
        textColor: getCSSVar(computed, '--text-normal', '#000000'),
        currentYearBgColor: getCSSVar(computed, '--background-modifier-hover', '#f5f5f5'),
        bonusBgColor: getCSSVar(computed, '--background-secondary-alt', '#f9f9f9'),
        eventColor: getCSSVar(computed, '--text-accent', '#7c3aed'),
        goalColor: getCSSVar(computed, '--interactive-accent', '#16a34a'),
        expectationLineColor: getCSSVar(computed, '--background-modifier-border', '#d1d5db')
    };
}

/**
 * Get default colors (used when not using Obsidian theme)
 */
export function getDefaultColors(): ColorPalette {
    return {
        backgroundColor: '#ffffff',
        filledColor: '#000000',
        emptyColor: '#cccccc',
        lastWeekColor: '#7c3aed',
        textColor: '#000000',
        currentYearBgColor: '#f5f5f5',
        bonusBgColor: '#f9f9f9',
        eventColor: '#7c3aed',
        goalColor: '#16a34a',
        expectationLineColor: '#d1d5db'
    };
}

/**
 * Helper to get CSS variable with fallback
 */
function getCSSVar(computed: CSSStyleDeclaration, varName: string, fallback: string): string {
    return computed.getPropertyValue(varName).trim() || fallback;
}
