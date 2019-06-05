const reuqest = require('request');

exports.hitAPI = (url, method, data, header, callback) => {
    axios({
        method: method,
        url: url,
        data: data
    })
        .then((response) => {
            console.log(response);
            return callback(null, response);
        })
        .catch((err) => {
            return callback(err, null);
        });
};

// hitAPI(url, method, data, header, callback) {
//         return fetch(this.url, {
//             method: this.method,
//             body: JSON.stringify(this.data),
//             headers: this.header
//         })
//             .then((res) => {
//                 console.log('res:' + res.toString());
//                 return callback(null, res)
//             })
//             .catch((err) => {
//                 console.log(err);
//                 callback(err, null)
//             });
//     }