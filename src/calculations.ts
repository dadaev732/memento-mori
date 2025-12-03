/**
 * Date and week calculations for life calendar
 * Ported from Python implementation
 */

/**
 * Compute integer age in years (number of birthdays that have passed)
 * Ported from Python lines 481-485
 */
export function computeIntegerAgeYears(birthdate: Date, today: Date): number {
    let years = today.getFullYear() - birthdate.getFullYear();

    // Adjust if birthday hasn't occurred yet this year
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) {
        years -= 1;
    }

    return Math.max(0, years);
}

/**
 * Calculate week index compatible with 52-weeks-per-row life grid
 * Ported from Python lines 342-369
 *
 * Returns:
 * - First, count full calendar years already lived (whole birthdays passed)
 * - Then add whole weeks since the last birthday
 * - Each year contributes at most 52 weeks, so rows stay aligned
 */
export function weeksLivedSince(birthdate: Date, today: Date): number {
    // If today is before or on birthdate, return 0
    if (today <= birthdate) {
        return 0;
    }

    // Count how many full years have passed
    const years = computeIntegerAgeYears(birthdate, today);

    // Find the date of the last birthday
    const year = birthdate.getFullYear() + years;
    let lastBirthday: Date;

    try {
        lastBirthday = new Date(year, birthdate.getMonth(), birthdate.getDate());

        // Handle Feb 29 edge case (leap year birthday in non-leap year)
        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            // Check if the constructed date is valid
            if (lastBirthday.getMonth() !== 1 || lastBirthday.getDate() !== 29) {
                // If Feb 29 doesn't exist in this year, use March 1
                lastBirthday = new Date(year, 2, 1);  // March 1
            }
        }
    } catch (e) {
        // Fallback for Feb 29 in non-leap year
        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            lastBirthday = new Date(year, 2, 1);  // March 1
        } else {
            throw e;
        }
    }

    // Calculate days since last birthday
    const daysSinceBirthday = Math.floor((today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    let weeksSinceBirthday = Math.max(0, Math.floor(daysSinceBirthday / 7));

    // Cap at 51 weeks (52 weeks per year, 0-51 indexed)
    if (weeksSinceBirthday > 51) {
        weeksSinceBirthday = 51;
    }

    return years * 52 + weeksSinceBirthday;
}

/**
 * Calculate precise age in years as a decimal
 * Formula: (days lived) / 365.2425 (average days per year accounting for leap years)
 */
export function ageInYearsFloat(birthdate: Date, today: Date): number {
    const daysLived = (today.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0.0, daysLived / 365.2425);
}

/**
 * Calculate progress within the current "life year" (birthday to birthday)
 * Ported from Python lines 1020-1036
 */
export function getCurrentYearProgress(birthdate: Date, today: Date, totalYears: number): {
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
        currentYearIndex
    };
}

/**
 * Get the date for a specific week index
 * Useful for tooltips and interaction
 */
export function getDateForWeekIndex(weekIndex: number, birthdate: Date): Date {
    // Calculate how many full years and remaining weeks
    const years = Math.floor(weekIndex / 52);
    const weeks = weekIndex % 52;

    // Calculate the date
    const year = birthdate.getFullYear() + years;

    // Handle Feb 29 edge case
    let targetDate: Date;
    try {
        targetDate = new Date(year, birthdate.getMonth(), birthdate.getDate());

        // Check if Feb 29 in non-leap year
        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            if (targetDate.getMonth() !== 1 || targetDate.getDate() !== 29) {
                targetDate = new Date(year, 2, 1);  // March 1
            }
        }
    } catch (e) {
        if (birthdate.getMonth() === 1 && birthdate.getDate() === 29) {
            targetDate = new Date(year, 2, 1);  // March 1
        } else {
            throw e;
        }
    }

    // Add the remaining weeks (7 days per week)
    const result = new Date(targetDate);
    result.setDate(result.getDate() + (weeks * 7));

    return result;
}

/**
 * Parse a date string in YYYY-MM-DD format
 * Handles timezone issues by using local dates (not UTC)
 */
export function parseDate(dateStr: string): Date {
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;  // JavaScript months are 0-indexed
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }

    return new Date(year, month, day);
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
