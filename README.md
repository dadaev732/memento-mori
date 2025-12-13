# Memento Mori

Life calendar plugin for Obsidian. Visualize your life as a grid of weeks.

![Memento Mori Calendar](assets/screenshot.png)

## Features

- Life grid (52 weeks × N years)
- Events and goals with tooltips
- Weekly statistics (notes created, words written)
- Theme-adaptive colors
- Sidebar view or embedded code blocks

## Installation

**Community Plugins**: Settings → Community Plugins → Search "Memento Mori"

**Manual**: Copy `main.js`, `manifest.json`, `styles.css` to `<vault>/.obsidian/plugins/memento-mori/`

## Usage

1. Set birthdate in Settings → Memento Mori (YYYY-MM-DD)
2. Click skull icon or use command palette
3. Add events/goals in settings

### Code Blocks

````markdown
```memento-mori
birthdate: 1990-01-01
years: 80
showStats: true
events:
  - date: 2010-06-15
    title: Graduated High School
goals:
  - startDate: 2024-01-01
    endDate: 2024-12-31
    title: Learn TypeScript
```
````

Events: `date`, `title`
Goals: `startDate`, `endDate`, `title`
The `id` field is auto-generated.

## Settings

- **Birthdate** (required): YYYY-MM-DD
- **Years to display**: Grid height (default: 80)
- **Box size**: Pixels (5-20)
- **Spacing**: Pixels (0-10)
- **Margin**: Grid padding
- **Years per group**: Visual gaps (default: 5)
- **Show statistics**: Age/weeks panel
- **Show weekly stats**: Notes/words in tooltips
- **Expected lifespan**: Line at expected age
- **Start/End labels**: Year labels

Colors adapt to theme and can be customized.

---

Inspired by [memento-mori](https://nor-git.pages.dev/memento-mori/) by [nor](https://nor-blog.pages.dev/)

Licensed under [MIT](LICENSE)
