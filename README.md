# Memento Mori - Obsidian Plugin

Visualize your life in weeks with a beautiful, interactive life calendar. This plugin brings the powerful memento mori concept to Obsidian, helping you stay mindful of time and focused on what truly matters.

![Memento Mori Calendar](assets/screenshot.png)

## Features

- Visualize your entire life as a grid of weeks (52 weeks × N years)
- Track events and goals with interactive hover tooltips
- View weekly statistics showing notes created and words written per week
- Adapts automatically to your Obsidian theme (light/dark modes)
- Display as sidebar view or embed in notes with code blocks

## Installation

**Community Plugins**: Settings → Community Plugins → Search "Memento Mori" → Install

**Manual**: Copy `main.js`, `manifest.json`, `styles.css` to `<vault>/.obsidian/plugins/memento-mori/`

## Usage

1. Set your birthdate in Settings → Memento Mori (YYYY-MM-DD format)
2. Open the view via the skull icon in the ribbon or command palette: "Open Memento Mori view"
3. Add events and goals using the settings panel

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

Events use `date` and `title` fields; goals use `startDate`, `endDate`, and `title`. The `id` field is auto-generated and can be omitted in code blocks.

## Settings

- **Birthdate** (required): Your date of birth in YYYY-MM-DD format
- **Years to display**: Number of years to show in the grid (default: 80)
- **Box size**: Size of each week box in pixels (5-20)
- **Spacing**: Space between boxes (0-10 pixels)
- **Margin**: Margin around the entire grid
- **Years per group**: Add visual gaps every N years for readability (default: 5)
- **Show statistics**: Display panel with age, weeks lived/remaining
- **Show weekly stats**: Display notes created and words written in hover tooltips
- **Expected lifespan**: Draw a line at expected age (null to disable)
- **Start/End labels**: Toggle year labels at top and bottom

Colors adapt automatically to your Obsidian theme and can be customized in settings.

---

Inspired by [memento-mori](https://nor-git.pages.dev/memento-mori/) by [nor-nor](https://nor-blog.pages.dev/)

Licensed under [MIT](LICENSE)
