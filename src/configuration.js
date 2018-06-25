const fs = require('fs');

async function loadFile(path = String())
{
    if (!fs.existsSync(path))
    {
        throw ("Provided config path does not exist: " + path);
    }

    let fileContent = fs.readFileSync(path);

    if (!fileContent)
    {
        throw ("Configuration file is either empty or damaged: " + path);
    }

    return JSON.parse(fileContent);
}

module.exports.loadFile = loadFile;