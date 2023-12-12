import { addRowToCategoryTable } from './CategoryTableUtils';
import { getDatabase, incrementExpenseUpdatesInSession } from './DatabaseUtils';
import { getDateStringFromDate } from './DatetimeUtils';
import { generateRandomName } from './NameUtils';
import { createExpenseInsert } from './SQLiteUtils';
import { DAY_LENGTH } from '../constants/FrequencyConstants';

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
        incrementExpenseUpdatesInSession();
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
