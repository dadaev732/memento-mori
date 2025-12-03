# Memento Mori Life Calendar - Obsidian Plugin

Visualize your life in weeks with a beautiful, interactive life calendar. This plugin brings the powerful memento mori concept to Obsidian, helping you stay mindful of time and focused on what truly matters.

## Features

- **Life Grid Visualization**: See your entire life laid out as a grid of weeks (52 weeks × N years)
- **Current Week Highlighting**: Your current week is highlighted in a distinct color
- **Events Tracking**: Mark important life events with colored markers
- **Goals & Projects**: Track multi-week goals and projects with colored bands
- **Statistics Panel**: View your age, weeks lived/remaining, and current year progress
- **6 Built-in Themes**: Choose from warm, cool, mono themes (plus dark variants)
- **Extensive Customization**: 40+ settings to personalize your calendar
- **Dual Display Modes**:
  - **Custom View Panel**: Dedicated pane (like graph view) for persistent display
  - **Code Block Rendering**: Embed calendars in your markdown notes

## Installation

### From Obsidian Community Plugins (Coming Soon)

1. Open Settings → Community Plugins
2. Search for "Memento Mori"
3. Click Install, then Enable

### Manual Installation

1. Download the latest release files:
   - `main.js`
   - `manifest.json`
   - `styles.css`
2. Create folder: `<vault>/.obsidian/plugins/memento-mori/`
3. Copy the files into this folder
4. Reload Obsidian
5. Enable the plugin in Settings → Community Plugins

## Quick Start

1. **Set your birthdate**: Go to Settings → Memento Mori → Core Settings
2. **Open the view**: Click the calendar icon in the ribbon, or use command palette: "Open Memento Mori view"
3. **Customize**: Adjust colors, themes, and features to your liking

## Usage

### Custom View Panel

Open a dedicated panel to display your life calendar:

- **Ribbon Icon**: Click the calendar-clock icon
- **Command Palette**: Search for "Open Memento Mori view"
- **Command**: `Ctrl/Cmd+P` → "Memento Mori: Open view"

The view can be placed in any pane (left sidebar, right sidebar, or main workspace).

### Code Block Rendering

Embed a life calendar in any markdown note using a code block:

````markdown
```memento-mori
birthdate: 1990-01-01
years: 80
theme: warm-dark
showStats: true
highlightCurrentYear: true
events:
  - 2010-06-15:Graduated High School
  - 2020-03-15:Started Dream Job
goals:
  - 2024-01-01:2024-12-31:Learn TypeScript
  - 2025-01-01:2025-06-30:Build Obsidian Plugin
```
````

### Event Format

Events mark specific dates:

```
YYYY-MM-DD:Description
```

Example:
```
2010-06-15:Graduated High School
2018-05-20:College Graduation
2020-03-15:Started Dream Job
```

### Goal Format

Goals mark multi-week periods:

```
START_DATE:END_DATE:Description
```

Example:
```
2024-01-01:2024-12-31:Learn TypeScript
2025-01-01:2025-06-30:Build Obsidian Plugin
2025-07-01:2026-12-31:Deep Research Project
```

## Settings

### Core Settings

- **Birthdate** (required): Your date of birth (YYYY-MM-DD)
- **Years to display**: Number of years to show in the grid (default: 80)

### Layout

- **Box size**: Size of each week box in pixels (5-20)
- **Spacing**: Space between boxes (0-10 pixels)
- **Margin**: Margin around the entire grid

### Grouping

- **Years per group**: Add gaps every N years for readability (default: 5)
- **Vertical gap size**: Size of gaps between year groups
- **Horizontal segments**: Divide each year row into segments
- **Horizontal gap size**: Size of gaps between week segments

### Themes

Choose from 6 built-in color themes:

- **warm**: Beige background, orange filled boxes
- **cool**: Light blue background, blue filled boxes
- **mono**: High contrast black and white
- **warm-dark**: Dark brown background, orange boxes
- **cool-dark**: Dark blue/gray background, blue boxes
- **mono-dark**: Inverted black and white

Or customize all colors individually.

### Colors

Fine-tune every color:
- Background color
- Filled boxes (weeks lived)
- Empty boxes (weeks not yet lived)
- Last week (current week)
- Text color
- Current year background
- Bonus years background (beyond life expectancy)
- Event markers
- Goal markers
- Life expectancy line

### Features

- **Show statistics**: Display panel with age, weeks lived/remaining
- **Highlight current year**: Highlight your current age row
- **Show start/end labels**: Add "Start" and "Fin." labels
- **Shade bonus years**: Shade years beyond life expectancy
- **Expected lifespan**: Draw a line at expected age (e.g., 75)

### Font Sizes

- **Font size multiplier**: Base font size for labels (relative to box size)
- **Stats font multiplier**: Font size for statistics panel
- **Notes font multiplier**: Font size for events/goals notes

## Code Block Configuration

All settings can be overridden in code blocks. Common examples:

### Simple Calendar

````markdown
```memento-mori
birthdate: 1990-01-01
```
````

### With Theme and Stats

````markdown
```memento-mori
birthdate: 1990-01-01
years: 80
theme: cool-dark
showStats: true
```
````

### Full Configuration

````markdown
```memento-mori
birthdate: 1990-01-01
years: 80
boxSize: 12
spacing: 3
theme: warm-dark
showStats: true
highlightCurrentYear: true
expectedYears: 75
shadeBonusYears: true
events:
  - 2010-06-15:Graduated High School
  - 2014-05-20:College Graduation
  - 2020-03-15:Started Dream Job
goals:
  - 2024-01-01:2024-12-31:Learn TypeScript
  - 2025-01-01:2025-06-30:Build Plugin
```
````

## Tips & Tricks

1. **Use themes for quick styling**: Start with a built-in theme, then customize specific colors
2. **Combine with daily notes**: Add a code block to your daily note template
3. **Track long-term projects**: Use goals to visualize multi-month or multi-year commitments
4. **Life expectancy line**: Set your target lifespan to visualize bonus years
5. **Current year highlighting**: Keep it enabled to quickly see where you are now
6. **Adjust box size**: Larger boxes (15-20px) work well for detailed viewing; smaller (5-8px) fit more on screen

## Keyboard Shortcuts

- **Open Memento Mori view**: `Ctrl/Cmd+P` → "Open Memento Mori view"
- **Refresh view**: `Ctrl/Cmd+P` → "Refresh Memento Mori view"

## Philosophy

The concept of "memento mori" (Latin for "remember you must die") is an ancient practice of reflecting on mortality. By visualizing your life in weeks, this plugin helps you:

- **Gain perspective**: See the bigger picture of your life
- **Stay motivated**: Each week is precious and visible
- **Track progress**: Mark achievements and ongoing projects
- **Live intentionally**: Focus on what truly matters

## Credits

This plugin is inspired by the excellent Python-based memento-mori wallpaper generator. The core calculation and rendering logic has been faithfully ported to TypeScript for seamless Obsidian integration.

## License

MIT License - See LICENSE file for details

## Support

- **Issues**: Report bugs at [GitHub Issues](https://github.com/yourusername/memento-mori-plugin/issues)
- **Discussions**: Share ideas and get help in [GitHub Discussions](https://github.com/yourusername/memento-mori-plugin/discussions)

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/memento-mori-plugin.git
cd memento-mori-plugin

# Install dependencies
npm install

# Build for production
npm run build

# Or run in development mode with watch
npm run dev
```

### Project Structure

```
memento-mori-plugin/
├── main.ts              # Plugin entry point
├── src/
│   ├── types.ts         # TypeScript interfaces
│   ├── calculations.ts  # Date/week calculations
│   ├── parser.ts        # Event/goal parsing
│   ├── themes.ts        # Theme definitions
│   ├── rendering.ts     # SVG generation engine
│   ├── settings.ts      # Settings management
│   ├── view.ts          # Custom ItemView
│   └── codeblock.ts     # Code block processor
├── styles.css           # Plugin styles
└── manifest.json        # Plugin metadata
```

## Changelog

### 1.0.0 (Initial Release)

- Full-featured life calendar visualization
- Custom view panel and code block rendering
- 6 built-in themes
- Comprehensive customization (40+ settings)
- Events and goals tracking
- Statistics panel
- SVG-based rendering for crisp, scalable graphics

---

**Remember**: Each week is a box. Make it count.
