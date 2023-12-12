import { getDatabase } from './DatabaseUtils';
import {
    getCurrentUTCDatetimeString,
    getDateFromUTCDatetimeString,
    getDateStringFromDate,
    incrementDateByFrequency,
} from './DatetimeUtils';
import {
    createExpenseInsert,
    GET_ALL_REACURRING_EXPENSES,
    createReacurringExpenseNextTriggerUpdate,
    createLastReacurrenceQuery,
    createReacurringDeleteById,
} from './SQLiteUtils';

/**
 * @module ExpenseTableUtils
 */

/**
 * @file Used for storing and reading from the SQLite Expense Table
 */

/**
 * Stops an expense from recurring
 * @param {integer} row The id of the row in the recurring expense table
 */

let appliedReacurring = false;

/**
 * Removes an entry from recurring expenses table
 * @param {integer} row Row ID for the table entry
 */
export async function deleteRowFromReacurringTable(row) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(createReacurringDeleteById(row));
    });
}

/**
 * Readds any expenses that need to recurr
 */
export async function applyRecurringExpenses() {
    if (appliedReacurring) {
        return;
    }
    const db = await getDatabase();
    let recurringExpenses = null;
    await db.transactionAsync(async (tx) => {
        try {
            recurringExpenses = (await tx.executeSqlAsync(GET_ALL_REACURRING_EXPENSES)).rows;
        } catch (error) {
            console.warn(`applyRecurringExpenses error ${error}`);
        }
    });
    const currentDate = new Date();
    for (let i = 0; i < recurringExpenses?.length; i++) {
        const element = recurringExpenses[i];
        let recurrenceDate = getDateFromUTCDatetimeString(element['next_trigger']);
        // Get last expense to get data
        let lastRecurrance = null;
        await db.transactionAsync(async (tx) => {
            try {
                // Get last expense to get data
                const lastRecurranceData = await tx.executeSqlAsync(
                    createLastReacurrenceQuery(element['id'])
                );
                if (lastRecurranceData?.rows?.length === 0) {
                    return;
                }
                lastRecurrance = lastRecurranceData.rows[0];
            } catch (error) {
                console.warn(`applyRecurringExpenses error ${error}`);
            }
        });

        while (lastRecurrance != null && recurrenceDate <= currentDate) {
            await db.transactionAsync(async (tx) => {
                try {
                    const newRecurranceDay = getDateStringFromDate(recurrenceDate);
                    // Add expense using obtained data
                    await tx.executeSqlAsync(
                        createExpenseInsert(
                            lastRecurrance['name'],
                            lastRecurrance['category'],
                            lastRecurrance['amount'],
                            `'${getCurrentUTCDatetimeString(recurrenceDate)}'`,
                            newRecurranceDay,
                            lastRecurrance['subcategory'],
                            lastRecurrance['picture'],
                            lastRecurrance['memo'],
                            lastRecurrance['reacurring_id']
                        )
                    );
                    // Advance recurrence to next date
                    recurrenceDate = new Date(
                        incrementDateByFrequency(recurrenceDate, element['frequency'])
                    );
                    // Update the next trigger time
                    await tx.executeSqlAsync(
                        createReacurringExpenseNextTriggerUpdate(element['id'], recurrenceDate)
                    );
                } catch (error) {
                    console.warn(`applyRecurringExpenses error ${error}`);
                }
            });
        }
    }
    appliedReacurring = true;
}
