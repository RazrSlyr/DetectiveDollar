import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

import {
    CREATE_EXPENSES_TABLE,
    CREATE_REACCURING_TABLE,
    SET_EXPENSE_CATERGORY_AS_INDEX,
    SET_EXPENSE_DAY_AS_INDEX,
    CREATE_CATEGORY_TABLE,
} from './SQLiteUtils';

const dataDir = FileSystem.documentDirectory + 'SQLite';
const databaseName = 'DetectiveDollar.db';
let expenseUpdatesInSession = 0;

/**
 * @module DatabaseUtils
 */

/**
 * @file Contains methods used by various different parts of the Database or are not specific to
 * one Database table
 */

/**
 * Gets a reference to the SQLite database, creating it if it doesn't exist
 * @returns A reference to the SQLite database
 */
export async function getDatabase() {
    let firstTime = false;
    const dirInfo = await FileSystem.getInfoAsync(dataDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dataDir);
        firstTime = true;
    }
    const db = SQLite.openDatabase(databaseName);
    if (!firstTime) return db;
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(CREATE_REACCURING_TABLE);
        await tx.executeSqlAsync(CREATE_CATEGORY_TABLE);
        await tx.executeSqlAsync(CREATE_EXPENSES_TABLE);
        const promises = [
            tx.executeSqlAsync(SET_EXPENSE_CATERGORY_AS_INDEX),
            tx.executeSqlAsync(SET_EXPENSE_DAY_AS_INDEX),
        ];
        await Promise.all(promises);
    });
    return db;
}

/**
 * Gets the number of times the Expense table has changed in the recent session
 * @returns {integer} The number of times the expense related information has been updated
 */
export function getExpenseUpdatesInSession() {
    return expenseUpdatesInSession;
}

/**
 * Increments the number of expense updates in the session by one
 */
export function incrementExpenseUpdatesInSession() {
    expenseUpdatesInSession += 1;
}

/**
 * Resets number of updates in session
 */
export function resetExpenseUpdatesInSession() {
    expenseUpdatesInSession = 0;
}
