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

const GET_EXPENSES_TABLE_QUERY = 'SELECT * FROM expenses;';

const GET_CATEGORY_QUERY = 'SELECT DISTINCT category FROM expenses;';

const GET_ALL_CATEGORIES_QUERY = 'SELECT * FROM categories;';

const GET_ALL_REACURRING_EXPENSES = 'SELECT * FROM reacurring';

const deleteExpense = (row) => {
    return `DELETE FROM expenses WHERE id = ${row}`;
};

const createReacurringDeleteById = (row) => {
    return `DELETE FROM reacurring WHERE id = ${row};`;
};

const createExpenseInsert = (
    name,
    category,
    amount,
    timestamp,
    day,
    subcategory = null,
    picture = null,
    memo = null,
    reacurring_id = null
) => {
    return `INSERT INTO expenses (name, category, amount, timestamp, day, subcategory, picture, memo, reacurring_id)
    VALUES ('${name}', ${category}, ${amount}, ${timestamp}, '${day}', ${
        subcategory !== null ? `'${subcategory}'` : null
    }, ${picture !== null ? `'${picture}'` : null}, ${memo !== null ? `'${memo}'` : null}, ${
        reacurring_id !== null ? `${reacurring_id}` : null
    });`;
};

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

const createCategoryInsert = (name, icon = null, color = null) => {
    const command = `INSERT OR IGNORE INTO categories (name, icon, color)
    VALUES ('${name}', ${icon !== null ? `'${icon}'` : null}, ${
        color !== null ? `'${color}'` : null
    });`;
    return command;
};

const createExpenseByDayQuery = (day) => {
    return `SELECT * FROM expenses WHERE day = '${day}' ORDER BY timestamp ASC`;
};

const createExpenseByIdQuery = (id) => {
    return `SELECT * FROM expenses WHERE id = ${id};`;
};

const createReacurringByIdQuery = (id) => {
    return `SELECT * FROM reacurring WHERE id = ${id};`;
};

const createExpenseByTimeframeQuery = (startTimestamp, endTimestamp) => {
    return `SELECT * FROM expenses WHERE timestamp BETWEEN "${startTimestamp}" AND "${endTimestamp}" ORDER BY timestamp`;
};

const createExpenseByDayFrameQuery = (startDay, endDay) => {
    return `SELECT * FROM expenses WHERE DAY BETWEEN "${startDay}" AND "${endDay}" ORDER BY DAY`;
};
/* const createExpenseByTimeframeQuery = (startTimestamp, endTimestamp) => {
    return `
        SELECT * 
        FROM expenses 
        WHERE timestamp >= "${startTimestamp}" 
          AND timestamp < date("${endTimestamp}", '+1 day') 
        ORDER BY timestamp;
    `;
}; */

const createExpenseByCategoryQuery = (category) => {
    return `SELECT * FROM expenses WHERE category = "${category}";`;
};

const createReacurringExpenseNextTriggerUpdate = (id, next_update) => {
    return `UPDATE reacurring
    SET next_trigger = datetime(${next_update / 1000}, 'unixepoch')
    WHERE id = ${id};`;
};

const createLastReacurrenceQuery = (id) => {
    return `SELECT * FROM expenses WHERE reacurring_id = ${id} ORDER BY timestamp DESC LIMIT 1;`;
};

const createCategoryQueryByName = (name) => {
    return `SELECT * FROM categories WHERE name = '${name}' LIMIT 1;`;
};

const createCategoryQueryById = (id) => {
    return `SELECT * FROM categories WHERE id = ${id} LIMIT 1;`;
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
};
