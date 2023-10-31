import * as FileSystem from 'expo-file-system';

const dataDir = FileSystem.cacheDirectory + 'data/';
const spreadsheetLocation = dataDir + 'expense_sheet.csv';

// Checks if data directory exists. If not, creates it
async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(dataDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dataDir, { intermediates: true });
    }
}

// Sets spreadsheet to provided csv string
export async function setExpenseSheet(csvString, skipDirCheck) {
    if (skipDirCheck === undefined) {
        await ensureDirExists();
    }
    await FileSystem.writeAsStringAsync(spreadsheetLocation, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
    });
}

// Returns our spreadsheet as a csv string
// If our spreadsheet doesn't exist, create it
export async function getExpenseSheet() {
    await ensureDirExists();

    const fileInfo = await FileSystem.getInfoAsync(spreadsheetLocation);

    if (!fileInfo.exists) {
        setExpenseSheet('date,category,name,amount,id', true);
    }

    return await FileSystem.readAsStringAsync(spreadsheetLocation, {
        encoding: FileSystem.EncodingType.UTF8,
    });
}

// Adds a row to our current spreadsheet
export async function addRowToExpenseSheet(date, category, name, amount, id) {
    let sheet = await getExpenseSheet();
    sheet += `\n${date},${category},${name},${amount},${id}`;
    setExpenseSheet(sheet);
}
