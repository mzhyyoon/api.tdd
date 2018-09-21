const puppeteer = require('puppeteer');
const {assert} = require('chai');

describe('Mobile2 > Main', function () {
    let browser, page;

    this.timeout(30000);

    before(async function () {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        page = await browser.newPage();
        await page.goto('https://m.lottemart.com/mobile/corners.do');
    });

    after(function () {
        return browser.close();
    });

    it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> success', function () {
        return page.title().then(function(title) {
            assert.equal(title, '롯데마트몰 - easy & slow life');
        });
    });
});