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
    before(function () {
        driver.get('http://m.lottemart/mobile/corners.do');
    });

    it('Page Title 은 "롯데마트몰 - easy & slow life" 인가?', () => {
        driver.sleep(1000).then(function () {
            driver.getTitle().then((title) => {
                assert.equal(title, '롯데마트몰 - easy & slow life');

                driver.quit();
            });
        });
    });
});