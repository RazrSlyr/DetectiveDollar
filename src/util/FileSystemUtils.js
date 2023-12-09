/**
 * @module FileSystemUtils
 */

/**
 * @file Used for storing and reading from the file system. Primarily the SQLite Database and Image directory
 */

import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

import {
    getCurrentUTCDatetimeString,
    getDateFromUTCDatetimeString,
    getDateStringFromDate,
    incrementDateByFrequency,
} from './DatetimeUtils';
import { generateRandomName } from './NameUtils';
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
    createEditExpenseQuery,
} from './SQLiteUtils';
import { DAY_LENGTH, NO_REPETION } from '../constants/FrequencyConstants';
import { ALBUMNNAME } from '../constants/ImageConstants';

const dataDir = FileSystem.documentDirectory + 'SQLite';
const databaseName = 'DetectiveDollar.db';

let appliedReacurring = false;

let expenseUpdatesInSession = 0;

export function getExpenseUpdatesInSession() {
    return expenseUpdatesInSession;
}

/**
 * Gets a reference to the SQLite database, creating it if it doesn't exist
 * @returns A reference to the SQLite database
 */
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

/**
 * Gets all entries in the category table
 * @returns {list} List of all category objects
 */
export async function getCategoryTable() {
    const db = await getDatabase();
    let rows = [];
    await db.transactionAsync(async (tx) => {
        rows = (await tx.executeSqlAsync(GET_ALL_CATEGORIES_QUERY)).rows;
    });
    return rows;
}

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

export async function getExpensesTableCategoryJoin() {
    const db = await getDatabase();
    let expenses = [];
    await db.transactionAsync(async (tx) => {
        expenses = (
            await tx.executeSqlAsync(
                `
                SELECT 
                expenses.id,
                expenses.name,
                expenses.amount,
                expenses.day,
                expenses.timestamp,
                expenses.reacurring_id,
                categories.id AS category_id,
                categories.name AS category_name,
                categories.color AS category_color 
                FROM expenses 
                INNER JOIN categories ON categories.id = expenses.category        
                ORDER BY timestamp;
                `
            )
        ).rows;
    });
    //console.log(expenses);
    return expenses;
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
    expenseUpdatesInSession += 1;
}

/**
 * Adds a category to the database
 * @param {string} categoryName Name of the category
 * @param {string} color (optional) Color either as a hexcode or a builtin CSS Color
 * @param {string} icon (optional) Icon Name
 * @returns {integer} The ID of the category that is added
 */
export async function addRowToCategoryTable(categoryName, color = 'black', icon = null) {
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
 * Update a category to have a new name and/or color
 * If both name and color are not provided, this does nothing
 * @param {integer} row_id The ID of the row in the category table for this category
 * @param {string} name (optional) The new category name
 * @param {string} color (optional) The new category color as a hexcode or builtin CSS color
 */
export async function updateRowFromCategoryTable(row_id, name = null, color = null) {
    if (row_id === undefined || row_id === null) {
        return;
    }
    if (name == null && color == null) return;
    console.log('attempt to update category', row_id);
    const db = await getDatabase();
    try {
        // Need to update Category Table
        await db.transactionAsync(async (tx) => {
            await tx.executeSqlAsync(
                `UPDATE OR IGNORE categories SET ${name != null ? `name = '${name}', ` : ''}${
                    color != null ? `color = '${color}' ` : ''
                }WHERE id = ${row_id};`
            );
        });
        console.log('success');
    } catch (error) {
        console.error('fail', error);
    }
    expenseUpdatesInSession += 1;
}

/**
 * Removes a category
 * @param {integer} row_id The id of the row in the table to delete
 */
export async function deleteRowFromCategoryTable(row_id) {
    if (row_id === undefined || row_id === null) {
        return;
    }
    console.log('attempt to delete category', row_id);
    const db = await getDatabase();
    // when changing to use int primary key,
    // remove quotes from row_id
    try {
        await db.transactionAsync(async (tx) => {
            await tx.executeSqlAsync(
                `UPDATE expenses SET category = "None" WHERE category = '${row_id}';`
            );
        });
        console.log('update expenses');
        await db.transactionAsync(async (tx) => {
            await tx.executeSqlAsync(`DELETE FROM categories WHERE name = '${row_id}';`);
        });
        console.log('success');
    } catch (error) {
        console.error('fail', error);
    }
}

/**
 * Stops an expense from recurring
 * @param {integer} row The id of the row in the recurring expense table
 */
export async function deleteRowFromReacurringTable(row) {
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(createReacurringDeleteById(row));
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
 * Gets a category's name by its id
 * @param {integer} categoryId The id of the category
 * @returns {string} The name of that category
 */
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

/**
 * Gets the category object from the id
 * @param {integer} categoryId The id of the category
 * @returns {object} The category object with that id
 */
export async function getCategoryFromId(categoryId) {
    let category = null;
    const db = await getDatabase();
    await db.transactionAsync(async (tx) => {
        category = (await tx.executeSqlAsync(createCategoryQueryById(categoryId))).rows[0];
    });
    return category;
}

/**
 * Gets all expenses within a specific start and end date, separated by category
 * @param {string} startDate Local time start day in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @param {*} endDate Local time end day in either YYYY-MM-DD format or YYYY-MM-DD hh:mm:ss format
 * @returns {object} Dictionary/Map object with the keys being the categories and the value being a list of expenses
 */
export async function getExpensesbyCategory(startDate, endDate) {
    const categoryDict = {};
    const db = await getDatabase();
    let expenses = [];
    await db.transactionAsync(async (tx) => {
        try {
            expenses = (
                await tx.executeSqlAsync(
                    `
                    SELECT expenses.name AS expense_name, * 
                    FROM expenses 
                    INNER JOIN categories ON categories.id = expenses.category
                    WHERE day BETWEEN "${startDate}" AND "${endDate}" 
                    ORDER BY timestamp;
                    `
                )
            ).rows;
        } catch (error) {
            console.warn(`getExpensesFromTimeframe error ${error}`);
        }
    });
    for (const row of expenses) {
        //console.log('expense', row);
        const categoryName = row['name'];

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

/**
 * Gets the path of the image directory, creating it if it doesn't exist
 * @returns The image directory path
 */
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

/**
 * Saves an image to the image directory
 * @param {string} imageURI The uri of the image to save
 */
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

/**
 * Deletes an image from the image directory
 * @param {string} imageURI The uri of the image to delete
 */
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

/**
 * Gets a category's color from its name
 * @param {string} categoryName Name of the category
 * @returns {string} The category's color
 */
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

/**
 * Gets a category's color from its id
 * @param {integer} categoryId The category's id
 * @returns {string} The category's color
 */
export async function getCategoryColorById(categoryId) {
    const db = await getDatabase();
    let color;
    await db.transactionAsync(async (tx) => {
        color = (await tx.executeSqlAsync(createCategoryQueryById(categoryId))).rows[0]['color'];
    });
    return color;
}

/**
 * Creates a years worth of example data using randomly generated expenses.
 * Used for testing purposes
 */
export async function createExampleData() {
    const exampleCategories = [
        {
            name: 'Food',
            icon: 'fastfood',
            color: '#92BFB1',
        },
        {
            name: 'Housing',
            icon: 'house',
            color: '#F4AC45',
        },
        {
            name: 'Social',
            icon: 'people',
            color: '#694A38',
        },
        {
            name: 'Personal',
            icon: 'person',
            color: '#A61C3C',
        },
        {
            name: 'Entertainment',
            icon: 'videogame-asset',
            color: '#0B3C49',
        },
        {
            name: 'Other',
            icon: 'attach-money',
            color: '#4B2E39',
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
                category['color'],
                category['icon']
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
    const MINIMUM_EXPENSES = 1;
    const MAXIMUM_EXPENSES = 5;
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
            const amount = Math.floor(Math.random() * 101);
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
