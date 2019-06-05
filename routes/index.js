var express = require('express');
var router = express.Router();
const subscriberController = require('../controllers/subscribeController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/subscribe', subscriberController.subscribe);

// router.get('/cron', subscriberController.cron);

module.exports = router;
