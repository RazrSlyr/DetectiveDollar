import { getCategoryNameFromId } from './CategoryTableUtils';
import { getDatabase, incrementExpenseUpdatesInSession } from './DatabaseUtils';
import {
    GET_EXPENSES_TABLE_QUERY,
    createExpenseByDayQuery,
    deleteExpense,
    createExpenseInsert,
    createExpenseByTimeframeQuery,
    createExpenseByDayFrameQuery,
    createReacurringInsert,
    createReacurringByIdQuery,
    createExpenseByIdQuery,
    createEditExpenseQuery,
} from './SQLiteUtils';
import { NO_REPETION } from '../constants/FrequencyConstants';

/**
 * @module ExpenseTableUtils
 */

/**
 * @file Used for storing and reading from the SQLite Expense Table
 */

/**
 * Gets all entries in the expense table
 * @returns {list} List of all expense objects
 */
export async function getExpenseTable() {
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        rows = (await tx.executeSqlAsync(GET_EXPENSES_TABLE_QUERY)).rows;
    });
    return rows;
}

/**
 * Adds an expense to the database
 * @param {string} name Name of the expense
 * @param {integer} category ID of the category
 * @param {float} amount Cost amount of the expense
 * @param {integer} timestamp Timestamp of the expense as a number of milliseconds
 * @param {string} day The local time day of the expense in YYYY-MM-DD format
 * @param {string} subcategory (optional) The subcategory of the expense
 * @param {string} picture (optional) The image uri for the picture associated with the expense
 * @param {string} memo (optional) The memo for the expense
 * @param {integer} expenseFrequency (optional) The expense frequency. Use FrequencyConstants.js
 */
export async function addRowToExpenseTable(
    name,
    category,
    amount,
    timestamp,
    day,
    subcategory = null,
    picture = null,
    memo = null,
    expenseFrequency = NO_REPETION
) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        if (expenseFrequency === NO_REPETION) {
            await tx.executeSqlAsync(
                createExpenseInsert(
                    name,
                    category,
                    amount,
                    `datetime(${timestamp / 1000}, 'unixepoch')`,
                    day,
                    subcategory,
                    picture,
                    memo,
                    null
                )
            );
            return;
        }
        const reacurringInsertId = (
            await tx.executeSqlAsync(createReacurringInsert(timestamp, expenseFrequency))
        )?.insertId;
        const reacurringEntryTimestamp = (
            await tx.executeSqlAsync(createReacurringByIdQuery(reacurringInsertId))
        ).rows[0].start;
        await tx.executeSqlAsync(
            createExpenseInsert(
                name,
                category,
                amount,
                `'${reacurringEntryTimestamp}'`,
                day,
                subcategory,
                picture,
                memo,
                reacurringInsertId
            )
        );
    });
    incrementExpenseUpdatesInSession();
}

/**
 * Gets an expense from the database
 * @param {integer} row The id of the row in the expense table
 * @returns {object} The expense object with that id
 */
export async function getRowFromExpenseTable(row) {
    const db = await getDatabase();
    let rowData = null;
    await db.transactionAsync(async (tx) => {
        rowData = await tx.executeSqlAsync(createExpenseByIdQuery(row));
    });
    return rowData.rows[0];
}

/**
 * Deletes an expense from the database
 * @param {integer} row The id of the row in the expense table to delete
 */
export async function deleteRowFromExpenseTable(row) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(deleteExpense(row));
    });
}

/**
 * Gets all expenses from a specific day
 * @param {string} day Local time day in YYYY-MM-DD format
 * @returns {list} List of all expense objects from this day
 */
export async function getExpensesFromDay(day) {
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        rows = (await tx.executeSqlAsync(createExpenseByDayQuery(day))).rows;
    });
    return rows;
}

/**
 * Gets all expenses within two timestamps
 * @param {string} startDateStr Local time start date in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @param {string} endDateStr Local time end date in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @returns {list} List of expense objects that are within that timeframe
 */
export async function getExpensesFromTimeframe(startDateStr, endDateStr) {
    //params: ISO format strings: YYYY-MM-DD or YYYY-MM-DD hh:mm:ss
    const db = await getDatabase();
    const startTimestamp = Date.parse(startDateStr);
    const endTimestamp = Date.parse(endDateStr);
    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        console.warn(`malformed ISO strings to get timestamp ${startDateStr} ${endDateStr}`);
        return [];
    }
    let rows = [];
    await db.transactionAsync(async (tx) => {
        try {
            rows = (
                await tx.executeSqlAsync(createExpenseByTimeframeQuery(startDateStr, endDateStr))
            ).rows;
        } catch (error) {
            console.warn(`getExpensesFromTimeframe error ${error}`);
        }
    });
    return rows;
}

/**
 * Gets all expenses within two days
 * @param {string} startDay Local time start day in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @param {string} endDay Local time end day in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @returns {list} List of expense objects that are within that timeframe
 */
export async function getExpensesFromDayframe(startDay, endDay) {
    //params: ISO format strings: YYYY-MM-DD or YYYY-MM-DD hh:mm:ss
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        try {
            rows = (await tx.executeSqlAsync(createExpenseByDayFrameQuery(startDay, endDay))).rows;
        } catch (error) {
            console.warn(`getExpensesFromTimeframe error ${error}`);
        }
    });
    return rows;
}

/**
 * Gets all expenses within a specific start and end date, separated by category
 * @param {string} startDate Local time start day in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @param {*} endDate Local time end day in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @returns {object} Dictionary/Map object with the keys being the categories and the value being a list of expenses
 */
export async function getExpensesbyCategory(startDate, endDate) {
    const categoryDict = {};
    const rows = await getExpensesFromDayframe(startDate, endDate);

    for (const row of rows) {
        const categoryId = row['category'];
        const categoryName = await getCategoryNameFromId(categoryId);

        if (categoryName in categoryDict) {
            categoryDict[categoryName].push(row);
        } else {
            categoryDict[categoryName] = [row];
        }
    }

    return categoryDict;
}

/**
 * Updates the expense with the input id with new data
 * @param {intger} id Id of expense to be update
 * @param {string} newName new name to be uodated into the expense
 * @param {integer} newCategory new category id to be uodated into the expense
 * @param {integer} newAmount new amount to be uodated into the expense
 * @param {string} newImageURI new image uri to be uodated into the expense
 * @param {string} newMemo new memo to be uodated into the expense
 */
export async function updateExpense(id, newName, newCategory, newAmount, newImageURI, newMemo) {
    //console.log(id, newName, newCategory, newAmount, newDay, newImageURI, newMemo);
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(
            createEditExpenseQuery(id, newName, newCategory, newAmount, newImageURI, newMemo)
        );
    });
}
