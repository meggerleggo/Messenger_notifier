const fs = require('fs');

const userinfoPath = '.userinfo.json';
const userinfoBackupPath = userinfoPath + '.old';

let current = {};

function getUser(id)
{
    return current[id];
}

function setUser(id, username)
{
    current[id] = username;
}

function backup()
{
    if (!fs.existsSync(userinfoPath))
    {
        fs.writeFileSync(userinfoPath, JSON.stringify(current));
        fs.copyFileSync(userinfoPath, userinfoBackupPath);
        return;
    }

    if (fs.existsSync(userinfoBackupPath))
    {
        fs.writeFileSync(userinfoPath, JSON.stringify(current));
        fs.copyFileSync(userinfoPath, userinfoBackupPath);
    }
    else
    {
        fs.copyFileSync(userinfoPath, userinfoBackupPath);
        fs.writeFileSync(userinfoPath, JSON.stringify(current));
    }
}

function restore()
{
    if (fs.existsSync(userinfoPath))
    {
        let userinfoString = fs.readFileSync(userinfoPath);

        if (userinfoString)
        {
            current = JSON.parse(userinfoString);
        }
        else
        {
            fs.unlinkSync(userinfoPath);
        }
    }
    else if (fs.existsSync(userinfoBackupPath))
    {
        fs.copyFileSync(userinfoBackupPath, userinfoPath);
        restore();
    }
}

module.exports.getUser = getUser;
module.exports.setUser = setUser;
module.exports.backup = backup;
module.exports.restore = restore;