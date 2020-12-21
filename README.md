This web app gets the latest rates for **BTC-USD**, **ETH-USD** and **LTC-USD** from 2 sources: coinmarketcap.com and bitstamp.net.

Front end part is written in React and has 2 pages:
1. Rates page that shows all 3 pairs and their latest average rate. It updates every 10 seconds.
2. A list of historical rates for each pair from each source.

Front app is in the 'front' folder.

Back end part is written in Node.js with Express and has 2 endpoints /rates to return the latest average rates from 2 sources and /history to return last 10 history values for mentioned currencies. History rates are saved in MySQL, table 'rates'.

DB connection parameteres need to be updated .env or passed to Docker file (see package.json).

To avoid CORS error on localhost start chrome from the terminal: google-chrome --disable-web-security --user-data-dir="D:\chrome"


