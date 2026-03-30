const fs = require('fs');
const path = require('path');

const payloadPath = 'c:\\Users\\cvaldivieso\\Desktop\\MAPA GP\\payload.json';
const outputPath = 'c:\\Users\\cvaldivieso\\Desktop\\MAPA GP\\payload_utf8.json';

try {
    const content = fs.readFileSync(payloadPath, 'utf16le');
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log('Conversión exitosa');
} catch (error) {
    console.error('Error:', error);
}
