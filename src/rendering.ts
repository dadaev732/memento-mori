/**
 * SVG rendering engine for life calendar
 * Generates SVG-based visualization of life weeks
 */

import { Dimensions, RenderConfig } from './types';
import { parseEventSpecs, parseGoalSpecs } from './parser';
import { calculateGridDimensions, calculateGapPositions, GapConfig } from './layout/grid';
import { calculateFontSizes } from './layout/fonts';
import { calculateStatsPanelDimensions } from './layout/panels';
import { resolveObsidianColors, getDefaultColors } from './rendering/colors';
import { createSVGElement } from './rendering/components';
import { initTooltip, attachTooltipHandlers, cleanupTooltip } from './tooltip';

// Re-export for use by views
export { cleanupTooltip };

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Calculate all dimensions for the layout
 * Now uses modular layout functions for better organization
 */
export function calculateDimensions(config: RenderConfig): Dimensions {
    const { years, boxSize, spacing, margin, yearsPerGroup, verticalGapSize, horizontalParts, horizontalGapSize } = config;

    // Create gap configuration
    const gapConfig: GapConfig = {
        yearsPerGroup,
        verticalGapSize,
        horizontalParts,
        horizontalGapSize
    };

    // Calculate grid dimensions using new modules
    const grid = calculateGridDimensions(years, boxSize, spacing, gapConfig);
    const gapPositionsH = calculateGapPositions(horizontalParts);

    // Legacy calculations for compatibility
    const numGapsV = yearsPerGroup > 0 ? Math.floor((years - 1) / yearsPerGroup) : 0;
    const vertGapSize = verticalGapSize >= 0 ? verticalGapSize : 10;
    const numGapsH = gapPositionsH.length;
    const horizGapSize = horizontalGapSize >= 0 ? horizontalGapSize : 10;

    // Calculate font sizes
    const fonts = calculateFontSizes(boxSize);
    const fontSize = fonts.fontSize;
    const fontSizeStats = fonts.fontSizeStats;
    const fontSizeNotes = fonts.fontSizeNotes;

    // Calculate label dimensions
    // Labels are now positioned above/below, not on the side
    let labelAreaWidth = 0;
    let labelPadding = 0;

    // Year labels on the side still need space
    if (yearsPerGroup > 0 && years > 0) {
        const maxLabelLength = years.toString().length;
        const estimatedTextWidth = maxLabelLength * fontSize * 0.6;
        labelPadding = Math.max(spacing * 2, boxSize / 2);
        labelAreaWidth = labelPadding + estimatedTextWidth;
    }

    // Notes panel removed - events/goals now shown in tooltips
    let notesAreaWidth = 0;
    let notesPadding = 0;
    let notesTextWidth = 0;
    let notesTextHeight = 0;

    // Calculate stats panel dimensions (bottom-left)
    const { statsPanelWidth, statsPanelX } = calculateStatsPanelDimensions(
        config.showStats,
        grid.gridWidthCore,
        margin,
        fontSize
    );

    // Calculate total dimensions
    const gridWidthAll = grid.gridWidthCore + labelAreaWidth;
    const totalWidth = gridWidthAll + 2 * margin;

    // Add space for start/end labels if shown, with minimum spacing
    const labelSpaceTop = config.showStartEndLabels ? fontSize * 3.5 : fontSize * 1.5;
    const labelSpaceBottom = config.showStartEndLabels ? fontSize * 3.5 : 0;
    const totalHeight = grid.gridHeight + 2 * margin + labelSpaceTop + labelSpaceBottom;

    return {
        gridWidthCore: grid.gridWidthCore,
        gridHeight: grid.gridHeight,
        gridWidth: gridWidthAll,
        boxSize,
        spacing,
        numGapsV,
        verticalGapSize: vertGapSize,
        numGapsH,
        horizontalGapSize: horizGapSize,
        gapPositionsH,
        labelAreaWidth,
        labelPadding,
        notesAreaWidth,
        notesPadding,
        notesTextWidth,
        notesTextHeight,
        totalWidth,
        totalHeight,
        marginX: margin,
        marginY: margin,
        labelSpaceTop,
        labelSpaceBottom,
        fontSize,
        fontSizeStats,
        fontSizeNotes,
        statsPanelWidth,
        statsPanelX
    };
}

/**
 * Calculate Y coordinate for a row
 * Ported from Python lines 793-797
 */
export function rowY0(row: number, dims: Dimensions, config: RenderConfig): number {
    const { marginY, labelSpaceTop, boxSize, spacing, verticalGapSize, numGapsV } = dims;
    const { yearsPerGroup } = config;

    const gridStartY = marginY + labelSpaceTop;

    if (yearsPerGroup > 0 && numGapsV > 0) {
        const gapsAbove = Math.floor(row / yearsPerGroup);
        return gridStartY + row * (boxSize + spacing) + gapsAbove * verticalGapSize;
    }

    return gridStartY + row * (boxSize + spacing);
}

/**
 * Calculate X coordinate for a column
 * Ported from Python lines 799-803
 */
export function colX0(col: number, dims: Dimensions): number {
    const { marginX, boxSize, spacing, gapPositionsH, horizontalGapSize } = dims;

    if (gapPositionsH.length === 0) {
        return marginX + col * (boxSize + spacing);
    }

    const gapsBefore = gapPositionsH.filter(gp => gp < col).length;
    return marginX + col * (boxSize + spacing) + gapsBefore * horizontalGapSize;
}

/**
 * Main SVG generation function
 */
export function generateMementoMoriSVG(config: RenderConfig, useObsidianTheme: boolean = true): SVGSVGElement {
    // Resolve colors from Obsidian theme or use default colors
    const colors = useObsidianTheme ? resolveObsidianColors() : getDefaultColors();

    const totalWeeks = config.years * 52;

    // Parse events and goals if needed
    if (!config.parsedEvents || !config.parsedGoals) {
        const { events: parsedEvents, eventWeeks } = parseEventSpecs(
            config.events,
            config.birthdateObj,
            totalWeeks
        );
        const { goals: parsedGoals, goalWeeks } = parseGoalSpecs(
            config.goals,
            config.birthdateObj,
            totalWeeks
        );

        config.parsedEvents = parsedEvents;
        config.parsedGoals = parsedGoals;
        config.eventWeeks = eventWeeks;
        config.goalWeeks = goalWeeks;
    }

    // Calculate dimensions
    const dims = calculateDimensions(config);

    // Initialize tooltip system
    initTooltip();

    // Calculate actual content height based on last element
    const gridEndY = rowY0(config.years - 1, dims, config) + dims.boxSize;
    let actualContentHeight = config.showStartEndLabels
        ? gridEndY + dims.fontSize * 1.5  // Space for end label (centered) plus small margin
        : gridEndY;  // No extra space when no end label

    // Add space for stats panel if shown
    if (config.showStats) {
        actualContentHeight = Math.max(
            actualContentHeight,
            gridEndY + dims.fontSize + dims.spacing * 4 + dims.fontSize
        );
    }

    // Create SVG root
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${dims.totalWidth} ${actualContentHeight}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', 'auto');
    svg.classList.add('memento-mori-calendar');

    // Background
    const bg = createSVGElement('rect', {
        x: 0,
        y: 0,
        width: dims.totalWidth,
        height: actualContentHeight,
        fill: colors.backgroundColor
    });
    svg.appendChild(bg);

    // Life expectancy line
    if (config.expectedYears !== null && config.expectedYears > 0 && config.expectedYears < config.years) {
        const lineY = rowY0(config.expectedYears, dims, config) - dims.spacing / 2;
        const line = createSVGElement('line', {
            x1: dims.marginX,
            y1: lineY,
            x2: dims.marginX + dims.gridWidthCore,
            y2: lineY,
            stroke: colors.expectationLineColor,
            'stroke-width': 1
        });
        svg.appendChild(line);
    }

    // Week boxes grid
    const lastWeekIndexInGrid = config.weeksLived > 0
        ? Math.min(config.weeksLived - 1, totalWeeks - 1)
        : -1;

    for (let row = 0; row < config.years; row++) {
        const y0Row = rowY0(row, dims, config);

        for (let col = 0; col < 52; col++) {
            const index = row * 52 + col;
            if (index >= totalWeeks) {
                break;
            }

            const x0 = colX0(col, dims);
            const y0 = y0Row;

            // Determine box color
            let color: string;
            if (lastWeekIndexInGrid >= 0 && index === lastWeekIndexInGrid && colors.lastWeekColor) {
                color = colors.lastWeekColor;
            } else if (index < config.weeksLived) {
                color = colors.filledColor;
            } else {
                color = colors.emptyColor;
            }

            // Main week box
            const box = createSVGElement('rect', {
                x: x0,
                y: y0,
                width: dims.boxSize,
                height: dims.boxSize,
                fill: color
            });
            box.classList.add('week-box');
            box.setAttribute('data-week', String(index));

            // Add custom tooltip handlers
            attachTooltipHandlers(box, index, totalWeeks, config.weeklyStats, config.parsedEvents, config.parsedGoals);

            svg.appendChild(box);

            // Goal marker (outer outline)
            if (config.goalWeeks && config.goalWeeks.has(index)) {
                const goalMarker = createSVGElement('rect', {
                    x: x0,
                    y: y0,
                    width: dims.boxSize,
                    height: dims.boxSize,
                    fill: 'none',
                    stroke: colors.goalColor,
                    'stroke-width': 2
                });
                goalMarker.classList.add('goal-marker');
                svg.appendChild(goalMarker);
            }

            // Event marker (inner outline)
            if (config.eventWeeks && config.eventWeeks.has(index)) {
                const eventMarker = createSVGElement('rect', {
                    x: x0 + 1,
                    y: y0 + 1,
                    width: dims.boxSize - 2,
                    height: dims.boxSize - 2,
                    fill: 'none',
                    stroke: colors.eventColor,
                    'stroke-width': 1
                });
                eventMarker.classList.add('event-marker');
                svg.appendChild(eventMarker);
            }
        }
    }

    // Year group labels (age numbers)
    if (config.yearsPerGroup > 0 && config.years > 0) {
        const xGridRight = dims.marginX + dims.gridWidthCore;
        const xBase = xGridRight + (dims.labelAreaWidth > 0 ? dims.labelPadding : Math.max(dims.spacing * 2, dims.boxSize / 2));

        for (let row = 0; row < config.years; row++) {
            if (row % config.yearsPerGroup === 0) {
                const yCenterRow = rowY0(row, dims, config) + dims.boxSize / 2;
                const yText = yCenterRow + dims.fontSize / 3;

                const text = createSVGElement('text', {
                    x: xBase,
                    y: yText,
                    fill: colors.textColor,
                    'font-size': dims.fontSize,
                    'font-family': 'var(--font-interface)',
                    'dominant-baseline': 'middle'
                });
                text.textContent = String(row);
                text.classList.add('year-label');
                svg.appendChild(text);
            }
        }
    }

    // Start/End labels
    if (config.showStartEndLabels && config.years > 0) {
        // Calculate X position of the right edge of the last column (column 51, since 0-indexed)
        const lastColX = colX0(51, dims);
        const xRight = lastColX + dims.boxSize;

        // Start label - right-aligned at the right edge of the last box column
        const yStart = dims.marginY + dims.labelSpaceTop * 0.5;
        const textStart = createSVGElement('text', {
            x: xRight,
            y: yStart,
            fill: colors.textColor,
            'font-size': dims.fontSize,
            'font-family': 'var(--font-interface)',
            'text-anchor': 'end',
            'dominant-baseline': 'middle'
        });
        textStart.textContent = config.startLabel;
        textStart.classList.add('start-label');
        svg.appendChild(textStart);

        // End label - right-aligned at the right edge of the last box column
        const gridEndY = rowY0(config.years - 1, dims, config) + dims.boxSize;
        const yEnd = gridEndY + dims.labelSpaceBottom * 0.5;
        const textEnd = createSVGElement('text', {
            x: xRight,
            y: yEnd,
            fill: colors.textColor,
            'font-size': dims.fontSize,
            'font-family': 'var(--font-interface)',
            'text-anchor': 'end',
            'dominant-baseline': 'middle'
        });
        textEnd.textContent = config.endLabel;
        textEnd.classList.add('end-label');
        svg.appendChild(textEnd);
    }

    // Notes panel removed - events/goals now shown in tooltips

    // Stats panel (bottom-left)
    if (config.showStats && config.birthdate) {
        const statsGroup = document.createElementNS(SVG_NS, 'g');
        statsGroup.classList.add('stats-panel');

        // Calculate weeks remaining
        const totalWeeks = config.years * 52;
        const weeksRemaining = Math.max(0, totalWeeks - config.weeksLived);

        // Position at same Y as end label (aligned)
        const xStats = dims.marginX;
        const gridEndY = rowY0(config.years - 1, dims, config) + dims.boxSize;
        const yStats = gridEndY + dims.labelSpaceBottom * 0.5;

        // Render stats text
        const statsText = createSVGElement('text', {
            x: xStats,
            y: yStats,
            fill: colors.textColor,
            'font-size': dims.fontSize,
            'font-family': 'var(--font-interface)',
            'dominant-baseline': 'middle'
        });
        statsText.textContent = `Weeks remaining: ${weeksRemaining.toLocaleString()}`;
        statsGroup.appendChild(statsText);

        svg.appendChild(statsGroup);
    }

    return svg as SVGSVGElement;
}
