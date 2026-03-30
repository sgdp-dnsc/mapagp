const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, '..', 'Matriz GPyDO 18022026.xlsx');
const jsonOutputPath = path.join(__dirname, 'src', 'data.json');

try {
    const workbook = XLSX.readFile(excelFilePath);
    const categories = workbook.SheetNames;
    const data = [];
    let idCounter = 1;

    for (const sheetName of categories) {
        const sheet = workbook.Sheets[sheetName];
        // Start reading from row offset if needed. Let's get raw rows
        const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (rawData.length > 0) {
            console.log("Headers from sheet " + sheetName + ": ", Object.keys(rawData[0]));
        }
    }

} catch (error) {
    console.error("Error:", error);
}
