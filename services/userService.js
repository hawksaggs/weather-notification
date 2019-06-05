const db = require('../helper/db');

module.exports = {
    save: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users (email) VALUES (${db.escape(email)})`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    },
    getByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email = ${db.escape(email)}`, (err, results, fields) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }
}