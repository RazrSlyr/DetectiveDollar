/**
 * @module SqliteUtils
 */

/**
 * @file Used for storing and generating SQLite commands. Allow separation of JavaScript from SQLite
 */

import { incrementDateByFrequency } from './DatetimeUtils';

const CREATE_REACCURING_TABLE = `CREATE TABLE IF NOT EXISTS reacurring (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    frequency TEXT NOT NULL,
    start DATETIME NOT NULL,
    next_trigger DATETIME
);`;

const CREATE_CATEGORY_TABLE = `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    icon TEXT,
    color TEXT,
    UNIQUE(name)
);`;

const CREATE_EXPENSES_TABLE = `CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category INTEGER NOT NULL,
    subcategory TEXT,
    amount REAL NOT NULL,
    picture TEXT,
    memo TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    day TEXT NOT NULL,
    reacurring_id INTEGER,
    FOREIGN KEY (reacurring_id) REFERENCES reacurring (id),
    FOREIGN KEY (category) REFERENCES categories (name)
);`;

const SET_EXPENSE_CATERGORY_AS_INDEX = `CREATE INDEX idx_category 
ON expenses (category);`;

const SET_EXPENSE_DAY_AS_INDEX = `CREATE INDEX idx_day 
ON expenses (day);`;

const GET_EXPENSES_TABLE_QUERY = 'SELECT * FROM expenses ORDER BY timestamp DESC;';

const GET_CATEGORY_QUERY = 'SELECT DISTINCT category FROM expenses;';

const GET_ALL_CATEGORIES_QUERY = 'SELECT * FROM categories;';

const GET_ALL_REACURRING_EXPENSES = 'SELECT * FROM reacurring';

/**
 * Creates a DELETE command that deletes an expense
 * @param {integer} id - The ID of the expense entry
 * @return {string} The SQLite DELETE command that deletes that expense
 */
const deleteExpense = (id) => {
    return `DELETE FROM expenses WHERE id = ${id}`;
};

/**
 * Creates a DELETE command that deletes a recurring expense entry
 * @param {integer} id - The ID of the recurring expense entry
 * @return {string} The SQLite DELETE command that deletes that entry
 */
const createReacurringDeleteById = (id) => {
    return `DELETE FROM reacurring WHERE id = ${id};`;
};

/**
 * Creates an INSERT command that adds an expense entry
 * @param {string} name - The name of the expense
 * @param {string} category - The category of the expense
 * @param {float} amount - The amount of the expense
 * @param {string} timestamp - The timestamp of the expense. Must be in SQLite Timestamp format or a SQLite datetime function call
 * @param {string} day - The day in local time of the expense in YYYY-MM-DD format
 * @param {string} subcategory - (optional) The subcategory of the expense
 * @param {string} picture - (optional) The image path for the expense
 * @param {string} memo - (optional) The memo of the expense
 * @param {string} reacurringId - (optional) The reacurring entry id for the expense
 * @return {string} The SQLite INSERT command that adds that entry
 */
const createExpenseInsert = (
    name,
    category,
    amount,
    timestamp,
    day,
    subcategory = null,
    picture = null,
    memo = null,
    reacurringId = null
) => {
    return `INSERT INTO expenses (name, category, amount, timestamp, day, subcategory, picture, memo, reacurring_id)
    VALUES ('${name}', ${category}, ${amount}, ${timestamp}, '${day}', ${
        subcategory !== null ? `'${subcategory}'` : null
    }, ${picture !== null ? `'${picture}'` : null}, ${memo !== null ? `'${memo}'` : null}, ${
        reacurringId !== null ? `${reacurringId}` : null
    });`;
};

/**
 * Creates an INSERT command that adds an reacurring expense entry
 * @param {string} start - The start date of the expense as a numerical timestamp in milliseconds
 * @param {string} frequency - The frequency of the reacurrence. Uses constants from FrequencyConstants.js
 * @return {string} The SQLite INSERT command that adds that entry
 */
const createReacurringInsert = (start, frequency) => {
    const startDate = new Date();
    startDate.setTime(start);
    const next = incrementDateByFrequency(startDate, frequency);
    const command = `INSERT INTO reacurring (frequency, start, next_trigger)
    VALUES ('${frequency}', datetime(${start / 1000}, 'unixepoch'), datetime(${
        next / 1000
    }, 'unixepoch'));`;
    return command;
};

/**
 * Creates an INSERT command that adds a category entry
 * @param {string} name - The name of the category
 * @param {string} icon - (optional) The icon for the category
 * @param {string} color - (optional) The color for the category. If not provided, defaults to black
 * @return {string} The SQLite INSERT command that adds that entry
 */
const createCategoryInsert = (name, icon = null, color = 'black') => {
    const command = `INSERT OR IGNORE INTO categories (name, icon, color)
    VALUES ('${name}', ${icon !== null ? `'${icon}'` : null}, ${
        color !== null ? `'${color}'` : null
    });`;
    return command;
};

/**
 * Creates a SELECT command that queries for expenses that occur on a given day
 * @param {string} day- The local time day of the expense in YYYY-MM-DD format
 * @return {string} The SQLite SELECT command that performs the query
 */
const createExpenseByDayQuery = (day) => {
    return `SELECT * FROM expenses WHERE day = '${day}' ORDER BY timestamp DESC`;
};

/**
 * Creates a SELECT command that queries for an expense with a specific id
 * @param {integer} id- The id of the expense
 * @return {string} The SQLite SELECT command that performs the query
 */
const createExpenseByIdQuery = (id) => {
    return `SELECT * FROM expenses WHERE id = ${id};`;
};

/**
 * Creates a SELECT command that queries for a recurring table entry with a specific id
 * @param {integer} id- The id of the entry
 * @return {string} The SQLite SELECT command that performs the query
 */
const createReacurringByIdQuery = (id) => {
    return `SELECT * FROM reacurring WHERE id = ${id};`;
};

/**
 * Creates a SELECT command that queries for expenses that occur between two timestamps
 * @param {integer} startTimestamp- The start timestamp in SQLite Timestamp format
 * @param {integer} endTimestamp- The end timestamp in SQLite Timestamp format
 * @return {string} The SQLite SELECT command that performs the query
 */
const createExpenseByTimeframeQuery = (startTimestamp, endTimestamp) => {
    return `SELECT * FROM expenses WHERE timestamp BETWEEN "${startTimestamp}" AND "${endTimestamp}" ORDER BY timestamp`;
};

/**
 * Creates a SELECT command that queries for expenses that occur between two days
 * @param {integer} startDay- The local time start day in YYYY-MM-DD
 * @param {integer} endDay- The local time end day in YYYY-MM-DD
 * @return {string} The SQLite SELECT command that performs the query
 */
const createExpenseByDayFrameQuery = (startDay, endDay) => {
    return `SELECT * FROM expenses WHERE DATE(day) BETWEEN '${startDay}' AND '${endDay}' ORDER BY DAY;`;
};

/**
 * Creates a SELECT command that queries for expenses from a category
 * @param {integer} category- The id of the category you are querying for
 * @return {string} The SQLite SELECT command that performs the query
 */
const createExpenseByCategoryQuery = (category) => {
    return `SELECT * FROM expenses WHERE category = ${category};`;
};

/**
 * Creates a UPDATE command that updates the next time a recurirng expense is supposed to recurr
 * @param {integer} id- The id of the recurring expense entry
 * @param {integer} nextUpdate- The numerical timestamp in milliseconds of the next update
 * @return {string} The SQLite UPDATE command that performs the update
 */
const createReacurringExpenseNextTriggerUpdate = (id, nextUpdate) => {
    return `UPDATE reacurring
    SET next_trigger = datetime(${nextUpdate / 1000}, 'unixepoch')
    WHERE id = ${id};`;
};

/**
 * Creates a SELECT command that queries for most recent entry for a recurring expense
 * @param {integer} id - The id of recurring table entry
 * @return {string} The SQLite SELECT command that performs the query
 */
const createLastReacurrenceQuery = (id) => {
    return `SELECT * FROM expenses WHERE reacurring_id = ${id} ORDER BY timestamp DESC LIMIT 1;`;
};

/**
 * Creates a SELECT command that queries for a category given its name
 * @param {string} name - The name of the category
 * @return {string} The SQLite SELECT command that performs the query
 */
const createCategoryQueryByName = (name) => {
    return `SELECT * FROM categories WHERE name = '${name}' LIMIT 1;`;
};

/**
 * Creates a SELECT command that queries for a category given its id
 * @param {integer} id - The id of the category
 * @return {string} The SQLite SELECT command that performs the query
 */
const createCategoryQueryById = (id) => {
    return `SELECT * FROM categories WHERE id = ${id} LIMIT 1;`;
};

/**
 * Creates a UPDATE command that updates the expense with the inputted id
 * @param {intger} id Id of expense to be update
 * @param {string} newName new name to be uodated into the expense
 * @param {integer} newCategory new category id to be uodated into the expense
 * @param {integer} newAmount new amount to be uodated into the expense
 * @param {string} newImageURI new image uri to be uodated into the expense
 * @param {string} newMemo new memo to be uodated into the expense
 * @return {string} The SQLite UPDATE command that performs the update
 */
const createEditExpenseQuery = (id, new_name, new_category, new_amount, new_picture, new_memo) => {
    return `UPDATE expenses 
            SET 
                name = '${new_name}',
                category = ${new_category},
                amount = ${new_amount},
                picture = '${new_picture}',
                memo = '${new_memo}'
            WHERE id = ${id};`;
};

export {
    CREATE_EXPENSES_TABLE,
    CREATE_REACCURING_TABLE,
    SET_EXPENSE_CATERGORY_AS_INDEX,
    SET_EXPENSE_DAY_AS_INDEX,
    GET_EXPENSES_TABLE_QUERY,
    GET_CATEGORY_QUERY,
    CREATE_CATEGORY_TABLE,
    GET_ALL_CATEGORIES_QUERY,
    GET_ALL_REACURRING_EXPENSES,
    createExpenseInsert,
    createCategoryInsert,
    deleteExpense,
    createExpenseByDayQuery,
    createExpenseByTimeframeQuery,
    createReacurringInsert,
    createExpenseByIdQuery,
    createReacurringByIdQuery,
    createExpenseByCategoryQuery,
    createReacurringExpenseNextTriggerUpdate,
    createLastReacurrenceQuery,
    createReacurringDeleteById,
    createExpenseByDayFrameQuery,
    createCategoryQueryByName,
    createCategoryQueryById,
    createEditExpenseQuery,
};
