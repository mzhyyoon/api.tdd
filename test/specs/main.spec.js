const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const {assert} = require('chai');

describe('Mobile > Main', function () {
    this.timeout(30000);
    let driver;

    before(function () {
        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions({
                args: ['headless', 'disable-gpu'],
                mobileEmulation: {
                    deviceName: 'iPhone 6/7/8 Plus'
                }
            })
            .build();
    });

    after(function () {
        return driver.quit();
    });

    it("Open : 롯데마트몰 > 모바일", function () {
        return driver.get('http://m.lottemart.com/mobile/corners.do');
    });

    it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> success', function () {
        return driver.getTitle().then(function(title) {
            assert.equal(title, '롯데마트몰 - easy & slow life');
        });
    });

    it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> fail', function () {
        return driver.getTitle().then(function(title) {
            assert.equal(title, 'lottemart');
        });
    });
});