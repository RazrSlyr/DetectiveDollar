import { DAILY, DAY_LENGTH, MONTHLY, WEEKLY, WEEK_LENGTH } from '../constants/FrequencyConstants';
import { TIMESTAMP_REGEX } from '../constants/Regex';

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

const getCurrentDateString = () => {
    const date = new Date();
    return getDateStringFromDate(date);
};

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
}

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

const getCurrentUTCTimestamp = () => {
    return Date.now();
};

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

export {
    getCurrentDateString,
    getCurrentUTCTimestamp,
    incrementDateByFrequency,
    getCurrentUTCDatetimeString,
    getDateFromUTCDatetimeString,
    getDateStringFromDate,
    getDatetimeString,
};