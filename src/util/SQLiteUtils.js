import { incrementDateByFrequency } from './DatetimeUtils';

const CREATE_REACCURING_TABLE = `CREATE TABLE reacurring (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    frequency TEXT NOT NULL,
    start DATETIME NOT NULL,
    next_trigger DATETIME
);`;

const CREATE_EXPENSES_TABLE = `CREATE TABLE expenses (
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
    FOREIGN KEY (reacurring_id) REFERENCES reacurring (id)
);`;

const SET_EXPENSE_CATERGORY_AS_INDEX = `CREATE INDEX idx_category 
ON expenses (category);`;

const SET_EXPENSE_DAY_AS_INDEX = `CREATE INDEX idx_day 
ON expenses (day);`;

const GET_EXPENSES_TABLE_QUERY = 'SELECT * FROM expenses';

const GET_CATEGORY_QUERY = 'SELECT DISTINCT category FROM expenses';

const createExpenseInsert = (name, category, amount, day) => {
    return `INSERT INTO expenses (name, category, amount, day)
    VALUES ('${name}', '${category}', ${amount}, '${day}');`;
};

const deleteExpense = (row) => {
    return `DELETE FROM expenses WHERE id = ${row}`;
}

const createExpenseInsertWithReacurringId = (
    name,
    category,
    amount,
    day,
    timestamp,
    reacurring_id
) => {
    return `INSERT INTO expenses (name, category, amount, day, timestamp, reacurring_id)
    VALUES ('${name}', '${category}', ${amount}, '${day}', '${timestamp}', ${reacurring_id});`;
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

const createExpenseByCategoryQuery = (category) => {
    return `SELECT * FROM expenses WHERE category = "${category}";`;
};

const createExpenseByCategoryandTimeframeQuery = (category, startTimestamp, endTimestamp) => {
    return `SELECT * FROM expenses WHERE category = "${category}" AND timestamp BETWEEN "${startTimestamp}" AND "${endTimestamp}" ORDER BY category, timestamp;`;
};

export {
    CREATE_EXPENSES_TABLE,
    CREATE_REACCURING_TABLE,
    SET_EXPENSE_CATERGORY_AS_INDEX,
    SET_EXPENSE_DAY_AS_INDEX,
    GET_EXPENSES_TABLE_QUERY,
    GET_CATEGORY_QUERY,
    createExpenseInsert,
    deleteExpense,
    createExpenseByDayQuery,
    createExpenseByTimeframeQuery,
    createReacurringInsert,
    createExpenseByIdQuery,
    createReacurringByIdQuery,
    createExpenseInsertWithReacurringId,
    createExpenseByCategoryQuery,
    createExpenseByCategoryandTimeframeQuery,
};
