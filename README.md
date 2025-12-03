# Memento Mori - Obsidian Plugin

Visualize your life in weeks with a beautiful, interactive life calendar. This plugin brings the powerful memento mori concept to Obsidian, helping you stay mindful of time and focused on what truly matters.

## Features

- **Life Grid Visualization**: See your entire life laid out as a grid of weeks (52 weeks × N years)
- **Weekly Statistics**: Hover tooltips show notes created and words written per week
- **Interactive Tooltips**: View events, goals, and statistics on hover
- **Events & Goals Tracking**: Mark important dates and multi-week projects
- **Simplified Input UI**: Inline row-based event/goal management with optional notes
- **Obsidian Theme Integration**: Colors adapt to your theme automatically
- **Dual Display Modes**: Custom view panel or embedded code blocks
- **Lucide Icons**: Clean, modern UI with official Obsidian icons

## Installation

### From Obsidian Community Plugins

1. Open Settings → Community Plugins
2. Search for "Memento Mori"
3. Click Install, then Enable

### Manual Installation

1. Copy `main.js`, `manifest.json`, and `styles.css` to `<vault>/.obsidian/plugins/memento-mori/`
2. Reload Obsidian and enable the plugin in Settings → Community Plugins

## Quick Start

1. **Set your birthdate**: Settings → Memento Mori → Birthdate (YYYY-MM-DD format)
2. **Open the view**: Click the calendar icon in ribbon or use command palette: "Open Memento Mori view"
3. **Add events/goals**: Use the settings panel to track important dates and projects

## Usage

### Code Block Rendering

Embed a life calendar in any markdown note:

````markdown
```memento-mori
birthdate: 1990-01-01
years: 80
showStats: true
events:
  - date: 2010-06-15
    title: Graduated High School
  - date: 2020-03-15
    title: Started Dream Job
goals:
  - startDate: 2024-01-01
    endDate: 2024-12-31
    title: Learn TypeScript
```
````

## Settings

### Core Settings

- **Birthdate** (required): Your date of birth in YYYY-MM-DD format
- **Years to display**: Number of years to show in the grid (default: 80)

### Layout

- **Box size**: Size of each week box in pixels (5-20)
- **Spacing**: Space between boxes (0-10 pixels)
- **Margin**: Margin around the entire grid
- **Years per group**: Add visual gaps every N years for readability (default: 5)

### Features

- **Show statistics**: Display panel with age, weeks lived/remaining
- **Show weekly stats**: Display notes created and words written in hover tooltips
- **Highlight current year**: Highlight your current age row
- **Expected lifespan**: Draw a line at expected age (e.g., 75 years)

### Colors

The plugin integrates with your Obsidian theme using CSS variables:
- Adapts to light/dark themes automatically
- Customize individual colors in settings (background, filled boxes, empty boxes, current week, etc.)
- Override colors per code block for custom styling

## Event & Goal Format

### Events

Events mark specific dates. In the settings UI, use the inline row editor. In code blocks, use YAML format:

```yaml
events:
  - date: 2010-06-15
    title: Graduated High School
  - date: 2018-05-20
    title: College Graduation
    notes: Optional additional details
```

### Goals

Goals mark multi-week periods. In code blocks, use YAML format:

```yaml
goals:
  - startDate: 2024-01-01
    endDate: 2024-12-31
    title: Learn TypeScript
  - startDate: 2025-01-01
    endDate: 2025-06-30
    title: Build Obsidian Plugin
    notes: Optional notes about the goal
```

**Note**: The `id` field is auto-generated for code blocks and can be omitted.

---

Inspired by [memento-mori](https://nor-git.pages.dev/memento-mori/) • Licensed under [MIT](LICENSE)
