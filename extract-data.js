const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, '..', 'Matriz GPyDO 18022026.xlsx');
const jsonOutputPath = path.join(__dirname, 'src', 'data.json');

// Mapeo exacto de los nombres de las hojas a los títulos requeridos por el usuario
const sheetMapping = {
    "1. Planificación y Soporte Nive": "1. Planificación y Soporte nivel 1",
    "Hoja 1": "2. Planificación y Soporte nivel 2",
    "2. Gestión del Desempeño  Nivel": "3. Gestión del Desempeño nivel 1",
    "2. Gestión del Desempeño Nivel ": "4. Gestión del Desempeño nivel 2",
    "3. Gestión del Desarrollo Nivel": "5. Gestión del Desarrollo nivel 1",
    "Hoja 2": "6. Gestión del Desarrollo nivel 2",
    "4. Gestión del Cambio Nivel 1": "7. Gestión del Cambio nivel 1",
    "4. Gestión del Cambio Nivel 2": "8. Gestión del Cambio nivel 2"
};

try {
    const workbook = XLSX.readFile(excelFilePath);
    const data = [];
    let idCounter = 1;

    // Solo procesamos las hojas que están en nuestro mapeo
    for (const sheetName of workbook.SheetNames) {
        if (!sheetMapping[sheetName]) {
            console.log(`Hoja ignorada: ${sheetName}`);
            continue;
        }

        const mappedCategoryName = sheetMapping[sheetName];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

        // Buscar la fila de encabezados (la que tiene algo como "Hito a Cumplir" o "SIAPER")
        let headRowIdx = -1;
        for (let i = 0; i < 15; i++) {
            if (rawData[i]) {
                const joined = rawData[i].map(x => String(x || '').toLowerCase()).join('');
                if (joined.includes('hito') || joined.includes('siaper') || joined.includes('subsistema')) {
                    headRowIdx = i;
                    break;
                }
            }
        }

        if (headRowIdx === -1) {
            console.log(`No se encontraron encabezados en la hoja ${sheetName}. Saltando.`);
            continue;
        }

        const headers = rawData[headRowIdx].map(x => String(x || '').trim().toLowerCase());

        // Mapear indices (con nombres alternativos comunes)
        const hitoIdx = headers.findIndex(h => h.includes('hito') || h.includes('proceso') || h.includes('actividad'));
        const siaperIdx = headers.findIndex(h => h.includes('siaper'));
        const normativaIdx = headers.findIndex(h => h.includes('naturaleza') || h.includes('normativa') || h.includes('ley'));
        const linkIdx = headers.findIndex(h => h.includes('link') || h.includes('enlace'));
        const criticidadIdx = headers.findIndex(h => h.includes('criticidad'));
        const plazoIdx = headers.findIndex(h => h.includes('plazo') || h.includes('perentorio'));
        const respIdx = headers.findIndex(h => h.includes('responsable') || h.includes('vinculación') || h.includes('reportabil'));

        // Columnas de periodicidad
        const periodicidadCols = [];
        headers.forEach((h, idx) => {
            if (h === 'anual' || h === 'mensual' || h === 'trimestral' || h === 'por evento' || h === 'semestral' || h === 'bienal' || h.includes('según')) {
                periodicidadCols.push({ idx, name: rawData[headRowIdx][idx] }); // Guardar el nombre original
            }
        });

        // Leer datos desde la fila siguiente al encabezado (o 2 filas abajo, dependiendo del layout)
        // Usualmente los headers reales están en headRowIdx, a veces los datos empiezan justo abajo.
        for (let i = headRowIdx + 1; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row) continue;

            const hito = hitoIdx !== -1 && row[hitoIdx] ? String(row[hitoIdx]).trim() : '';
            if (!hito || hito === 'null' || hito === '' || hito.toLowerCase() === 'hito a cumplir') continue;

            let siaper = "No";
            if (siaperIdx !== -1) {
                let val1 = String(row[siaperIdx] || '').toUpperCase();
                let val2 = String(row[siaperIdx + 1] || '').toUpperCase();
                if (val1 === 'X' || val1 === 'SI' || val1 === 'SÍ') siaper = "Sí";
                else if (val2 === 'X' || val2 === 'SI' || val2 === 'SÍ') siaper = "Sí";
            }

            const normativa = normativaIdx !== -1 && row[normativaIdx] ? String(row[normativaIdx]).trim() : 'Sin definir';
            const linkNormativa = linkIdx !== -1 && row[linkIdx] ? String(row[linkIdx]).trim() : '';

            const criticidadRaw = criticidadIdx !== -1 && row[criticidadIdx] ? String(row[criticidadIdx]).trim().toUpperCase() : '';
            const criticidad = (criticidadRaw === 'SI' || criticidadRaw === 'SÍ' || criticidadRaw === 'ALTA' || criticidadRaw === 'X') ? 'Alta' : 'Media';

            const plazoRaw = plazoIdx !== -1 && row[plazoIdx] ? String(row[plazoIdx]).trim().toUpperCase() : '';
            const plazoPerentorio = (plazoRaw === 'SI' || plazoRaw === 'SÍ' || plazoRaw === 'ALTA' || plazoRaw === 'X') ? 'Sí' : 'No';

            const responsable = respIdx !== -1 && row[respIdx] ? String(row[respIdx]).trim() : 'Jefatura';

            let periodicidad = 'No definida';
            for (const p of periodicidadCols) {
                const val = String(row[p.idx] || '').toUpperCase();
                if (val === 'X' || val === 'SI' || val === 'SÍ') {
                    periodicidad = p.name;
                    break;
                }
            }

            data.push({
                id: String(idCounter++),
                categoria: mappedCategoryName,
                hito,
                siaper,
                normativa,
                linkNormativa,
                periodicidad,
                responsable,
                criticidad,
                plazoPerentorio
            });
        }
    }

    // Las categorías finales serán exactamente los valores del mapping (ordenadas)
    const finalCategories = Object.values(sheetMapping);

    const finalJson = {
        categories: finalCategories,
        data
    };

    fs.writeFileSync(jsonOutputPath, JSON.stringify(finalJson, null, 2));
    console.log(`¡Éxito! Se exportaron ${data.length} registros y ${finalCategories.length} categorías a data.json`);

} catch (error) {
    console.error("Error al procesar el Excel:", error);
}
