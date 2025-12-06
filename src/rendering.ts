import { Dimensions, RenderConfig } from './types';
import { parseEventSpecs, parseGoalSpecs } from './parser';
import { calculateGridDimensions, calculateGapPositions, GapConfig } from './layout/grid';
import { calculateFontSizes } from './layout/fonts';
import { calculateStatsPanelDimensions } from './layout/panels';
import { resolveObsidianColors, getDefaultColors } from './rendering/colors';
import { createSVGElement } from './rendering/components';
import { initTooltip, attachTooltipHandlers, cleanupTooltip } from './tooltip';

export { cleanupTooltip };

const SVG_NS = 'http://www.w3.org/2000/svg';

export function calculateDimensions(config: RenderConfig): Dimensions {
    const {
        years,
        boxSize,
        spacing,
        margin,
        yearsPerGroup,
        verticalGapSize,
        horizontalParts,
        horizontalGapSize,
    } = config;

    const gapConfig: GapConfig = {
        yearsPerGroup,
        verticalGapSize,
        horizontalParts,
        horizontalGapSize,
    };

    const grid = calculateGridDimensions(years, boxSize, spacing, gapConfig);
    const gapPositionsH = calculateGapPositions(horizontalParts);

    const numGapsV = yearsPerGroup > 0 ? Math.floor((years - 1) / yearsPerGroup) : 0;
    const vertGapSize = verticalGapSize >= 0 ? verticalGapSize : 10;
    const numGapsH = gapPositionsH.length;
    const horizGapSize = horizontalGapSize >= 0 ? horizontalGapSize : 10;

    const fonts = calculateFontSizes(boxSize);
    const fontSize = fonts.fontSize;
    const fontSizeStats = fonts.fontSizeStats;
    const fontSizeNotes = fonts.fontSizeNotes;

    let labelAreaWidth = 0;
    let labelPadding = 0;

    if (yearsPerGroup > 0 && years > 0) {
        const maxLabelLength = years.toString().length;
        const estimatedTextWidth = maxLabelLength * fontSize * 0.6;
        labelPadding = Math.max(spacing * 2, boxSize / 2);
        labelAreaWidth = labelPadding + estimatedTextWidth;
    }

    let notesAreaWidth = 0;
    let notesPadding = 0;
    let notesTextWidth = 0;
    let notesTextHeight = 0;

    const { statsPanelWidth, statsPanelX } = calculateStatsPanelDimensions(
        config.showStats,
        grid.gridWidthCore,
        margin,
        fontSize
    );

    const gridWidthAll = grid.gridWidthCore + labelAreaWidth;
    const totalWidth = gridWidthAll + 2 * margin;

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
        statsPanelX,
    };
}

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

export function colX0(col: number, dims: Dimensions): number {
    const { marginX, boxSize, spacing, gapPositionsH, horizontalGapSize } = dims;

    if (gapPositionsH.length === 0) {
        return marginX + col * (boxSize + spacing);
    }

    const gapsBefore = gapPositionsH.filter((gp) => gp < col).length;
    return marginX + col * (boxSize + spacing) + gapsBefore * horizontalGapSize;
}

export function generateMementoMoriSVG(
    config: RenderConfig,
    useObsidianTheme: boolean = true
): SVGSVGElement {
    const colors = useObsidianTheme ? resolveObsidianColors() : getDefaultColors();

    const totalWeeks = config.years * 52;

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

    const dims = calculateDimensions(config);

    initTooltip();

    const gridEndY = rowY0(config.years - 1, dims, config) + dims.boxSize;
    let actualContentHeight = config.showStartEndLabels
        ? gridEndY + dims.fontSize * 1.5
        : gridEndY;

    if (config.showStats) {
        actualContentHeight = Math.max(
            actualContentHeight,
            gridEndY + dims.fontSize + dims.spacing * 4 + dims.fontSize
        );
    }

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${dims.totalWidth} ${actualContentHeight}`);
    svg.setAttribute('width', '100%');
    svg.classList.add('memento-mori-calendar');

    const bg = createSVGElement('rect', {
        x: 0,
        y: 0,
        width: dims.totalWidth,
        height: actualContentHeight,
        fill: colors.backgroundColor,
    });
    svg.appendChild(bg);

    if (
        config.expectedYears !== null &&
        config.expectedYears > 0 &&
        config.expectedYears < config.years
    ) {
        const lineY = rowY0(config.expectedYears, dims, config) - dims.spacing / 2;
        const line = createSVGElement('line', {
            x1: dims.marginX,
            y1: lineY,
            x2: dims.marginX + dims.gridWidthCore,
            y2: lineY,
            stroke: colors.expectationLineColor,
            'stroke-width': 1,
        });
        svg.appendChild(line);
    }

    const lastWeekIndexInGrid =
        config.weeksLived > 0 ? Math.min(config.weeksLived - 1, totalWeeks - 1) : -1;

    for (let row = 0; row < config.years; row++) {
        const y0Row = rowY0(row, dims, config);

        for (let col = 0; col < 52; col++) {
            const index = row * 52 + col;
            if (index >= totalWeeks) {
                break;
            }

            const x0 = colX0(col, dims);
            const y0 = y0Row;

            let color: string;
            if (lastWeekIndexInGrid >= 0 && index === lastWeekIndexInGrid && colors.lastWeekColor) {
                color = colors.lastWeekColor;
            } else if (index < config.weeksLived) {
                color = colors.filledColor;
            } else {
                color = colors.emptyColor;
            }

            const box = createSVGElement('rect', {
                x: x0,
                y: y0,
                width: dims.boxSize,
                height: dims.boxSize,
                fill: color,
            });
            box.classList.add('week-box');
            box.setAttribute('data-week', String(index));

            attachTooltipHandlers(
                box,
                index,
                totalWeeks,
                config.weeklyStats,
                config.parsedEvents,
                config.parsedGoals
            );

            svg.appendChild(box);

            if (config.goalWeeks && config.goalWeeks.has(index)) {
                const goalMarker = createSVGElement('rect', {
                    x: x0,
                    y: y0,
                    width: dims.boxSize,
                    height: dims.boxSize,
                    fill: 'none',
                    stroke: colors.goalColor,
                    'stroke-width': 2,
                });
                goalMarker.classList.add('goal-marker');
                svg.appendChild(goalMarker);
            }

            if (config.eventWeeks && config.eventWeeks.has(index)) {
                const eventMarker = createSVGElement('rect', {
                    x: x0 + 1,
                    y: y0 + 1,
                    width: dims.boxSize - 2,
                    height: dims.boxSize - 2,
                    fill: 'none',
                    stroke: colors.eventColor,
                    'stroke-width': 1,
                });
                eventMarker.classList.add('event-marker');
                svg.appendChild(eventMarker);
            }
        }
    }

    if (config.yearsPerGroup > 0 && config.years > 0) {
        const xGridRight = dims.marginX + dims.gridWidthCore;
        const xBase =
            xGridRight +
            (dims.labelAreaWidth > 0
                ? dims.labelPadding
                : Math.max(dims.spacing * 2, dims.boxSize / 2));

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
                    'dominant-baseline': 'middle',
                });
                text.textContent = String(row);
                text.classList.add('year-label');
                svg.appendChild(text);
            }
        }
    }

    if (config.showStartEndLabels && config.years > 0) {
        const lastColX = colX0(51, dims);
        const xRight = lastColX + dims.boxSize + dims.spacing * 2;

        const yStart = dims.marginY + dims.labelSpaceTop * 0.5;
        const textStart = createSVGElement('text', {
            x: xRight,
            y: yStart,
            fill: colors.textColor,
            'font-size': dims.fontSize,
            'font-family': 'var(--font-interface)',
            'text-anchor': 'end',
            'dominant-baseline': 'middle',
        });
        textStart.textContent = config.startLabel;
        textStart.classList.add('start-label');
        svg.appendChild(textStart);

        const gridEndY = rowY0(config.years - 1, dims, config) + dims.boxSize;
        const yEnd = gridEndY + dims.labelSpaceBottom * 0.5;
        const textEnd = createSVGElement('text', {
            x: xRight,
            y: yEnd,
            fill: colors.textColor,
            'font-size': dims.fontSize,
            'font-family': 'var(--font-interface)',
            'text-anchor': 'end',
            'dominant-baseline': 'middle',
        });
        textEnd.textContent = config.endLabel;
        textEnd.classList.add('end-label');
        svg.appendChild(textEnd);
    }

    if (config.showStats && config.birthdate) {
        const statsGroup = document.createElementNS(SVG_NS, 'g');
        statsGroup.classList.add('stats-panel');

        const totalWeeks = config.years * 52;
        const weeksRemaining = Math.max(0, totalWeeks - config.weeksLived);

        const xStats = dims.marginX;
        const gridEndY = rowY0(config.years - 1, dims, config) + dims.boxSize;
        const yStats = gridEndY + dims.labelSpaceBottom * 0.5;

        const statsText = createSVGElement('text', {
            x: xStats,
            y: yStats,
            fill: colors.textColor,
            'font-size': dims.fontSize,
            'font-family': 'var(--font-interface)',
            'dominant-baseline': 'middle',
        });
        statsText.textContent = `Weeks remaining: ${weeksRemaining.toLocaleString()}`;
        statsGroup.appendChild(statsText);

        svg.appendChild(statsGroup);
    }

    return svg;
}
