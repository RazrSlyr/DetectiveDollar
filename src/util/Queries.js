import { csvToJsonList } from './CsvUtils';
import { getExpenseSheet } from './FileSystemUtils';

//might not need to make async
export async function getExpensesByTime(startDateStr, endDateStr) {
    //once we have db setup use timestamps instead of date strings to query
    // where timestamp < startTimestamp, where timestamp > endTimestamp
    /*
    Params:
        startDateStr: string : "YYYY-MM-DD"
        endDateStr: string : "YYYY-MM-DD"
    Return: list of json objects
        [expense_1, expense_2]
    */
    const expenses = csvToJsonList(await getExpenseSheet());
    const dates = getDatesBetween(startDateStr, endDateStr);
    expenses.filter((expense) => dates.includes(expense['date']));
    return expenses;
}

function getDatesBetween(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate) || isNaN(endDate)) {
        return [];
    }

    const dates = [];
    const currentDate = startDate;

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().slice(0, 10));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
