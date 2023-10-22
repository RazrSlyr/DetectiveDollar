function jsonListToCsv(jsonList) {
    print(jsonList.map(item => JSON.stringify(item)));
    keys = Object.keys(jsonList[0]);
    output = keys[0];
    for (let keyIndex = 1; keyIndex < keys.length; keyIndex++) {
        output += "," + keys[keyIndex];
    }
    for (let row = 0; row < jsonList.length; row++) {
        output += "\n";
        for (let column = 0; column < keys.length; column++) {
            if (column != 0) {
                output += ",";
            }

            output += jsonList[row][keys[column]];
        }
    }
    return output;
}

function csvToJsonList(csvString) {
    lines = csvString.split("\n");
    keys = lines[0].split(",");
    output = [];
    for (let row = 1; row < lines.length; row++) {
        values = lines[row].split(",");
        const expenseJson = {};
        for (let column = 0; column < keys.length; column++) {
            expenseJson[keys[column]] = values[column];
        }
        output.push(expenseJson);
    }
    return output;
}

export {jsonListToCsv, csvToJsonList};