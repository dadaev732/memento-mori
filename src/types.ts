/**
 * Type definitions for Memento Mori plugin
 */

// Event information
export interface EventInfo {
    date: Date;
    label: string;
    weekIndex: number;
}

// Goal information
export interface GoalInfo {
    startDate: Date;
    endDate: Date;
    label: string;
    weekIndices: Set<number>;
}

// Event storage format (for settings)
export interface Event {
    id: string;
    date: string;        // YYYY-MM-DD format
    title: string;       // Main event name (displayed in tooltips)
    notes?: string;      // Optional longer description
}

// Goal storage format (for settings)
export interface Goal {
    id: string;
    startDate: string;   // YYYY-MM-DD format
    endDate: string;     // YYYY-MM-DD format
    title: string;       // Main goal name (displayed in tooltips)
    notes?: string;      // Optional longer description
}

// Weekly statistics data
export interface WeekStats {
    notesCreated: number;   // Count of notes created in this week
    wordsWritten: number;   // Total words in those notes
}

// Plugin settings (40+ configuration options)
export interface MementoMoriSettings {
    // Core settings
    birthdate: string;                      // YYYY-MM-DD format
    years: number;                          // Number of years to display

    // Layout settings
    boxSize: number;                        // Size of each week box in pixels
    spacing: number;                        // Spacing between boxes
    margin: number;                         // Margin around the entire grid

    // Grouping settings
    yearsPerGroup: number;                  // Number of years per group (for vertical gaps)
    verticalGapSize: number;                // Size of vertical gaps (-1 for auto)
    horizontalParts: number;                // Number of horizontal segments per year
    horizontalGapSize: number;              // Size of horizontal gaps (-1 for auto)

    // Feature toggles
    showStartEndLabels: boolean;           // Show "Start" and "Fin." labels
    showStats: boolean;                    // Show stats panel with weeks remaining
    showWeeklyStats: boolean;              // Show per-week statistics in tooltips

    // Labels
    startLabel: string;                     // Label for start of life
    endLabel: string;                       // Label for end of life

    // Life expectancy
    expectedYears: number | null;           // Expected lifespan in years (null = disabled)

    // Events and goals
    events: Event[];                        // Array of events
    goals: Goal[];                          // Array of goals
}

// Render configuration (combines settings with runtime data)
export interface RenderConfig extends MementoMoriSettings {
    birthdateObj: Date;                     // Parsed birthdate as Date object
    today: Date;                            // Current date
    weeksLived: number;                     // Number of weeks lived
    parsedEvents?: EventInfo[];             // Parsed events
    parsedGoals?: GoalInfo[];               // Parsed goals
    eventWeeks?: Set<number>;               // Set of week indices with events
    goalWeeks?: Set<number>;                // Set of week indices with goals
    weeklyStats?: Map<number, WeekStats>;   // Optional weekly stats data
}

// Calculated dimensions for rendering
export interface Dimensions {
    // Grid dimensions
    gridWidthCore: number;                  // Core grid width (boxes + spacing, no gaps)
    gridHeight: number;                     // Total grid height
    gridWidth: number;                      // Total grid width (including gaps)

    // Box and spacing
    boxSize: number;
    spacing: number;

    // Gap information
    numGapsV: number;                       // Number of vertical gaps (year groups)
    verticalGapSize: number;                // Size of vertical gaps
    numGapsH: number;                       // Number of horizontal gaps
    horizontalGapSize: number;              // Size of horizontal gaps
    gapPositionsH: number[];                // Column positions where horizontal gaps occur

    // Label areas
    labelAreaWidth: number;                 // Width of year label area
    labelPadding: number;                   // Padding for labels

    // Notes areas
    notesAreaWidth: number;                 // Width of notes area (events/goals)
    notesPadding: number;                   // Padding for notes
    notesTextWidth: number;                 // Text width for notes
    notesTextHeight: number;                // Text height for notes

    // Canvas dimensions
    totalWidth: number;                     // Total SVG width
    totalHeight: number;                    // Total SVG height

    // Margins
    marginX: number;                        // Horizontal margin
    marginY: number;                        // Vertical margin
    labelSpaceTop: number;                  // Extra space above grid for start label
    labelSpaceBottom: number;               // Extra space below grid for end label

    // Font sizes
    fontSize: number;                       // Base font size
    fontSizeStats: number;                  // Font size for stats
    fontSizeNotes: number;                  // Font size for notes

    // Stats panel
    statsPanelWidth: number;                // Width of stats panel
    statsPanelX: number;                    // X position of stats panel
}

// Default settings
export const DEFAULT_SETTINGS: MementoMoriSettings = {
    // Core
    birthdate: "",
    years: 80,

    // Layout
    boxSize: 10,
    spacing: 2,
    margin: 0,

    // Grouping
    yearsPerGroup: 5,
    verticalGapSize: -1,  // auto
    horizontalParts: 2,
    horizontalGapSize: -1,  // auto

    // Features
    showStartEndLabels: false,
    showStats: false,
    showWeeklyStats: true,

    // Labels
    startLabel: "Start",
    endLabel: "Fin.",

    // Life expectancy
    expectedYears: null,

    // Events and goals
    events: [],
    goals: []
};
