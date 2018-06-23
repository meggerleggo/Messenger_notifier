const puppeteer = require('puppeteer');
const facebook = require('./facebook');
const message = require('./message');
const cache = require('./cache');
const auth = require('./authentication');

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
        console.log('Login required for ' + url);

        await auth.login(page, facebook.credentials.email, facebook.credentials.password);

        if (!url.endsWith('.com'))
        {
            await navigatePage(page, url);
        }
    }
    
    console.info('Page: ' + url + ' loaded');
}

async function main()
{
    facebook.credentials.load('config/credentials.json');
    
    cache.userinfo.load('userinfo.json');

    let browser = await puppeteer.launch(startupOptions);

    let messengerPage = await browser.newPage();
    await navigatePage(messengerPage, facebook.url.MESSENGER);
    
    let searchPage = await browser.newPage();
    await navigatePage(searchPage, facebook.url.HOME);
    
    // let loginCookies = await messengerPage.cookies();    
    // await searchPage.setCookie(...loginCookies);
    // console.log('cookies set');
    
    messengerPage.on('response', async (response) =>
    {        
        if (response.url().includes('/pull'))
        {
            // console.log('[Response received]');
            // console.log('===================');
            
            let raw = await response.text();
            
            let responseBody = JSON.parse(raw.substr(raw.indexOf('{')));
            
            if (responseBody)
            {    
                if (message.isValid(responseBody))
                {
                    console.log('Valid message!');

                    let senderId = message.extractSenderId(responseBody);           
                    let messageBody = message.extractMessageBody(responseBody);

                    if (!cache.userinfo.current[senderId])
                    {
                        await navigatePage(searchPage, facebook.url.HOME + '/' + senderId);
                        cache.userinfo.current[senderId] = await searchPage.title();
                        cache.userinfo.save('userinfo.json');
                    }

                    let username = cache.userinfo.current[senderId];

                    message.notifyReceived(username, messageBody);
                }
            }
        }
    });    
}

main();