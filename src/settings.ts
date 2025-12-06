import { App, PluginSettingTab, Setting, setIcon } from 'obsidian';
import type MementoMoriPlugin from '../main';

export class MementoMoriSettingTab extends PluginSettingTab {
    plugin: MementoMoriPlugin;

    constructor(app: App, plugin: MementoMoriPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl).setName('Core').setHeading();

        new Setting(containerEl)
            .setName('Birthdate')
            .setDesc('Your date of birth in YYYY-MM-DD format')
            .addText((text) =>
                text
                    .setPlaceholder('1990-01-01')
                    .setValue(this.plugin.settings.birthdate)
                    .onChange((value) => {
                        this.plugin.settings.birthdate = value;
                        this.plugin.saveSettings().catch(console.error);
                    })
            );

        new Setting(containerEl)
            .setName('Years to display')
            .setDesc('Number of years (rows) in the life grid')
            .addText((text) =>
                text
                    .setPlaceholder('80')
                    .setValue(String(this.plugin.settings.years))
                    .onChange((value) => {
                        const num = parseInt(value);
                        if (!isNaN(num) && num > 0) {
                            this.plugin.settings.years = num;
                            this.plugin.saveSettings().catch(console.error);
                        }
                    })
            );

        new Setting(containerEl).setName('Layout').setHeading();

        new Setting(containerEl)
            .setName('Box size')
            .setDesc('Size of each week box in pixels (5-20)')
            .addSlider((slider) =>
                slider
                    .setLimits(5, 20, 1)
                    .setValue(this.plugin.settings.boxSize)
                    .setDynamicTooltip()
                    .onChange((value) => {
                        this.plugin.settings.boxSize = value;
                        this.plugin.saveSettings().catch(console.error);
                    })
            );

        new Setting(containerEl)
            .setName('Spacing')
            .setDesc('Spacing between boxes in pixels (0-10)')
            .addSlider((slider) =>
                slider
                    .setLimits(0, 10, 1)
                    .setValue(this.plugin.settings.spacing)
                    .setDynamicTooltip()
                    .onChange((value) => {
                        this.plugin.settings.spacing = value;
                        this.plugin.saveSettings().catch(console.error);
                    })
            );

        new Setting(containerEl).setName('Grouping').setHeading();

        new Setting(containerEl)
            .setName('Years per group')
            .setDesc('Number of years per group (0 to disable)')
            .addText((text) =>
                text
                    .setPlaceholder('5')
                    .setValue(String(this.plugin.settings.yearsPerGroup))
                    .onChange((value) => {
                        const num = parseInt(value);
                        if (!isNaN(num) && num >= 0) {
                            this.plugin.settings.yearsPerGroup = num;
                            this.plugin.saveSettings().catch(console.error);
                        }
                    })
            );

        new Setting(containerEl)
            .setName('Vertical gap size')
            .setDesc('Size of vertical gaps between year groups (-1 for auto)')
            .addText((text) =>
                text
                    .setPlaceholder('-1')
                    .setValue(String(this.plugin.settings.verticalGapSize))
                    .onChange((value) => {
                        const num = parseInt(value);
                        if (!isNaN(num)) {
                            this.plugin.settings.verticalGapSize = num;
                            this.plugin.saveSettings().catch(console.error);
                        }
                    })
            );

        new Setting(containerEl)
            .setName('Horizontal parts')
            .setDesc('Number of horizontal segments per year (1-4)')
            .addText((text) =>
                text
                    .setPlaceholder('2')
                    .setValue(String(this.plugin.settings.horizontalParts))
                    .onChange((value) => {
                        const num = parseInt(value);
                        if (!isNaN(num) && num >= 1 && num <= 4) {
                            this.plugin.settings.horizontalParts = num;
                            this.plugin.saveSettings().catch(console.error);
                        }
                    })
            );

        new Setting(containerEl)
            .setName('Horizontal gap size')
            .setDesc('Size of horizontal gaps (-1 for auto)')
            .addText((text) =>
                text
                    .setPlaceholder('-1')
                    .setValue(String(this.plugin.settings.horizontalGapSize))
                    .onChange((value) => {
                        const num = parseInt(value);
                        if (!isNaN(num)) {
                            this.plugin.settings.horizontalGapSize = num;
                            this.plugin.saveSettings().catch(console.error);
                        }
                    })
            );

        new Setting(containerEl).setName('Features').setHeading();

        new Setting(containerEl)
            .setName('Show start/end labels')
            .setDesc('Show "Start" and "Fin." labels on first and last rows')
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.showStartEndLabels).onChange((value) => {
                    this.plugin.settings.showStartEndLabels = value;
                    this.plugin.saveSettings().catch(console.error);
                })
            );

        new Setting(containerEl)
            .setName('Show weeks remaining')
            .setDesc('Display weeks remaining below the calendar')
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.showStats).onChange((value) => {
                    this.plugin.settings.showStats = value;
                    this.plugin.saveSettings().catch(console.error);
                })
            );

        new Setting(containerEl)
            .setName('Show weekly statistics')
            .setDesc(
                'Display note and word counts for each week in tooltips. Scans vault on plugin load.'
            )
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.showWeeklyStats).onChange((value) => {
                    this.plugin.settings.showWeeklyStats = value;

                    // Recompute stats if enabled
                    if (value && this.plugin.settings.birthdate) {
                        this.plugin.computeWeeklyStats().then((stats) => {
                            this.plugin.weeklyStatsCache = stats;
                            return this.plugin.saveSettings();
                        }).catch(console.error);
                    } else {
                        // Clear cache if disabled
                        this.plugin.weeklyStatsCache = null;
                        this.plugin.saveSettings().catch(console.error);
                    }
                })
            );

        new Setting(containerEl)
            .setName('Start label')
            .setDesc('Label for the first row')
            .addText((text) =>
                text
                    .setPlaceholder('Start')
                    .setValue(this.plugin.settings.startLabel)
                    .onChange((value) => {
                        this.plugin.settings.startLabel = value;
                        this.plugin.saveSettings().catch(console.error);
                    })
            );

        new Setting(containerEl)
            .setName('End label')
            .setDesc('Label for the last row')
            .addText((text) =>
                text
                    .setPlaceholder('Fin.')
                    .setValue(this.plugin.settings.endLabel)
                    .onChange((value) => {
                        this.plugin.settings.endLabel = value;
                        this.plugin.saveSettings().catch(console.error);
                    })
            );

        new Setting(containerEl)
            .setName('Expected lifespan')
            .setDesc('Expected years of life (leave empty to disable expectation line)')
            .addText((text) =>
                text
                    .setPlaceholder('80')
                    .setValue(this.plugin.settings.expectedYears?.toString() || '')
                    .onChange((value) => {
                        const num = parseInt(value);
                        this.plugin.settings.expectedYears = !isNaN(num) && num > 0 ? num : null;
                        this.plugin.saveSettings().catch(console.error);
                    })
            );

        new Setting(containerEl).setName('Events & goals').setHeading();

        const generateId = (): string => {
            return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        };

        const isValidDate = (dateStr: string): boolean => {
            if (!dateStr || !dateStr.trim()) return false;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
            const date = new Date(dateStr);
            return date instanceof Date && !isNaN(date.getTime());
        };

        const eventsSetting = new Setting(containerEl)
            .setName('Events')
            .setDesc('Mark significant life events on your calendar')
            .setHeading();

        const eventsContainer = containerEl.createDiv('memento-mori-events-container');

        const renderEvents = () => {
            eventsContainer.empty();

            if (this.plugin.settings.events.length === 0) {
                eventsContainer.createEl('p', {
                    text: 'No events added yet. Click "Add Event" to get started.',
                    cls: 'memento-mori-empty-state',
                });
            }

            this.plugin.settings.events.forEach((event, index) => {
                const row = eventsContainer.createDiv({ cls: 'memento-mori-event-row' });

                const dateInput = row.createEl('input', {
                    type: 'date',
                    value: event.date,
                    cls: 'memento-mori-date-input-inline',
                });

                const titleInput = row.createEl('input', {
                    type: 'text',
                    value: event.title || '',
                    cls: 'memento-mori-title-input',
                    placeholder: 'Event name...',
                });

                const hasNotes = event.notes && event.notes.trim();
                const notesToggle = row.createEl('button', {
                    cls: 'memento-mori-notes-toggle',
                    attr: { 'aria-label': 'Toggle notes' },
                });
                notesToggle.empty();
                setIcon(notesToggle, 'chevron-down');
                if (hasNotes) {
                    notesToggle.addClass('has-notes');
                }

                // Remove button
                const removeBtn = row.createEl('button', {
                    cls: 'memento-mori-remove-btn',
                    attr: { 'aria-label': 'Remove event' },
                });
                removeBtn.empty();
                setIcon(removeBtn, 'x');

                let notesContainer: HTMLElement | null = null;
                let notesTextarea: HTMLTextAreaElement | null = null;
                let notesExpanded = false;

                const toggleNotes = () => {
                    notesExpanded = !notesExpanded;

                    if (notesExpanded) {
                        if (!notesContainer) {
                            notesContainer = eventsContainer.createDiv({
                                cls: 'memento-mori-notes-container',
                            });
                            row.after(notesContainer);

                            notesTextarea = notesContainer.createEl('textarea', {
                                value: event.notes || '',
                                placeholder: 'Add optional details...',
                                cls: 'memento-mori-notes-textarea-compact',
                            });

                            let saveTimeout: NodeJS.Timeout;
                            notesTextarea.addEventListener('input', () => {
                                clearTimeout(saveTimeout);
                                saveTimeout = setTimeout(() => {
                                    if (!notesTextarea) return;
                                    event.notes = notesTextarea.value;
                                    this.plugin.saveSettings().catch(console.error);

                                    const hasContent = event.notes && event.notes.trim();
                                    if (hasContent) {
                                        notesToggle.addClass('has-notes');
                                    } else {
                                        notesToggle.removeClass('has-notes');
                                    }
                                }, 500);
                            });

                            notesTextarea.focus();
                        }
                        if (!notesContainer) return;
                        notesContainer.classList.remove('is-hidden');
                        notesToggle.empty();
                        setIcon(notesToggle, 'chevron-up');
                    } else {
                        if (notesContainer) {
                            notesContainer.classList.add('is-hidden');
                        }
                        notesToggle.empty();
                        setIcon(notesToggle, 'chevron-down');
                    }
                };

                let dateTimeout: NodeJS.Timeout;
                dateInput.addEventListener('change', () => {
                    clearTimeout(dateTimeout);
                    dateTimeout = setTimeout(() => {
                        if (isValidDate(dateInput.value)) {
                            event.date = dateInput.value;
                            dateInput.classList.remove('has-error');
                            this.plugin.saveSettings().catch(console.error);
                        } else {
                            dateInput.classList.add('has-error');
                        }
                    }, 300);
                });

                let titleTimeout: NodeJS.Timeout;
                titleInput.addEventListener('input', () => {
                    clearTimeout(titleTimeout);
                    titleTimeout = setTimeout(() => {
                        event.title = titleInput.value;
                        this.plugin.saveSettings().catch(console.error);
                    }, 500);
                });

                titleInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && event.title.trim() && event.date) {
                        this.plugin.settings.events.push({
                            id: generateId(),
                            date: '',
                            title: '',
                            notes: '',
                        });
                        this.plugin.saveSettings().then(() => {
                            renderEvents();
                        }).catch(console.error);
                    }
                });

                notesToggle.addEventListener('click', toggleNotes);

                removeBtn.addEventListener('click', () => {
                    this.plugin.settings.events.splice(index, 1);
                    this.plugin.saveSettings().then(() => {
                        renderEvents();
                    }).catch(console.error);
                });
            });
        };

        renderEvents();

        eventsSetting.addButton((btn) =>
            btn
                .setButtonText('Add event')
                .setCta()
                .onClick(() => {
                    this.plugin.settings.events.push({
                        id: generateId(),
                        date: '',
                        title: '',
                        notes: '',
                    });
                    this.plugin.saveSettings().then(() => {
                        renderEvents();
                    }).catch(console.error);
                })
        );

        const goalsSetting = new Setting(containerEl)
            .setName('Goals')
            .setDesc('Set long-term goals spanning multiple weeks')
            .setHeading();

        const goalsContainer = containerEl.createDiv('memento-mori-goals-container');

        const renderGoals = () => {
            goalsContainer.empty();

            if (this.plugin.settings.goals.length === 0) {
                goalsContainer.createEl('p', {
                    text: 'No goals added yet. Click "Add Goal" to get started.',
                    cls: 'memento-mori-empty-state',
                });
            }

            this.plugin.settings.goals.forEach((goal, index) => {
                const row = goalsContainer.createDiv({ cls: 'memento-mori-event-row' });

                const startDateInput = row.createEl('input', {
                    type: 'date',
                    value: goal.startDate,
                    cls: 'memento-mori-date-input-inline-small',
                });

                const endDateInput = row.createEl('input', {
                    type: 'date',
                    value: goal.endDate,
                    cls: 'memento-mori-date-input-inline-small',
                });

                const titleInput = row.createEl('input', {
                    type: 'text',
                    value: goal.title || '',
                    cls: 'memento-mori-title-input',
                    placeholder: 'Goal name...',
                });

                const hasNotes = goal.notes && goal.notes.trim();
                const notesToggle = row.createEl('button', {
                    cls: 'memento-mori-notes-toggle',
                    attr: { 'aria-label': 'Toggle notes' },
                });
                notesToggle.empty();
                setIcon(notesToggle, 'chevron-down');
                if (hasNotes) {
                    notesToggle.addClass('has-notes');
                }

                // Remove button
                const removeBtn = row.createEl('button', {
                    cls: 'memento-mori-remove-btn',
                    attr: { 'aria-label': 'Remove event' },
                });
                removeBtn.empty();
                setIcon(removeBtn, 'x');

                let notesContainer: HTMLElement | null = null;
                let notesTextarea: HTMLTextAreaElement | null = null;
                let notesExpanded = false;

                const toggleNotes = () => {
                    notesExpanded = !notesExpanded;

                    if (notesExpanded) {
                        if (!notesContainer) {
                            notesContainer = goalsContainer.createDiv({
                                cls: 'memento-mori-notes-container',
                            });
                            row.after(notesContainer);

                            notesTextarea = notesContainer.createEl('textarea', {
                                value: goal.notes || '',
                                placeholder: 'Add optional details...',
                                cls: 'memento-mori-notes-textarea-compact',
                            });

                            let saveTimeout: NodeJS.Timeout;
                            notesTextarea.addEventListener('input', () => {
                                clearTimeout(saveTimeout);
                                saveTimeout = setTimeout(() => {
                                    if (!notesTextarea) return;
                                    goal.notes = notesTextarea.value;
                                    this.plugin.saveSettings().catch(console.error);

                                    const hasContent = goal.notes && goal.notes.trim();
                                    if (hasContent) {
                                        notesToggle.addClass('has-notes');
                                    } else {
                                        notesToggle.removeClass('has-notes');
                                    }
                                }, 500);
                            });

                            notesTextarea.focus();
                        }
                        if (!notesContainer) return;
                        notesContainer.classList.remove('is-hidden');
                        notesToggle.empty();
                        setIcon(notesToggle, 'chevron-up');
                    } else {
                        if (notesContainer) {
                            notesContainer.classList.add('is-hidden');
                        }
                        notesToggle.empty();
                        setIcon(notesToggle, 'chevron-down');
                    }
                };

                let startDateTimeout: NodeJS.Timeout;
                startDateInput.addEventListener('change', () => {
                    clearTimeout(startDateTimeout);
                    startDateTimeout = setTimeout(() => {
                        if (isValidDate(startDateInput.value)) {
                            goal.startDate = startDateInput.value;
                            startDateInput.classList.remove('has-error');
                            this.plugin.saveSettings().catch(console.error);
                        } else {
                            startDateInput.classList.add('has-error');
                        }
                    }, 300);
                });

                let endDateTimeout: NodeJS.Timeout;
                endDateInput.addEventListener('change', () => {
                    clearTimeout(endDateTimeout);
                    endDateTimeout = setTimeout(() => {
                        if (isValidDate(endDateInput.value)) {
                            goal.endDate = endDateInput.value;
                            endDateInput.classList.remove('has-error');
                            this.plugin.saveSettings().catch(console.error);
                        } else {
                            endDateInput.classList.add('has-error');
                        }
                    }, 300);
                });

                let titleTimeout: NodeJS.Timeout;
                titleInput.addEventListener('input', () => {
                    clearTimeout(titleTimeout);
                    titleTimeout = setTimeout(() => {
                        goal.title = titleInput.value;
                        this.plugin.saveSettings().catch(console.error);
                    }, 500);
                });

                titleInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && goal.title.trim() && goal.startDate && goal.endDate) {
                        this.plugin.settings.goals.push({
                            id: generateId(),
                            startDate: '',
                            endDate: '',
                            title: '',
                            notes: '',
                        });
                        this.plugin.saveSettings().then(() => {
                            renderGoals();
                        }).catch(console.error);
                    }
                });

                notesToggle.addEventListener('click', toggleNotes);

                removeBtn.addEventListener('click', () => {
                    this.plugin.settings.goals.splice(index, 1);
                    this.plugin.saveSettings().then(() => {
                        renderGoals();
                    }).catch(console.error);
                });
            });
        };

        renderGoals();

        goalsSetting.addButton((btn) =>
            btn
                .setButtonText('Add goal')
                .setCta()
                .onClick(() => {
                    this.plugin.settings.goals.push({
                        id: generateId(),
                        startDate: '',
                        endDate: '',
                        title: '',
                        notes: '',
                    });
                    this.plugin.saveSettings().then(() => {
                        renderGoals();
                    }).catch(console.error);
                })
        );
    }
}
