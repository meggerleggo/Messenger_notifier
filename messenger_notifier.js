const puppeteer = require('puppeteer');
const facebook = require('./src/facebook');
const message = require('./src/message');
const cache = require('./src/cache');
const auth = require('./src/authentication');
const config = require('./src/configuration');

const startupOptions = {
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: [
        '--disable-popup-blocking', 
        '--disable-translate' 
    ]
}

async function navigatePage(page, url = String())
{
    let response = await page.goto(url, {waitUntil: "networkidle2"}); 

    if (!response.ok())
    {
        throw ("Response :" + await response.status());
    }

    const loginRequired = await auth.isLoginRequired(page);

    if (loginRequired)
    {
        await auth.login(page, facebook.credentials.email, facebook.credentials.password);

        if (!url.endsWith('.com'))
        {
            await navigatePage(page, url);
        }
    }
}

async function runSetup()
{
    facebook.credentials = await config.loadFile('config/credentials.json');
    let target = await config.loadFile('config/target.json');
    message.setTarget(target.address);
    cache.restore();
}

async function main()
{    
    await runSetup();
    
    let browser = await puppeteer.launch(startupOptions);

    let messengerPage = await browser.newPage();
    await navigatePage(messengerPage, facebook.url.MESSENGER);

    let searchPage = await browser.newPage();
    await navigatePage(searchPage, facebook.url.HOME);

    // let loginCookies = await messengerPage.cookies();    
    // await searchPage.setCookie(...loginCookies);
        
    messengerPage.on('response', async (response) =>
    {        
        if (response.url().includes('/pull'))
        {            
            let raw = await response.text();

            let responseBody = JSON.parse(raw.substr(raw.indexOf('{')));

            if (responseBody)
            {    
                if (message.isValid(responseBody))
                {
                    let senderId = message.extractSenderId(responseBody);           
                    let messageBody = message.extractMessageBody(responseBody);

                    if (!cache.getUser(senderId))
                    {
                        await navigatePage(searchPage, facebook.url.HOME + '/' + senderId);
                        cache.setUser(senderId, await searchPage.title());
                        cache.backup();
                    }

                    let username = cache.getUser(senderId);

                    await message.notifyReceived(username, messageBody);
                }
            }
        }
    });  

    console.log('[READY]');
}

main();