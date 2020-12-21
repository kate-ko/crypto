const router = require('express').Router();
const rateCtrl = require('./controllers/rate.controller');
const history = require('./controllers/history.controller')

//set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'Crypto API Works',
        message: 'Welcome to API'
    });
});

router.route('/rates')
    .get(rateCtrl.view)

router.route('/history')
    .get(history.view)

module.exports = router;