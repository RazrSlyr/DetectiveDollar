import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

import {
    getCurrentUTCDatetimeString,
    getDateFromUTCDatetimeString,
    getDateStringFromDate,
    incrementDateByFrequency,
} from './DatetimeUtils';
import { generateRandomName, printAdjectives } from './NameUtils';
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
    createCategoryInsert,
    CREATE_CATEGORY_TABLE,
    GET_ALL_CATEGORIES_QUERY,
    GET_ALL_REACURRING_EXPENSES,
    createReacurringExpenseNextTriggerUpdate,
    createLastReacurrenceQuery,
    createExpenseByIdQuery,
    createReacurringDeleteById,
    createCategoryQueryByName,
    createCategoryQueryById,
} from './SQLiteUtils';
import { DAY_LENGTH, NO_REPETION } from '../constants/FrequencyConstants';
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
}

export async function addRowToCategoryTable(categoryName, icon = null, color = null) {
    const db = await getDatabase();
    let categoryId = null;
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(createCategoryInsert(categoryName, icon, color));
        categoryId = (await tx.executeSqlAsync(createCategoryQueryByName(categoryName))).rows[0][
            'id'
        ];
    });
    return categoryId;
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

export async function getCategoryNameFromId(categoryId) {
    let categoryName = null;
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        categoryName = (await tx.executeSqlAsync(createCategoryQueryById(categoryId))).rows[0][
            'name'
        ];
    });
    return categoryName;
}

export async function getExpensesbyCategory(startDate, endDate) {
    const categoryDict = {};
    const rows = await getExpensesFromDayframe(startDate, endDate);

    for (const row of rows) {
        if (row['category'] in categoryDict) {
            categoryDict[await getCategoryNameFromId(row['category'])].push(row);
        } else {
            categoryDict[await getCategoryNameFromId(row['category'])] = [row];
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

export async function getCategoryColorByName(categoryName) {
    const db = await getDatabase();
    let color;
    await db.transactionAsync(async (tx) => {
        color = (await tx.executeSqlAsync(createCategoryQueryByName(categoryName))).rows[0][
            'color'
        ];
    });
    return color;
}

export async function getCategoryColorById(categoryId) {
    const db = await getDatabase();
    let color;
    await db.transactionAsync(async (tx) => {
        color = (await tx.executeSqlAsync(createCategoryQueryById(categoryId))).rows[0]['color'];
    });
    return color;
}

export async function createExampleData() {
    const exampleCategories = [
        {
            name: 'Food',
            icon: 'fastfood',
            color: 'red',
        },
        {
            name: 'Housing',
            icon: 'house',
            color: 'blue',
        },
        {
            name: 'Social',
            icon: 'people',
            color: 'purple',
        },
        {
            name: 'Personal',
            icon: 'person',
            color: 'blue',
        },
        {
            name: 'Entertainment',
            icon: 'videogame-asset',
            color: 'orange',
        },
        {
            name: 'Other',
            icon: 'attach-money',
            color: 'green',
        },
    ];

    // Add example categories
    const db = await getDatabase();
    let promises = [];
    for (let i = 0; i < exampleCategories.length; i++) {
        const category = exampleCategories[i];
        const createCategoryAndSetId = async () => {
            const categoryId = await addRowToCategoryTable(
                category['name'],
                category['icon'],
                category['color']
            );
            exampleCategories[i]['id'] = categoryId;
        };
        promises.push(createCategoryAndSetId());
    }
    await Promise.all(promises);

    // Add year worth of expenses

    // Get current time and rewind a year back
    const currentTimestamp = new Date().getTime();
    let timestampOfExpense = new Date();
    timestampOfExpense.setFullYear(timestampOfExpense.getFullYear() - 1);
    timestampOfExpense = timestampOfExpense.getTime();

    // Start Looping and Generating Insert Commands
    const insertCommands = [];
    const MINIMUM_EXPENSES = 3;
    const MAXIMUM_EXPENSES = 10;
    const TEN_MINUTES_IN_MILLISECONDS = 10 * 60 * 1000;
    while (timestampOfExpense <= currentTimestamp) {
        const numberOfExpenses =
            Math.floor(Math.random() * (MAXIMUM_EXPENSES - MINIMUM_EXPENSES + 1)) +
            MINIMUM_EXPENSES;
        for (let i = 0; i < numberOfExpenses; i++) {
            const timestamp = timestampOfExpense - TEN_MINUTES_IN_MILLISECONDS * i;
            const date = new Date();
            date.setTime(timestamp);
            const category =
                exampleCategories[Math.floor(Math.random() * exampleCategories.length)];
            const name = generateRandomName();
            const amount = Math.floor(Math.random() * 1001);
            insertCommands.push(
                createExpenseInsert(
                    name,
                    category['id'],
                    amount,
                    `datetime(${timestamp / 1000}, 'unixepoch')`,
                    getDateStringFromDate(date),
                    null,
                    null,
                    null,
                    null
                )
            );
        }
        timestampOfExpense += DAY_LENGTH;
    }

    // Run Insert Commands
    await db.transactionAsync(async (tx) => {
        promises = [];
        insertCommands.forEach((command) => {
            promises.push(tx.executeSqlAsync(command));
        });
        await Promise.all(promises);
    });
}
