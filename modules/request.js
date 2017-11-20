import requestModule from 'request';

function request(options) {
    return new Promise(function (resolve, reject) {
        requestModule(options, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                console.log(`${options.method} ${options.url}`);
                console.log(body);
                resolve(body);
            }
        });
    });
}

export default request;