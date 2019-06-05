const db = require('../helper/db');

module.exports = {
    getDistinctUsers: () => {
        return new Promise((resolve, reject) => {
            db.query(`select distinct(user_id), below_normal, beyond_normal, back_to_normal, created_at from temperature_logs order by user_id asc, created_at desc`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
            });
        });
    },
    save: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO temperature_logs (user_id, below_normal, back_to_normal, beyond_normal) VALUES (${db.escape(data.userId)}, ${db.escape(data.belowNormal)}, ${db.escape(data.backToNormal)}, ${db.escape(data.beyondNormal)})`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
            });
        });
    },
    getLastestRecord: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(`select * from temperature_logs where user_id = ${db.escape(userId)} order by created_at desc limit 1`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
            });
        });
    },
}