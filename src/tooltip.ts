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

    const age = Math.floor(weekIndex / 52);
    const weekInYear = weekIndex % 52;
    const percentOfLife = ((weekIndex + 1) / totalWeeks * 100).toFixed(1);

    let html = `
        <div class="tooltip-week">Week ${weekIndex + 1}</div>
        <div class="tooltip-details">Age ${age}, Week ${weekInYear + 1}/52</div>
        <div class="tooltip-details">Life ${percentOfLife}%</div>
    `;

    // Add weekly stats if available
    if (weeklyStats && weeklyStats.has(weekIndex)) {
        const stats = weeklyStats.get(weekIndex)!;
        html += `
            <div class="tooltip-divider"></div>
            <div class="tooltip-stats">${stats.notesCreated} note${stats.notesCreated !== 1 ? 's' : ''} created</div>
            <div class="tooltip-stats">${stats.wordsWritten.toLocaleString()} word${stats.wordsWritten !== 1 ? 's' : ''} written</div>
        `;
    }

    // Add events if any for this week
    const weekEvents = parsedEvents?.filter(e => e.weekIndex === weekIndex);
    if (weekEvents && weekEvents.length > 0) {
        html += `<div class="tooltip-divider"></div>`;
        html += `<div class="tooltip-section-header">Events</div>`;
        html += `<ul class="tooltip-event-list">`;
        for (const event of weekEvents) {
            html += `<li class="tooltip-event">${event.label}</li>`;
        }
        html += `</ul>`;
    }

    // Add goals if any for this week
    const weekGoals = parsedGoals?.filter(g => g.weekIndices.has(weekIndex));
    if (weekGoals && weekGoals.length > 0) {
        html += `<div class="tooltip-divider"></div>`;
        html += `<div class="tooltip-section-header">Goals</div>`;
        html += `<ul class="tooltip-goal-list">`;
        for (const goal of weekGoals) {
            const totalWeeks = goal.weekIndices.size;
            const weeksArray = Array.from(goal.weekIndices).sort((a, b) => a - b);
            const currentWeekNum = weeksArray.indexOf(weekIndex) + 1;
            html += `<li class="tooltip-goal">${goal.label} <span class="goal-progress">(${currentWeekNum}/${totalWeeks})</span></li>`;
        }
        html += `</ul>`;
    }

    tooltipElement.innerHTML = html;

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
        showTooltip(weekIndex, totalWeeks, e.clientX, e.clientY, weeklyStats, parsedEvents, parsedGoals);
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

