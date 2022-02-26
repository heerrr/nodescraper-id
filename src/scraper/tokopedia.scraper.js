
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const logger = require('../modules/logger');

class TokopediaScraper {


    async scrape(params) {
        const agents = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36', 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/79.0.3945.73 Mobile/15E148 Safari/604.1'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)]; // made it singular instead of plural

        const q = params.q.split(' ').join('%20');
        const vendor = params.vendor;
        let url =  `https://www.tokopedia.com/${vendor}/product?q=${q}`;
        //url = `https://www.tokopedia.com/search?st=product&q=${q}`;

        url = this.formatUrl(params, url);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setUserAgent(randomAgent);

        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        url = page.url();

        logger.info('url:'+url);


        if (url.indexOf('/p/') !== -1) {
            if (url.split('/').length === 5) {
                browser.close();
                throw new Error('VAGUE_KEYWORD');
            }

            const newUrl = this.formatUrl(params, url);
            await page.goto(newUrl);
        }

        await page.setViewport({ width: 1200, height: 800 });

        await this.autoScroll(page);


        // await page.waitForSelector('[data-testid=divProductWrapper]',{
        //     timeout:10000,
        // });


        const pageContent = await page.content();
        const $ = cheerio.load(pageContent);
        if ($('#promo-not-found').length === 1) {
            browser.close();
            throw new Error('NO_RESULT');
        }
        // Get node with designated CSS class (product)
        const productGrid = $('[data-testid=divProductWrapper]');
        console.log(productGrid.length);
        const products = await this.getProducts($, productGrid);
        return products;
    }

    async getProducts($, productGrid) {
        const products = [];
        productGrid.each((i, col) => {

            const productName = $('[data-testid=linkProductName]',col).text();
            let productPrice = $('[data-testid=linkProductPrice]',col).text();
            //const productLink = $('a', col).attr('href');
            productPrice = this.unformatMoney(productPrice);

            const colData = {
                productName,
                productPrice,
                //productLink,
            };

            products.push(colData);

        });
        return products;
    }
    async autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 800;
                const timer = setInterval(() => {
                    // eslint-disable-next-line
                    const { scrollHeight } = document.body;
                    // eslint-disable-next-line
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }
    unformatMoney(money) {
        let num = money;
        num = num.replace(/\D/g, '');
        num = num.split(' ').pop();
        num = num.split('.');
        return Number(num.join(''));
    }

    formatUrl(params, currentUrl) {
        let newUrl = currentUrl;
        if (params.p !== undefined) {
            newUrl = `${currentUrl}&page=${params.p}`;
        }
        if (params.sc !== undefined) {
            newUrl = `${currentUrl}&sc=${params.sc}`;
        }
        if (params.ob !== undefined) {
            newUrl = `${currentUrl}&ob=${params.ob}`;
        }
        if (params.condition !== undefined) {
            newUrl = `${currentUrl}&condition=${params.condition}`;
        }
        return newUrl;
    }

    delay(ms) {
        new Promise(resolve => setTimeout(resolve, ms));
    }
}

const tokopediaScraper = new TokopediaScraper();

module.exports = tokopediaScraper;