const db = require('../helper/db');
const temperatureLogs = require('./temperatureLogsService');
const userService = require('./userService');
// const hitApi = require('../helper/hitApi');
const async = require('async');
const request = require('request');
const email = require('../helper/email');

module.exports = {
    save: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO temperature_subscribers (user_id, from_temp, to_temp, city) VALUES (${db.escape(data.userId)}, ${db.escape(data.fromTemp)}, ${db.escape(data.toTemp)}, ${db.escape(data.city)})`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
            });
        });
    },
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM temperature_subscribers`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
            });
        });
    },
    findAllWithUsersEmail: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT u.email, ts.user_id, ts.from_temp, ts.to_temp, ts.city FROM temperature_subscribers ts left join users u on ts.user_id = u.id`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
            });
        });
    },
    cronJob: () => {
        module.exports.findAllWithUsersEmail()
            .then((tempSubscribers) => {
                console.log('=========================');
                console.log('tempSubscribers: ', tempSubscribers);
                var subscriberByCity = {};
                tempSubscribers.forEach((o) => {
                    if (subscriberByCity[o.city]) {
                        subscriberByCity[o.city].push(o);
                    } else {
                        subscriberByCity[o.city] = [];
                        subscriberByCity[o.city].push(o);
                    }
                });

                console.log('=========================');
                console.log('subscriberByCity: ', subscriberByCity);

                var distinctCities = Object.keys(subscriberByCity);
                console.log('=========================');
                console.log('distinctCities: ', distinctCities);

                async.each(distinctCities, (city, cb) => {
                    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;
                    request(url, (err, response, body) => {
                        if (err) {
                            return cb(err);
                        }
                        if (response.statusCode != 200) {
                            return cb(response);
                        }
                        body = JSON.parse(body);
                       
                        let temperature = body.main.temp;
                        let subscribedUserByCity = subscriberByCity[city];
                        async.each(subscribedUserByCity, (subscribedUser, callback) => {
                            console.log('=========================');
                            console.log('subscribedUser: ', subscribedUser);
                            temperatureLogs.getLastestRecord(subscribedUser.user_id)
                            .then((tempLog) => {
                                console.log('=========================');
                                console.log('tempLog: ', tempLog);
                                let log = {
                                    'userId':subscribedUser.user_id,
                                    'belowNormal':0,
                                    'backToNormal':0,
                                    'beyondNormal':0
                                }
                                let mailBody = '';
                                if((!tempLog.length && temperature > subscribedUser.to_temp) || (temperature > subscribedUser.to_temp && tempLog[0].beyond_normal !== 1)) {
                                    log['beyondNormal'] = 1;
                                    mailBody = 'beyondNormal';
                                } else if ((!tempLog.length && temperature < subscribedUser.from_temp) || (temperature < subscribedUser.from_temp && tempLog[0].below_normal !== 1)) {
                                    log['belowNormal'] = 1;
                                    mailBody = 'belowNormal';
                                } else if (tempLog.length && temperature >= subscribedUser.from_temp && temperature <= subscribedUser.to_temp && tempLog[0].back_to_normal !== 1) {
                                    log['backToNormal'] = 1;
                                    mailBody = 'backToNormal';
                                } else {
                                    return callback(); // continue no need to notify user
                                }
                                temperatureLogs.save(log);
                                var mailOptions = {
                                    from: process.env.EMAIL_USERNAME,
                                    to: subscribedUser.email,
                                    subject: 'Weather Notification',
                                    text: mailBody
                                };
                                email.sendMail(mailOptions);
                            })
                            .catch((err) => {
                                return callback(err);
                            })
                        }, (err) => {
                            if(err) {
                                return cb(err);
                            }
                            cb();
                        });
                    });
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('=========================');
                    console.log('======Cron complete======');
                    console.log('=========================');
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

}