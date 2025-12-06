/**
 * Custom tooltip management for week boxes
 * Provides styled tooltips that match Obsidian theme
 */

import { WeekStats, EventInfo, GoalInfo } from './types';

let tooltipElement: HTMLElement | null = null;

/**
 * Initialize the tooltip system
 * Should be called once when creating the SVG
 */
export function initTooltip(): void {
    if (!tooltipElement) {
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'memento-mori-tooltip';
        document.body.appendChild(tooltipElement);
    }
}

/**
 * Clean up tooltip element
 * Should be called when removing the view
 */
export function cleanupTooltip(): void {
    if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
    }
}

/**
 * Show tooltip with formatted content
 */
export function showTooltip(
    weekIndex: number,
    totalWeeks: number,
    x: number,
    y: number,
    weeklyStats?: Map<number, WeekStats>,
    parsedEvents?: EventInfo[],
    parsedGoals?: GoalInfo[]
): void {
    if (!tooltipElement) return;

    // Clear previous content
    tooltipElement.empty();

    const age = Math.floor(weekIndex / 52);
    const weekInYear = weekIndex % 52;
    const percentOfLife = (((weekIndex + 1) / totalWeeks) * 100).toFixed(1);

    // Create week info
    tooltipElement.createDiv({ cls: 'tooltip-week', text: `Week ${weekIndex + 1}` });
    tooltipElement.createDiv({
        cls: 'tooltip-details',
        text: `Age ${age}, Week ${weekInYear + 1}/52`,
    });
    tooltipElement.createDiv({ cls: 'tooltip-details', text: `Life ${percentOfLife}%` });

    // Add weekly stats if available
    if (weeklyStats && weeklyStats.has(weekIndex)) {
        const stats = weeklyStats.get(weekIndex)!;
        tooltipElement.createDiv({ cls: 'tooltip-divider' });
        tooltipElement.createDiv({
            cls: 'tooltip-stats',
            text: `${stats.notesCreated} note${stats.notesCreated !== 1 ? 's' : ''} created`,
        });
        tooltipElement.createDiv({
            cls: 'tooltip-stats',
            text: `${stats.wordsWritten.toLocaleString()} word${stats.wordsWritten !== 1 ? 's' : ''} written`,
        });
    }

    // Add events if any for this week
    const weekEvents = parsedEvents?.filter((e) => e.weekIndex === weekIndex);
    if (weekEvents && weekEvents.length > 0) {
        tooltipElement.createDiv({ cls: 'tooltip-divider' });
        tooltipElement.createDiv({ cls: 'tooltip-section-header', text: 'Events' });
        const eventList = tooltipElement.createEl('ul', { cls: 'tooltip-event-list' });
        for (const event of weekEvents) {
            eventList.createEl('li', { cls: 'tooltip-event', text: event.label });
        }
    }

    // Add goals if any for this week
    const weekGoals = parsedGoals?.filter((g) => g.weekIndices.has(weekIndex));
    if (weekGoals && weekGoals.length > 0) {
        tooltipElement.createDiv({ cls: 'tooltip-divider' });
        tooltipElement.createDiv({ cls: 'tooltip-section-header', text: 'Goals' });
        const goalList = tooltipElement.createEl('ul', { cls: 'tooltip-goal-list' });
        for (const goal of weekGoals) {
            const totalWeeks = goal.weekIndices.size;
            const weeksArray = Array.from(goal.weekIndices).sort((a, b) => a - b);
            const currentWeekNum = weeksArray.indexOf(weekIndex) + 1;
            const goalItem = goalList.createEl('li', { cls: 'tooltip-goal' });
            goalItem.appendText(goal.label + ' ');
            goalItem.createSpan({
                cls: 'goal-progress',
                text: `(${currentWeekNum}/${totalWeeks})`,
            });
        }
    }

    // Position tooltip near cursor with offset
    const offset = 10;
    tooltipElement.style.left = `${x + offset}px`;
    tooltipElement.style.top = `${y + offset}px`;

    // Make visible
    tooltipElement.classList.add('visible');
}

/**
 * Hide tooltip
 */
export function hideTooltip(): void {
    if (tooltipElement) {
        tooltipElement.classList.remove('visible');
    }
}

/**
 * Attach tooltip handlers to an SVG element
 */
export function attachTooltipHandlers(
    element: SVGElement,
    weekIndex: number,
    totalWeeks: number,
    weeklyStats?: Map<number, WeekStats>,
    parsedEvents?: EventInfo[],
    parsedGoals?: GoalInfo[]
): void {
    element.addEventListener('mouseenter', (e: MouseEvent) => {
        showTooltip(
            weekIndex,
            totalWeeks,
            e.clientX,
            e.clientY,
            weeklyStats,
            parsedEvents,
            parsedGoals
        );
    });

    element.addEventListener('mousemove', (e: MouseEvent) => {
        if (tooltipElement) {
            const offset = 10;
            tooltipElement.style.left = `${e.clientX + offset}px`;
            tooltipElement.style.top = `${e.clientY + offset}px`;
        }
    });

    element.addEventListener('mouseleave', () => {
        hideTooltip();
    });
}
