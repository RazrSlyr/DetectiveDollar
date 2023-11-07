import { DAILY, DAY_LENGTH, MONTHLY, WEEKLY, WEEK_LENGTH } from "../constants/FrequencyConstants";

const getCurrentDateString = () => {
    const date = new Date();
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
}

export { getCurrentDateString, getCurrentUTCTimestamp, incrementDateByFrequency };
