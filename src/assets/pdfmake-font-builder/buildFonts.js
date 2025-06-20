const fs = require('fs');
const path = require('path');

const fontsDir = path.resolve(__dirname, 'fonts');
const outputFile = path.resolve(__dirname, 'vfs_fonts.js');

const fontFile = 'Cairo-VariableFont_slnt,wght.ttf';

const vfs = {
  [fontFile]: fs.readFileSync(path.join(fontsDir, fontFile)).toString('base64'),
};

const result = `
var pdfMake = pdfMake || {};
pdfMake.vfs = ${JSON.stringify(vfs, null, 2)};
`;

fs.writeFileSync(outputFile, result);
console.log('✅ vfs_fonts.js created using Cairo variable font!');
