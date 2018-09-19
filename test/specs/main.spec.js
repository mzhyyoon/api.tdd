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

driver.get('http://m.lottemart.com/mobile/corners.do');

setTimeout(() => {
    describe('Mobile > Main', function () {
        after('close browser!', () => {
            driver.quit();
        });

        it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> success', (done) => {
            driver.getTitle().then((title) => {
                assert.equal(title, '롯데마트몰 - easy & slow life');
                done();
            });
        });

        it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> fail', (done) => {
            driver.getTitle().then((title) => {
                assert.equal(title, 'lottemart');
                done();
            });
        });
    });

    run();
}, 10000);