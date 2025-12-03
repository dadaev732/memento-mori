/**
 * Calculate dimensions for text panels (stats, notes, labels)
 */

import { EventInfo, GoalInfo } from '../types';

export interface LabelDimensions {
    labelAreaWidth: number;
    labelPadding: number;
}

export interface StatsPanelDimensions {
    statsPanelWidth: number;
    statsPanelX: number;
}

export interface NotesDimensions {
    notesAreaWidth: number;
    notesPadding: number;
    notesTextWidth: number;
    notesTextHeight: number;
}

/**
 * Calculate dimensions for start/end label area
 */
export function calculateLabelDimensions(
    showStartEndLabels: boolean,
    fontSize: number
): LabelDimensions {
    if (!showStartEndLabels) {
        return { labelAreaWidth: 0, labelPadding: 0 };
    }

    const labelPadding = fontSize;
    const labelAreaWidth = 3 * fontSize + 2 * labelPadding;

    return { labelAreaWidth, labelPadding };
}

/**
 * Calculate dimensions and position for stats panel
 */
export function calculateStatsPanelDimensions(
    showStats: boolean,
    gridWidth: number,
    margin: number,
    fontSize: number
): StatsPanelDimensions {
    if (!showStats) {
        return { statsPanelWidth: 0, statsPanelX: 0 };
    }

    const statsPanelWidth = 15 * fontSize;
    const statsPanelX = margin + gridWidth + 2 * fontSize;

    return { statsPanelWidth, statsPanelX };
}

/**
 * Calculate dimensions for notes panel (events/goals)
 */
export function calculateNotesDimensions(
    events: EventInfo[],
    goals: GoalInfo[],
    boxSize: number,
    fontSizeNotes: number
): NotesDimensions {
    const hasNotes = events.length > 0 || goals.length > 0;

    if (!hasNotes) {
        return {
            notesAreaWidth: 0,
            notesPadding: 0,
            notesTextWidth: 0,
            notesTextHeight: 0
        };
    }

    const notesPadding = fontSizeNotes;
    const notesTextWidth = 20 * fontSizeNotes;
    const notesTextHeight = boxSize * 0.8;
    const notesAreaWidth = notesTextWidth + 2 * notesPadding;

    return { notesAreaWidth, notesPadding, notesTextWidth, notesTextHeight };
}
