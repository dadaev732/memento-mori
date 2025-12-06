export function computeIntegerAgeYears(birthdate: Date, today: Date): number {
    let years = today.getFullYear() - birthdate.getFullYear();

    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) {
        years -= 1;
    }

    return Math.max(0, years);
}

export function weeksLivedSince(birthdate: Date, today: Date): number {
    if (today <= birthdate) {
        return 0;
    }

    const years = computeIntegerAgeYears(birthdate, today);

    const year = birthdate.getFullYear() + years;
    let lastBirthday: Date;

    try {
        lastBirthday = new Date(year, birthdate.getMonth(), birthdate.getDate());

        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            if (lastBirthday.getMonth() !== 1 || lastBirthday.getDate() !== 29) {
                lastBirthday = new Date(year, 2, 1);
            }
        }
    } catch (error) {
        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            lastBirthday = new Date(year, 2, 1);
        } else {
            throw error;
        }
    }

    const daysSinceBirthday = Math.floor(
        (today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24)
    );
    let weeksSinceBirthday = Math.max(0, Math.floor(daysSinceBirthday / 7));

    if (weeksSinceBirthday > 51) {
        weeksSinceBirthday = 51;
    }

    return years * 52 + weeksSinceBirthday;
}

export function ageInYearsFloat(birthdate: Date, today: Date): number {
    const daysLived = (today.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0.0, daysLived / 365.2425);
}

export function getCurrentYearProgress(
    birthdate: Date,
    today: Date,
    totalYears: number
): {
    weeksThisLifeYear: number;
    weeksLeftThisLifeYear: number;
    currentYearIndex: number;
} {
    const currentYearIndex = computeIntegerAgeYears(birthdate, today);
    const weeksNow = weeksLivedSince(birthdate, today);
    const weeksInLifeYear = 52;

    let weeksThisLifeYear = 0;
    let weeksLeftThisLifeYear = 0;

    if (currentYearIndex < totalYears) {
        const lifeYearStartIndex = currentYearIndex * 52;
        weeksThisLifeYear = Math.max(0, weeksNow - lifeYearStartIndex);

        if (weeksThisLifeYear > weeksInLifeYear) {
            weeksThisLifeYear = weeksInLifeYear;
        }

        weeksLeftThisLifeYear = Math.max(0, weeksInLifeYear - weeksThisLifeYear);
    }

    return {
        weeksThisLifeYear,
        weeksLeftThisLifeYear,
        currentYearIndex,
    };
}

export function getDateForWeekIndex(weekIndex: number, birthdate: Date): Date {
    const years = Math.floor(weekIndex / 52);
    const weeks = weekIndex % 52;

    const year = birthdate.getFullYear() + years;

    let targetDate: Date;
    try {
        targetDate = new Date(year, birthdate.getMonth(), birthdate.getDate());

        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            if (targetDate.getMonth() !== 1 || targetDate.getDate() !== 29) {
                targetDate = new Date(year, 2, 1);
            }
        }
    } catch (error) {
        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            targetDate = new Date(year, 2, 1);
        } else {
            throw error;
        }
    }

    const result = new Date(targetDate);
    result.setDate(result.getDate() + weeks * 7);

    return result;
}

export function parseDate(dateStr: string): Date {
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }

    return new Date(year, month, day);
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
