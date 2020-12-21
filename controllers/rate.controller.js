const rp = require('request-promise');
const moment = require('moment')
const query = require('../query')
const { DB } = process.env;

exports.view = function (req, res) {
    const promises = [...getFromCoinmarketcap(), ...getFromBitstamp()];

    Promise.all(promises).then(result => {
        /*Getting results from 2 APIs like this and calculate the average
        [
            [
                {ticker: btc, price : 23717.223988158636, source: }
                {ticker: eth, price: 649.1233445781287, source:}
                {ticker: ltc, price: 116.57420386874892, source:}
            ],
            { ticker: btc, price : 23776.9 , source:},
            { ticker: eth, price : 650.51 , source:},
            { ticker: ltc, price : 116.55 , source:}
        ]*/

        if (!result || result.length !== 4) {
            console.log(`Side API didn't return expected result`)
            res.json({ err: 'Some problem with API' })
            return;
        }

        const data = []

        data.push(...result[0], ...result.slice(1)) // converting result to array of objects [{ticker, price, source}]

        // calculate average prices
        const avg_prices = {} // object {btc: [23776.9, 23717], eth: []}

        data.forEach((el) => {
            if (!avg_prices[el.ticker]) avg_prices[el.ticker] = [el.price]
            else avg_prices[el.ticker].push(el.price)
        })

        Object.keys(avg_prices).forEach(ticker => {
            avg_prices[ticker] = round(avg_prices[ticker].reduce((a, b) => a + b, 0) / avg_prices[ticker].length, 2).toFixed(2);
        })

        let sql = `INSERT INTO ${DB}.rates (ticker, price, source, created) VALUES`;
        const created = moment().format('YYYY-MM-DD HH:mm:ss');

        const arr = data.map((el) => {
            return `('${el.ticker}', ${round(el.price, 2).toFixed(2)}, '${el.source}', '${created}')`;
        })

        sql += arr.join(',')

        query(sql, function (err, result) {
            if (err) console.log('SQL Insert Error', err);
        })

        res.json(avg_prices)
    }).catch((err) => {
        console.log('API call error:', err.message);
        res.json({ err: err.message })
    });
};

function getFromCoinmarketcap() {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,LTC',
        headers: {
            'X-CMC_PRO_API_KEY': '137e848f-89fc-4219-9771-adebacf16f3d'
        },
        json: true,
        gzip: true
    };

    /* getting result in object { BTC: { quote: last: price }, ETH: ..., LTC: ...} returning { ticker, price, source}*/

    const promise = [rp(requestOptions).then(res => {
        const source = 'coinmarketcap.com'
        const prices = []

        if (res && res.data) {
            Object.keys(res.data).forEach(ticker => {
                if (ticker && res.data[ticker] && res.data[ticker].quote && res.data[ticker].quote.USD && res.data[ticker].quote.USD.price) {
                    prices.push({ ticker: ticker.toLowerCase(), price: res.data[ticker].quote.USD.price, source });
                }
                else {
                    console.log('API coinmarketcap returned different structure from expected', res.data[ticker])
                }
            })
        }

        return prices;
    })];

    return promise;
}

// this source doens't support bundiling of api calls, so create 3 promises, 1 for each ticker
function getFromBitstamp() {
    const promises = []
    const uri = 'https://www.bitstamp.net/api/v2/ticker/'

    const requestOptions = {
        method: 'GET',
    }

    const pairs = ['btcusd', 'ethusd', 'ltcusd']

    pairs.forEach(pair => {
        const options = { ...requestOptions }
        options.uri = uri + pair;

        promises.push(rp(options).then(res => {
            //* res is '{"high": "661.28", "last": "616.37", "timestamp": "1608568309", "bid": "616.01", "vwap": "624.53", "volume": "115905.23586714", "low": "595.22", "ask": "616.54", "open": "637.88"}'*/
            if (res && typeof res == 'string') {
                try {
                    res = JSON.parse(res)
                    if (res && res.last) return { ticker: pair.substring(0, 3), price: parseFloat(res.last), source: 'bitstamp.net' }
                }
                catch (err) {
                    console.log('JSON parse error', err)
                }

            }
        }))
    })

    return promises;
}

function round(num, decimal) {
    const dec = Math.pow(10, decimal);
    return Math.round(num * dec) / dec;
}