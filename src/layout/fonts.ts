/**
 * Font size calculations based on box size
 */

export interface FontSizes {
    fontSize: number;
    fontSizeStats: number;
    fontSizeNotes: number;
}

const FONT_SIZE_MULTIPLIER = 1.68; // 1.2 * 1.4
const MIN_FONT_SIZE = 8;

/**
 * Calculate font sizes for all text elements
 */
export function calculateFontSizes(boxSize: number): FontSizes {
    const fontSize = Math.max(MIN_FONT_SIZE, Math.round(boxSize * FONT_SIZE_MULTIPLIER));

    return {
        fontSize,
        fontSizeStats: fontSize,
        fontSizeNotes: fontSize,
    };
}
