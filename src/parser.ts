/**
 * Event and goal parsing
 * Ported from Python implementation
 */

import { EventInfo, GoalInfo, Event, Goal } from './types';
import { weeksLivedSince, parseDate } from './calculations';
import { DEFAULT_MAX_WIDTH, WRAPPED_LINE_WIDTH, WRAPPED_LINE_PADDING } from './constants';

/**
 * Parse event specifications from Event objects
 */
export function parseEventSpecs(
    eventObjects: Event[],
    birthdate: Date,
    totalWeeks: number
): { events: EventInfo[]; eventWeeks: Set<number> } {
    const events: EventInfo[] = [];
    const weeks: Set<number> = new Set();

    for (const event of eventObjects) {
        if (!event.date || !event.date.trim()) {
            continue; // Skip empty dates
        }

        // Parse date
        let dateVal: Date;
        try {
            dateVal = parseDate(event.date);
        } catch (e) {
            console.warn(`Could not parse event date '${event.date}', expected YYYY-MM-DD.`);
            continue;
        }

        // Skip events before birthdate
        if (dateVal < birthdate) {
            continue;
        }

        // Calculate week index
        const weekIdx = weeksLivedSince(birthdate, dateVal);

        // Only include if within grid bounds
        if (weekIdx >= 0 && weekIdx < totalWeeks) {
            events.push({
                date: dateVal,
                label: event.title || '',
                weekIndex: weekIdx,
            });
            weeks.add(weekIdx);
        }
    }

    return { events, eventWeeks: weeks };
}

/**
 * Parse goal specifications from Goal objects
 */
export function parseGoalSpecs(
    goalObjects: Goal[],
    birthdate: Date,
    totalWeeks: number
): { goals: GoalInfo[]; goalWeeks: Set<number> } {
    const goals: GoalInfo[] = [];
    const allWeeks: Set<number> = new Set();

    for (const goal of goalObjects) {
        if (!goal.startDate || !goal.startDate.trim() || !goal.endDate || !goal.endDate.trim()) {
            continue; // Skip empty dates
        }

        // Parse dates
        let startDate: Date;
        let endDate: Date;

        try {
            startDate = parseDate(goal.startDate);
            endDate = parseDate(goal.endDate);
        } catch (e) {
            console.warn(
                `Could not parse goal dates '${goal.startDate}' to '${goal.endDate}', expected YYYY-MM-DD.`
            );
            continue;
        }

        // Swap if end is before start
        if (endDate < startDate) {
            [startDate, endDate] = [endDate, startDate];
        }

        // Skip goals that end before birthdate
        if (endDate < birthdate) {
            continue;
        }

        // Clamp start date to birthdate if needed
        const clampedStart = startDate < birthdate ? birthdate : startDate;

        // Calculate week indices
        const startWeek = weeksLivedSince(birthdate, clampedStart);
        let endWeek = weeksLivedSince(birthdate, endDate);

        // Skip if goal starts beyond grid
        if (startWeek >= totalWeeks) {
            continue;
        }

        // Clamp end week to grid bounds
        endWeek = Math.min(endWeek, totalWeeks - 1);

        // Skip if invalid range
        if (endWeek < startWeek) {
            continue;
        }

        // Create set of all week indices in range
        const weekIndices: Set<number> = new Set();
        for (let w = startWeek; w <= endWeek; w++) {
            weekIndices.add(w);
        }

        if (weekIndices.size === 0) {
            continue;
        }

        goals.push({
            startDate: startDate,
            endDate: endDate,
            label: goal.title || '',
            weekIndices: weekIndices,
        });

        // Add all weeks to master set
        weekIndices.forEach((w) => allWeeks.add(w));
    }

    return { goals, goalWeeks: allWeeks };
}

/**
 * Wrap text for long labels (used in notes panel)
 * Ported from Python lines 509-520
 */
export function wrapText(label: string, maxWidth: number = DEFAULT_MAX_WIDTH): string[] {
    if (label.length <= maxWidth) {
        return [label];
    }

    const firstChunk = label.substring(0, maxWidth);
    const remaining = label.substring(maxWidth);
    const secondWidth = WRAPPED_LINE_WIDTH;
    const padding = ' '.repeat(WRAPPED_LINE_PADDING);

    const lines = [firstChunk];

    // Break remaining text into chunks
    for (let i = 0; i < remaining.length; i += secondWidth) {
        lines.push(padding + remaining.substring(i, i + secondWidth));
    }

    return lines;
}
