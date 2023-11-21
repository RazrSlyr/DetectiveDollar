import { incrementDateByFrequency } from './DatetimeUtils';

const CREATE_REACCURING_TABLE = `CREATE TABLE IF NOT EXISTS reacurring (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    frequency TEXT NOT NULL,
    start DATETIME NOT NULL,
    next_trigger DATETIME
);`;

const CREATE_CATEGORY_TABLE = `CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY,
    icon TEXT,
    color TEXT
);`;

const CREATE_EXPENSES_TABLE = `CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
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

const GET_EXPENSES_TABLE_QUERY = 'SELECT * FROM expenses';

const GET_CATEGORY_QUERY = 'SELECT DISTINCT category FROM expenses';

const GET_ALL_CATEGORIES_QUERY = 'SELECT * FROM categories;';

const createExpenseInsert = (name, category, amount, day, imageURI) => {
    return `INSERT INTO expenses (name, category, amount, day, picture)
    VALUES ('${name}', '${category}', ${amount}, '${day}', 
    ${imageURI !== null ? `'${imageURI}'` : null});`;
};

const deleteExpense = (row) => {
    return `DELETE FROM expenses WHERE id = ${row}`;
};

const createExpenseInsertWithReacurringId = (
    name,
    category,
    amount,
    day,
    timestamp,
    imageURI,
    reacurringID
) => {
    //if (image_uri) {
    //    return `INSERT INTO expenses (name, category, amount, day, timestamp, picture, reacurring_id)
    //    VALUES ('${name}', '${category}', ${amount}, '${day}', '${timestamp}', '${image_uri}', ${reacurring_id});`;
    //}
    return `INSERT INTO expenses (name, category, amount, day, timestamp, picture, reacurring_id)
    VALUES ('${name}', '${category}', ${amount}, '${day}', '${timestamp}', 
    ${imageURI !== null ? `'${imageURI}'` : null}, ${reacurringID});`;
};

const createReacurringInsert = (frequency) => {
    const start = new Date();
    const next = incrementDateByFrequency(start, frequency);
    const command = `INSERT INTO reacurring (frequency, start, next_trigger)
    VALUES ('${frequency}', datetime(${start.getTime() / 1000}, 'unixepoch'), datetime(${
        next / 1000
    }, 'unixepoch'));`;
    return command;
};

const createCategoryInsert = (category) => {
    const command = `INSERT OR IGNORE INTO categories (name)
    VALUES ('${category}');`;
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

/* const createExpenseByTimeframeQuery = (startTimestamp, endTimestamp) => {
    return `SELECT * FROM expenses WHERE timestamp BETWEEN "${startTimestamp}" AND "${endTimestamp}" ORDER BY timestamp`;
}; */

const createExpenseByTimeframeQuery = (startTimestamp, endTimestamp) => {
    return `
        SELECT * 
        FROM expenses 
        WHERE timestamp >= "${startTimestamp}" 
          AND timestamp < date("${endTimestamp}", '+1 day') 
        ORDER BY timestamp;
    `;
};


const createExpenseByCategoryQuery = (category) => {
    return `SELECT * FROM expenses WHERE category = "${category}";`;
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
    createExpenseInsert,
    createCategoryInsert,
    deleteExpense,
    createExpenseByDayQuery,
    createExpenseByTimeframeQuery,
    createReacurringInsert,
    createExpenseByIdQuery,
    createReacurringByIdQuery,
    createExpenseInsertWithReacurringId,
    createExpenseByCategoryQuery,
};