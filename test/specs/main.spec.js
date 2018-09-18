require('chromedriver');

const {Builder} = require('selenium-webdriver');
const {assert} = require('chai');

let driver = new Builder()
    .withCapabilities({
        browserName: 'chrome',
        chromeOptions: {
            args : ['headless','disable-gpu'],
            mobileEmulation: {
                deviceName: 'iPhone 6/7/8 Plus'
            }
        }
    })
    .build();

describe('Mobile > Main', function () {
    it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> success', async () => {
        await driver.get('http://m.lottemart.com/mobile/corners.do');
        await driver.getTitle().then(async (title) => {
            await assert.equal(title, '롯데마트몰 - easy & slow life');
            await driver.quit();
        });
    });

    it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> fail', async () => {
        await driver.get('http://m.lottemart.com/mobile/corners.do');
        await driver.getTitle().then(async (title) => {
            await assert.equal(title, 'lottemart');
            await driver.quit();
        });
    });

});