const { post } = require("request");

export function postText(text) {
    return new Promise((resolve, reject) => {
        post("https://hastebin.com/documents", {
            method: 'POST',
            body: text,
            headers: {
                'Content-Type': 'application/json'
            }
        }, (err, res, body) => {
            if (err) return reject(err);
            resolve(`https://hastebin.com/${JSON.parse(body).key}`);
        });
    });
}