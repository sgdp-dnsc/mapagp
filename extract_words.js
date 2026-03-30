const mammoth = require("mammoth");
const fs = require("fs");

async function extract() {
    try {
        const intro = await mammoth.extractRawText({path: "introduccion.docx"});
        console.log("---BEGIN_INTRO---");
        console.log(intro.value);
        console.log("---END_INTRO---");
        
        const glosario = await mammoth.extractRawText({path: "Glosario.docx"});
        console.log("---BEGIN_GLOSARIO---");
        console.log(glosario.value);
        console.log("---END_GLOSARIO---");
    } catch (e) {
        console.error(e);
    }
}

extract();
