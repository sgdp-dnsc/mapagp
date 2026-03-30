const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, '..', 'Matriz GPyDO 18022026.xlsx');

try {
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    console.log("Primeras 15 filas de la hoja:", sheetName);
    for (let i = 0; i < 15; i++) {
        if (rawData[i]) {
            console.log(`Fila ${i}:`, rawData[i]);
        }
    }
} catch (error) {
    console.error("Error:", error);
}
