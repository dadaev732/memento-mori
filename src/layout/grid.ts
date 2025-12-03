/**
 * Pure functions for grid layout calculations
 * No DOM manipulation, no side effects - easily testable
 */

import { WEEKS_PER_YEAR } from '../constants';

export interface GridDimensions {
    gridWidthCore: number;
    gridHeight: number;
    gridWidth: number;
}

export interface GapConfig {
    yearsPerGroup: number;
    verticalGapSize: number;
    horizontalParts: number;
    horizontalGapSize: number;
}

/**
 * Calculate grid dimensions including gaps
 */
export function calculateGridDimensions(
    years: number,
    boxSize: number,
    spacing: number,
    gaps: GapConfig
): GridDimensions {
    // Vertical gaps (year grouping)
    const numGapsV = gaps.yearsPerGroup > 0 ? Math.floor(years / gaps.yearsPerGroup) : 0;
    const vertGapSize = gaps.verticalGapSize >= 0 ? gaps.verticalGapSize : boxSize;

    // Horizontal gaps (week segments)
    const numGapsH = gaps.horizontalParts > 1 ? gaps.horizontalParts - 1 : 0;
    const horizGapSize = gaps.horizontalGapSize >= 0 ? gaps.horizontalGapSize : boxSize;

    // Calculate dimensions
    const gridWidthCore =
        WEEKS_PER_YEAR * boxSize + (WEEKS_PER_YEAR - 1) * spacing + numGapsH * horizGapSize;
    const gridHeight = years * boxSize + (years - 1) * spacing + numGapsV * vertGapSize;
    const gridWidth = gridWidthCore;

    return { gridWidthCore, gridHeight, gridWidth };
}

/**
 * Calculate horizontal gap positions (column indices where gaps occur)
 */
export function calculateGapPositions(horizontalParts: number): number[] {
    if (horizontalParts <= 1) return [];

    const gapPositions: number[] = [];
    const weeksPerPart = Math.floor(WEEKS_PER_YEAR / horizontalParts);

    for (let i = 1; i < horizontalParts; i++) {
        gapPositions.push(i * weeksPerPart);
    }

    return gapPositions;
}

/**
 * Calculate Y coordinate for a given row
 */
export function getRowY(
    row: number,
    boxSize: number,
    spacing: number,
    vertGapSize: number,
    yearsPerGroup: number
): number {
    const gapsBefore = yearsPerGroup > 0 ? Math.floor(row / yearsPerGroup) : 0;
    return row * (boxSize + spacing) + gapsBefore * vertGapSize;
}

/**
 * Calculate X coordinate for a given column
 */
export function getColX(
    col: number,
    boxSize: number,
    spacing: number,
    horizGapSize: number,
    gapPositions: number[]
): number {
    let gapsBefore = 0;
    for (const gapPos of gapPositions) {
        if (col >= gapPos) gapsBefore++;
    }
    return col * (boxSize + spacing) + gapsBefore * horizGapSize;
}
