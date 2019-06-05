const userService = require('../services/userService');
const tempSubscriberService = require('../services/temperatureSubscribersService');
const Validator = require('validatorjs');

module.exports = {
    subscribe: (req, res) => {
        // add validations
        const { email, ...data } = req.body;
        userService.getByEmail(email)
            .then((user) => {
                if (user && user.length) {
                    return user;
                } else {
                    return userService.save(email)
                }
            })
            .then((users) => {
                // console.log(users);
                if (users.insertId) {
                    data['userId'] = users.insertId;
                } else {
                    data['userId'] = users[0].id;
                }
                // console.log(data);
                return tempSubscriberService.save(data);
            })
            .then((tempSubscriber) => {
                return res.status(200).send({
                    error: false,
                    data: tempSubscriber
                });
            })
            .catch((err) => {
                return res.status(400).send({
                    error: true,
                    message: err.message
                });
            })
    },
    cron: (req, res) => {
        tempSubscriberService.cronJob();
    }
}