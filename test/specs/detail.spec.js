const puppeteer = require('puppeteer');
const {assert} = require('chai');

describe('Mobile4 > Main', function () {
    let browser, page;

    this.timeout(30000);

    before(async function () {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        page = await browser.newPage();
    });

    after(function () {
        return browser.close();
    });

    it('Page Title 은 "롯데마트몰 - easy & slow life" 인가? -> success', async function () {
        await page.goto('http://m.lottemart.com/mobile/corners.do');

        return page.title().then(function(title) {
            assert.equal(title, '롯데마트몰 - easy & slow life');
        });
    });

    it('naver test??!', async function () {
        await page.goto('http://naver.com');

        return page.title().then(function(title) {
            assert.equal(title, 'Naver');
        });
    });
});