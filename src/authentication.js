async function isLoginRequired(page)
{
    let cookies = await page.cookies();
    return !cookies.some(value => value.name === 'c_user');
}

async function login(page, email, password)
{
    let emailBox = await page.waitForSelector('#email');
    let passwordBox = await page.waitForSelector('#pass');
    let loginButton = await page.waitForSelector('#loginbutton');

    await emailBox.type(email, {delay: 15});
    await passwordBox.type(password, {delay: 15});
    await loginButton.click({delay: 250});
    
    await page.waitForNavigation({waitUntil: "networkidle2"});
}

module.exports.isLoginRequired = isLoginRequired;
module.exports.login = login;