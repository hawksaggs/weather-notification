const cron = require('node-cron');
const temperatureSubscribersService = require('../services/temperatureSubscribersService');

cron.schedule('*/10 * * * *', () => {
    console.log('running a task every 10 minutes');
    temperatureSubscribersService.cronJob();
});