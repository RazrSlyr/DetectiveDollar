const CREATE_REACCURING_TABLE = `CREATE TABLE reacurring (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    frequency TEXT NOT NULL,
    start TIMESTAMP NOT NULL,
    next_trigger TIMESTAMP
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

const createExpenseInsert = (name, category, amount, day) => {
    return `INSERT INTO expenses (name, category, amount, day)
    VALUES ('${name}', '${category}', ${amount}, '${day}');`;
};

const createExpenseByDayQuery = (day) => {
    return `SELECT * FROM expenses WHERE day = ${day} ORDER BY timestamp`;
};

export {
    CREATE_EXPENSES_TABLE,
    CREATE_REACCURING_TABLE,
    SET_EXPENSE_CATERGORY_AS_INDEX,
    SET_EXPENSE_DAY_AS_INDEX,
    GET_EXPENSES_TABLE_QUERY,
    createExpenseInsert,
    createExpenseByDayQuery,
};
