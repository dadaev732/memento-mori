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

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/dadaev732/memento-mori/releases)
2. Create folder: `<vault>/.obsidian/plugins/memento-mori/`
3. Copy the files into this folder
4. Reload Obsidian and enable the plugin in Settings → Community Plugins

## Quick Start

1. **Set your birthdate**: Settings → Memento Mori → Birthdate (YYYY-MM-DD format)
2. **Open the view**: Click the calendar icon in ribbon or use command palette: "Open Memento Mori view"
3. **Add events/goals**: Use the settings panel to track important dates and projects

## Usage

### Custom View Panel

Open a dedicated panel to display your life calendar:
- **Ribbon Icon**: Click the calendar-clock icon
- **Command Palette**: `Ctrl/Cmd+P` → "Open Memento Mori view"

The view can be placed in any pane (left sidebar, right sidebar, or main workspace).

### Code Block Rendering

Embed a life calendar in any markdown note:

````markdown
```memento-mori
birthdate: 1990-01-01
years: 80
showStats: true
events:
  - 2010-06-15:Graduated High School
  - 2020-03-15:Started Dream Job
goals:
  - 2024-01-01:2024-12-31:Learn TypeScript
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

Events mark specific dates. In settings UI, use the inline row editor with:
- **Title** (required): Event name
- **Date** (required): YYYY-MM-DD format
- **Notes** (optional): Additional details

In code blocks, use the string format:
```
2010-06-15:Graduated High School
2018-05-20:College Graduation
```

### Goals

Goals mark multi-week periods:
```
2024-01-01:2024-12-31:Learn TypeScript
2025-01-01:2025-06-30:Build Obsidian Plugin
```

## Code Block Examples

### Simple Calendar

````markdown
```memento-mori
birthdate: 1990-01-01
```
````

### With Events

````markdown
```memento-mori
birthdate: 1990-01-01
years: 80
showStats: true
events:
  - 2010-06-15:Graduated High School
  - 2020-03-15:Started Dream Job
goals:
  - 2024-01-01:2024-12-31:Learn TypeScript
```
````

## Philosophy

The concept of "memento mori" (Latin for "remember you must die") is an ancient practice of reflecting on mortality. By visualizing your life in weeks, this plugin helps you:

- **Gain perspective**: See the bigger picture of your life
- **Stay motivated**: Each week is precious and visible
- **Track progress**: Mark achievements and ongoing projects
- **Live intentionally**: Focus on what truly matters

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/dadaev732/memento-mori.git
cd memento-mori

# Install dependencies
npm install

# Build for production
npm run build

# Or run in development mode with watch
npm run dev
```

The build outputs `main.js` and `styles.css` to the project root. Copy these files to your vault's plugin folder for testing.

## Support

- **Issues**: Report bugs at [GitHub Issues](https://github.com/dadaev732/memento-mori/issues)
- **Discussions**: Share ideas and get help in [GitHub Discussions](https://github.com/dadaev732/memento-mori/discussions)

## License

MIT License - See LICENSE file for details

## Credits

Created by [avicenna](https://github.com/dadaev732). Inspired by the memento mori wallpaper generator concept, faithfully ported to TypeScript for Obsidian integration.

---

**Remember**: Each week is a box. Make it count.
