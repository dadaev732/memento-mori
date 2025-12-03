/**
 * Font size calculations based on box size
 */

import { FONT_SIZE_MULTIPLIER, MIN_FONT_SIZE } from '../constants';

export interface FontSizes {
    fontSize: number;
    fontSizeStats: number;
    fontSizeNotes: number;
}

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
