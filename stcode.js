const fs = require('fs');

if (process.argv.length < 3) {
  console.log("usage:  node stcode.js <path-to-stcode.db-file>");
  process.exit(0);
}

const filename = process.argv[2];
const fileBuffer = fs.readFileSync(filename);

const header = fileBuffer.slice(0, 8);

const entryCount = header.readUInt32BE(4);
console.log(`Found ${entryCount} entries.`);

let offset = 8;

for (let i = 0; i < entryCount; i++) {
  const subsystemCode = fileBuffer.readUInt16BE(offset);
  offset += 4;
  
  const errorCodeBlockOffset = fileBuffer.readUInt32BE(offset);
  offset += 4;

  const blockHeader = fileBuffer.slice(errorCodeBlockOffset, errorCodeBlockOffset + 4 + 64 + 64);
 
  const startingCode = blockHeader.readUInt16BE(0);
  const endingCode = blockHeader.readUInt16BE(2);
  const subsystemName = blockHeader.slice(4, blockHeader.indexOf(0, 4)).toString('ascii');
  const moduleName = blockHeader.slice(68, blockHeader.indexOf(0, 68)).toString('ascii');
  
  console.log();
  console.log(`          ${subsystemName} / ${moduleName}`); 

  let codeOffset = errorCodeBlockOffset + 4 + 64 + 64;
    
  for (let j = 0; j < 0xffff; j++) {
    const code = (j + startingCode) & 0xffff;
    const errorString = fileBuffer.slice(codeOffset, fileBuffer.indexOf(0, codeOffset)).toString('ascii');
    codeOffset += errorString.length + 1;

    if (errorString != "" || j === 0) {
      console.log(`(${((subsystemCode << 16) + code).toString(16)})   ${errorString.trim()}`);
    }
    if (code === endingCode) {
      break;
    }

    if (endingCode === 0xffff) {
      // there doesn't seem to be any modules that have only warnings?  this seems to be used for
      // modules that have no codes at all (except the 0 code.)
      break;
    } 
  }
}
