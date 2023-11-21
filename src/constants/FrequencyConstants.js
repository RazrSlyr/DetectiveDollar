const NO_REPETION = 'None';
const DAILY = 'Daily';
const WEEKLY = 'Weekly';
const MONTHLY = 'Monthly';

const DAY_LENGTH = (() => {
    const day = new Date(0);
    const nextDay = new Date(0);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.getTime() - day.getTime();
})();

const WEEK_LENGTH = DAY_LENGTH * 7;

export { NO_REPETION, DAILY, WEEKLY, MONTHLY, DAY_LENGTH, WEEK_LENGTH };
