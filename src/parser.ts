import { EventInfo, GoalInfo, Event, Goal } from './types';
import { weeksLivedSince, parseDate } from './calculations';
import { DEFAULT_MAX_WIDTH, WRAPPED_LINE_WIDTH, WRAPPED_LINE_PADDING } from './constants';

export function parseEventSpecs(
    eventObjects: Event[],
    birthdate: Date,
    totalWeeks: number
): { events: EventInfo[]; eventWeeks: Set<number> } {
    const events: EventInfo[] = [];
    const weeks: Set<number> = new Set();

    for (const event of eventObjects) {
        if (!event.date || !event.date.trim()) {
            continue;
        }

        let dateVal: Date;
        try {
            dateVal = parseDate(event.date);
        } catch (e) {
            console.warn(`Could not parse event date '${event.date}', expected YYYY-MM-DD.`);
            continue;
        }

        if (dateVal < birthdate) {
            continue;
        }

        const weekIdx = weeksLivedSince(birthdate, dateVal);

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

export function parseGoalSpecs(
    goalObjects: Goal[],
    birthdate: Date,
    totalWeeks: number
): { goals: GoalInfo[]; goalWeeks: Set<number> } {
    const goals: GoalInfo[] = [];
    const allWeeks: Set<number> = new Set();

    for (const goal of goalObjects) {
        if (!goal.startDate || !goal.startDate.trim() || !goal.endDate || !goal.endDate.trim()) {
            continue;
        }

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

        if (endDate < startDate) {
            [startDate, endDate] = [endDate, startDate];
        }

        if (endDate < birthdate) {
            continue;
        }

        const clampedStart = startDate < birthdate ? birthdate : startDate;

        const startWeek = weeksLivedSince(birthdate, clampedStart);
        let endWeek = weeksLivedSince(birthdate, endDate);

        if (startWeek >= totalWeeks) {
            continue;
        }

        endWeek = Math.min(endWeek, totalWeeks - 1);

        if (endWeek < startWeek) {
            continue;
        }

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

export function wrapText(label: string, maxWidth: number = DEFAULT_MAX_WIDTH): string[] {
    if (label.length <= maxWidth) {
        return [label];
    }

    const firstChunk = label.substring(0, maxWidth);
    const remaining = label.substring(maxWidth);
    const secondWidth = WRAPPED_LINE_WIDTH;
    const padding = ' '.repeat(WRAPPED_LINE_PADDING);

    const lines = [firstChunk];

    for (let i = 0; i < remaining.length; i += secondWidth) {
        lines.push(padding + remaining.substring(i, i + secondWidth));
    }

    return lines;
}
