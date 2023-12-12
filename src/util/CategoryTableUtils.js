import { getDatabase, incrementExpenseUpdatesInSession } from './DatabaseUtils';
import {
    createCategoryInsert,
    GET_ALL_CATEGORIES_QUERY,
    createCategoryQueryByName,
    createCategoryQueryById,
} from './SQLiteUtils';

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
    incrementExpenseUpdatesInSession();
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
