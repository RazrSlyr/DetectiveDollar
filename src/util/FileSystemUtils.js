import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

import {
    CREATE_EXPENSES_TABLE,
    CREATE_REACCURING_TABLE,
    GET_EXPENSES_TABLE_QUERY,
    SET_EXPENSE_CATERGORY_AS_INDEX,
    SET_EXPENSE_DAY_AS_INDEX,
    GET_CATEGORY_QUERY,
    createExpenseByDayQuery,
    deleteExpense,
    createExpenseInsert,
    createExpenseByTimeframeQuery,
    createExpenseByIdQuery,
    createReacurringInsert,
    createReacurringByIdQuery,
    createExpenseInsertWithReacurringId,
} from './SQLiteUtils';
import { NO_REPETION } from '../constants/FrequencyConstants';
import { ALBUMNNAME } from '../constants/ImageConstants';

const dataDir = FileSystem.documentDirectory + 'SQLite';
const databaseName = 'DetectiveDollar.db';

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
        await tx.executeSqlAsync(CREATE_EXPENSES_TABLE);
        const promises = [
            tx.executeSqlAsync(SET_EXPENSE_CATERGORY_AS_INDEX),
            tx.executeSqlAsync(SET_EXPENSE_DAY_AS_INDEX),
        ];
        await Promise.all(promises);
    });
    return db;
}

export async function getExpenseTable() {
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        rows = (await tx.executeSqlAsync(GET_EXPENSES_TABLE_QUERY)).rows;
    });
    console.log(rows);
    return rows;
}

export async function addRowToExpenseTable(
    name,
    category,
    amount,
    day,
    expenseFrequency,
    image_uri = null
) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        if (expenseFrequency === NO_REPETION) {
            await tx.executeSqlAsync(createExpenseInsert(name, category, amount, day, image_uri));
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
                image_uri,
                reacurringInsertId
            )
        );
    });
}

export async function deleteRowFromExpenseTable(row) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(deleteExpense(row));
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

export async function getExpensesbyCategory() {
    const db = await getDatabase();
    const categoryDict = {};

    let rows = [];
    await db.transactionAsync(async (tx) => {
        try {
            rows = (await tx.executeSqlAsync(GET_EXPENSES_TABLE_QUERY)).rows;
        } catch (error) {
            console.warn(`getExpensesbyCategory error ${error}`);
        }
    });

    for (const row of rows) {
        if (row['category'] in categoryDict) {
            categoryDict[row['category']].push(row);
        } else {
            categoryDict[row['category']] = [row];
        }
    }
    return categoryDict;
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
export async function addImage(imageURI) {
    if (!imageURI) {
        return;
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
