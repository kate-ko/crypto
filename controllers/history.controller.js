const { DB } = process.env;
const query = require('../query')

exports.view = function (req, res) {
    const limit = req.query.limit || 10;

    const sql = `SELECT ticker, price, source, created FROM ${DB}.rates ORDER BY created DESC LIMIT ${limit}`;

    query(sql, function (err, result) {
        if (err) {
            console.log('error', err);
            res.json(err)
        }
        else res.json(result)
    })
};