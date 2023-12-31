/**
 * @module DatetimeUtils
 */

/**
 * @file Contains various functions relating to changing, converting, and getting dates and timestamps
 */

import { DAILY, DAY_LENGTH, MONTHLY, WEEKLY, WEEK_LENGTH } from '../constants/FrequencyConstants';
import { TIMESTAMP_REGEX } from '../constants/Regex';

/**
 * Gets a date string from a provided Date object
 * @param {Date} date Date object to get string for
 * @returns {string} Gets a YYYY-MM-DD string for that date
 */
const getDateStringFromDate = (date) => {
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * Gets today's date string
 * @returns {string} Returns a YYYY-MM-DD string for today
 */
const getCurrentDateString = () => {
    const date = new Date();
    return getDateStringFromDate(date);
};

/**
 * Gets a datetime string from a date object
 * @param {Date} date Date object to get string for
 * @returns {string} YYYY-MM-DD hh:mm:ss string for that date
 */
const getDatetimeString = (date) => {
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    let second = date.getSeconds();
    if (second < 10) {
        second = '0' + second;
    }
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};

/**
 * Gets current datetime string in UTC time
 * @returns {string} YYYY-MM-DD hh:mm:ss datetime string in UTC time
 */
const getCurrentUTCDatetimeString = () => {
    const date = new Date();
    let month = date.getUTCMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let day = date.getUTCDate();
    if (day < 10) {
        day = '0' + day;
    }
    let hour = date.getUTCHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    let minute = date.getUTCMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    let second = date.getUTCSeconds();
    if (second < 10) {
        second = '0' + second;
    }
    return `${date.getUTCFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};

/**
 * Gets current UTC timestamp
 * @returns {integer} Current UTC timestamp as a number of milliseconds
 */
const getCurrentUTCTimestamp = () => {
    return Date.now();
};

/**
 * Increments a date by a provided frequency
 * @param {Date} date Date to increment
 * @param {integer} frequency Frequency to increment by. Use constants from FrequencyConstants.js
 * @returns {Date} Date incremented by the provided frequency
 */
const incrementDateByFrequency = (date, frequency) => {
    if (frequency === DAILY) {
        return date.getTime() + DAY_LENGTH;
    } else if (frequency === WEEKLY) {
        return date.getTime() + WEEK_LENGTH;
    } else if (frequency === MONTHLY) {
        const next_month = new Date();
        next_month.setMonth((next_month.getMonth() + 1) % 12);
        if (next_month.getMonth() === 0) {
            next_month.setFullYear(next_month.getFullYear() + 1);
        }
        return next_month.getTime();
    }
};

/**
 * Formats date as YYYY-MM-DD
 * @param {Date} date
 * @returns {string} YYYY-MM-DD string for a date
 */
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Will return the date of the beginning of the week (last sunday)
 * and the end of the week (this saturday)
 * @todo Current issue is that if the currentDateString is the start date
 * of a week it will return the previous week end and start date
 * @param {string} currentDateString
 * @returns {list} Two element list with the first being a string date of the first day of the week
 * and the second being the last day of the week
 */
const getWeekStartEndDate = (currentDateString) => {
    const currentDate = new Date(currentDateString);

    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(currentDate.getDate() - currentDate.getDay());

    const weekEndDate = new Date(currentDate);
    weekEndDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

    return [`${formatDate(weekStartDate)}`, `${formatDate(weekEndDate)}`];
};

/**
 * Will return the date of the beginning of the week and the end of the week
 * for the previous week
 * @param {string} inputDate String date for a day in the week
 * @returns {list} Two element list with the first being a string date of the first day of the week
 * and the second being the last day of the week
 */
const getPreviousWeekStartEndDate = (inputDate) => {
    const inputDateObject = new Date(inputDate);
    const weekPriorDateObject = new Date(inputDateObject);
    weekPriorDateObject.setDate(inputDateObject.getDate() - 6);
    return getWeekStartEndDate(formatDate(weekPriorDateObject));
};

/**
 * Will return the date of the beginning of the week and the end of the week
 * for the next week
 * @todo Current issue is that if the currentDateString is the start date
 * of a week it will return the current week end and start date
 * @param {string} inputDate String date for a day in the week
 * @returns {list} Two element list with the first being a string date of the first day of the week
 * and the second being the last day of the week
 */
const getNextWeekStartEndDate = (inputDate) => {
    const inputDateObject = new Date(inputDate);
    const weekNextDateObject = new Date(inputDateObject);
    weekNextDateObject.setDate(inputDateObject.getDate() + 6);
    return getWeekStartEndDate(formatDate(weekNextDateObject));
};

/**
 * Gets the start and end of the month a date is in
 * @param {string} currentDateString Current date as a string
 * @returns {list} Two element list with the first being a string date of the first day of the month
 * and the second being the last day of the month
 */
const getMonthStartEndDate = (currentDateString) => {
    const currentDate = new Date(currentDateString);

    // Get the first day of the month
    const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last day of the month
    const monthEndDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return [`${formatDate(monthStartDate)}`, `${formatDate(monthEndDay)}`];
};

/**
 * Gets the start and end of the month previous to the one a date is in
 * @param {string} currentDateString Current date as a string
 * @returns {list} Two element list with the first being a string date of the first day of the month
 * and the second being the last day of the month
 */
const getPreviousMonthStartEndDate = (currentDateString) => {
    const currentDate = new Date(currentDateString);

    // Calculate the first day of the previous month
    const firstDayOfPreviousMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
    );
    // Calculate the last day of the previous month
    const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    return [`${formatDate(firstDayOfPreviousMonth)}`, `${formatDate(lastDayOfPreviousMonth)}`];
};

/**
 * Gets the start and end of the month after the one a date is in
 * @param {string} currentDateString Current date as a string
 * @returns {list} Two element list with the first being a string date of the first day of the month
 * and the second being the last day of the month
 */
const getNextMonthStartEndDate = (currentDateString) => {
    const currentDate = new Date(currentDateString);
    currentDate.setMonth(currentDate.getMonth() + 1, 1);
    const nextMonthStartDate = new Date(currentDate);
    const nextMonthEndDate = new Date(currentDate);
    nextMonthEndDate.setMonth(nextMonthEndDate.getMonth() + 1, 0);

    return [`${formatDate(nextMonthStartDate)}`, `${formatDate(nextMonthEndDate)}`];
};

/**
 * Gets the start and end of the year a date is in
 * @param {string} currentDateString Current date as a string
 * @returns {list} Two element list with the first being a string date of the first day of the year
 * and the second being the last day of the year
 */
const getYearStartEndDate = (currentDateString) => {
    const currentDate = new Date(currentDateString);
    return [`${currentDate.getUTCFullYear()}-01-01`, `${currentDate.getUTCFullYear()}-12-31`];
};

/**
 * Gets the start and end of the year previous to the one a date is in
 * @param {string} currentDateString Current date as a string
 * @returns {list} Two element list with the first being a string date of the first day of the year
 * and the second being the last day of the year
 */
const getPreviousYearStartEndDate = (currentDateString) => {
    const currentDate = new Date(currentDateString);
    return [
        `${currentDate.getUTCFullYear() - 1}-01-01`,
        `${currentDate.getUTCFullYear() - 1}-12-31`,
    ];
};

/**
 * Gets the start and end of the year after the one a date is in
 * @param {string} currentDateString Current date as a string
 * @returns {list} Two element list with the first being a string date of the first day of the year
 * and the second being the last day of the year
 */
const getNextYearStartEndDate = (currentDateString) => {
    const currentDate = new Date(currentDateString);
    return [
        `${currentDate.getUTCFullYear() + 1}-01-01`,
        `${currentDate.getUTCFullYear() + 1}-12-31`,
    ];
};

/**
 * Converts a datetime string to a dateobject
 * @param {string} datetimeString YYYY-MM-DD hh:mm:ss string representing a datetime
 * @returns {Date} Date object with the values taken from the datetime string
 */
const getDateFromUTCDatetimeString = (datetimeString) => {
    const datetimeParts = TIMESTAMP_REGEX.exec(datetimeString);
    const date = new Date();
    date.setUTCFullYear(parseInt(datetimeParts[1], 10));
    date.setUTCMonth(parseInt(datetimeParts[2], 10) - 1);
    date.setUTCDate(parseInt(datetimeParts[3], 10));
    date.setUTCHours(parseInt(datetimeParts[4], 10));
    date.setUTCMinutes(parseInt(datetimeParts[5], 10));
    date.setUTCSeconds(parseInt(datetimeParts[6], 10));
    return date;
};

const getDateFromDatetimeString = (datetimeString) => {
    const datetimeParts = TIMESTAMP_REGEX.exec(datetimeString);
    const date = new Date();
    date.setFullYear(parseInt(datetimeParts[1], 10));
    date.setMonth(parseInt(datetimeParts[2], 10) - 1);
    date.setDate(parseInt(datetimeParts[3], 10));
    date.setHours(parseInt(datetimeParts[4], 10));
    date.setMinutes(parseInt(datetimeParts[5], 10));
    date.setSeconds(parseInt(datetimeParts[6], 10));
    return date;
};

export {
    getCurrentDateString,
    getCurrentUTCTimestamp,
    incrementDateByFrequency,
    getWeekStartEndDate,
    getNextWeekStartEndDate,
    getPreviousWeekStartEndDate,
    getMonthStartEndDate,
    getNextMonthStartEndDate,
    getPreviousMonthStartEndDate,
    getYearStartEndDate,
    getPreviousYearStartEndDate,
    getNextYearStartEndDate,
    getCurrentUTCDatetimeString,
    getDateFromUTCDatetimeString,
    getDateStringFromDate,
    getDatetimeString,
    getDateFromDatetimeString,
};
