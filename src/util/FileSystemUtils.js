import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

import {
    getCurrentDateString,
    getCurrentUTCDatetimeString,
    getDateFromDatetimeString,
    getDateStringFromDate,
    incrementDateByFrequency,
} from './DatetimeUtils';
import {
    CREATE_EXPENSES_TABLE,
    CREATE_REACCURING_TABLE,
    GET_EXPENSES_TABLE_QUERY,
    SET_EXPENSE_CATERGORY_AS_INDEX,
    SET_EXPENSE_DAY_AS_INDEX,
    createExpenseByDayQuery,
    deleteExpense,
    createExpenseInsert,
    createExpenseByTimeframeQuery,
    createExpenseByDayFrameQuery,
    createReacurringInsert,
    createReacurringByIdQuery,
    createExpenseInsertWithReacurringId,
    createCategoryInsert,
    CREATE_CATEGORY_TABLE,
    GET_ALL_CATEGORIES_QUERY,
    GET_ALL_REACURRING_EXPENSES,
    createReacurringExpenseNextTriggerUpdate,
    createLastReacurrenceQuery,
    createExpenseByIdQuery,
    createExpenseDeleteById,
    createReacurringDeleteById,
} from './SQLiteUtils';
import { NO_REPETION } from '../constants/FrequencyConstants';
import { ALBUMNNAME } from '../constants/ImageConstants';

const dataDir = FileSystem.documentDirectory + 'SQLite';
const databaseName = 'DetectiveDollar.db';

let appliedReacurring = false;

// Gets the database if it exists. If not, creates it
async function getDatabase() {
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

export async function getCategoryTable() {
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        rows = (await tx.executeSqlAsync(GET_ALL_CATEGORIES_QUERY)).rows;
    });
    return rows;
}

export async function getExpenseTable() {
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        rows = (await tx.executeSqlAsync(GET_EXPENSES_TABLE_QUERY)).rows;
    });
    return rows;
}

export async function addRowToExpenseTable(
    name,
    category,
    amount,
    day,
    expenseFrequency,
    imageURI = null
) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        if (expenseFrequency === NO_REPETION) {
            await tx.executeSqlAsync(createExpenseInsert(name, category, amount, day, imageURI));
            return;
        }
        const reacurringInsertId = (
            await tx.executeSqlAsync(createReacurringInsert(expenseFrequency))
        )?.insertId;
        const reacurringEntryTimestamp = (
            await tx.executeSqlAsync(createReacurringByIdQuery(reacurringInsertId))
        ).rows[0].start;
        await tx.executeSqlAsync(
            createExpenseInsertWithReacurringId(
                name,
                category,
                amount,
                day,
                reacurringEntryTimestamp,
                imageURI,
                reacurringInsertId
            )
        );
    });
}

export async function addRowToCategoryTable(category) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(createCategoryInsert(category));
    });
}

export async function getRowFromExpenseTable(row) {
    const db = await getDatabase();
    let rowData = null;
    await db.transactionAsync(async (tx) => {
        rowData = await tx.executeSqlAsync(createExpenseByIdQuery(row));
    });
    return rowData.rows[0];
}

export async function deleteRowFromExpenseTable(row) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(deleteExpense(row));
    });
}

export async function deleteRowFromReacurringTable(row) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(createReacurringDeleteById(row));
    });
}

export async function getExpensesFromDay(day) {
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        rows = (await tx.executeSqlAsync(createExpenseByDayQuery(day))).rows;
    });
    return rows;
}

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

export async function getExpensesFromDayframe(startDay, endDay) {
    //params: ISO format strings: YYYY-MM-DD or YYYY-MM-DD hh:mm:ss
    const db = await getDatabase();
    //const startTimestamp = Date.parse(startDay);
    //const endTimestamp = Date.parse(endDay);
    //if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
    //    console.warn(`malformed ISO strings to get timestamp ${startDay} ${endDay}`);
    //    return [];
    //}
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

export async function getExpensesbyCategory(startDate, endDate) {
    const categoryDict = {};
    const rows = await getExpensesFromDayframe(startDate, endDate);

    for (const row of rows) {
        if (row['category'] in categoryDict) {
            categoryDict[row['category']].push(row);
        } else {
            categoryDict[row['category']] = [row];
        }
    }

    return categoryDict;
}

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
        let recurrenceDate = getDateFromDatetimeString(element['next_trigger']);
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

        while (lastRecurrance != null && recurrenceDate < currentDate) {
            await db.transactionAsync(async (tx) => {
                try {
                    const newRecurranceDay = getDateStringFromDate(recurrenceDate);
                    // Add expense using obtained data
                    await tx.executeSqlAsync(
                        createExpenseInsertWithReacurringId(
                            lastRecurrance['name'],
                            lastRecurrance['category'],
                            lastRecurrance['amount'],
                            newRecurranceDay,
                            getCurrentUTCDatetimeString(recurrenceDate),
                            lastRecurrance['picture'],
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

async function getImageDirectory() {
    const specificDirectory = ALBUMNNAME;
    const directory = `${FileSystem.documentDirectory}${specificDirectory}/`;

    // Check if the directory exists, if not, create it
    const directoryInfo = await FileSystem.getInfoAsync(directory);

    if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
    return directory;
}
export async function saveImage(imageURI) {
    if (!imageURI) {
        return null;
    }
    const dir = await getImageDirectory();
    const fileName = `IMG_${Date.now()}.jpg`;
    const newImageUri = `${dir}${fileName}`;
    try {
        await FileSystem.moveAsync({
            from: imageURI,
            to: newImageUri,
        });

        console.log('Image saved:', newImageUri);
        return newImageUri;
    } catch (error) {
        console.error('Error saving image:', error);
        return null;
    }
}

export async function deleteImage(imageURI) {
    if (!imageURI) {
        return;
    }
    try {
        await FileSystem.deleteAsync(imageURI, { intermediates: true });
        console.log('Image deleted');
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}
