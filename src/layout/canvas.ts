/**
 * Calculate total canvas dimensions
 */

import { GridDimensions } from './grid';
import { LabelDimensions, StatsPanelDimensions, NotesDimensions } from './panels';

export interface CanvasDimensions {
    totalWidth: number;
    totalHeight: number;
    marginX: number;
    marginY: number;
}

/**
 * Calculate total canvas size by composing all layout components
 */
export function calculateCanvasDimensions(
    grid: GridDimensions,
    labels: LabelDimensions,
    stats: StatsPanelDimensions,
    notes: NotesDimensions,
    margin: number
): CanvasDimensions {
    const marginX = margin;
    const marginY = margin;

    const totalWidth =
        marginX +
        grid.gridWidth +
        labels.labelAreaWidth +
        stats.statsPanelWidth +
        notes.notesAreaWidth +
        marginX;

    const totalHeight = marginY + grid.gridHeight + marginY;

    return { totalWidth, totalHeight, marginX, marginY };
}
