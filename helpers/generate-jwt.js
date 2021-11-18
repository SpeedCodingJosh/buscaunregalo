const jwt = require('jsonwebtoken');

const generateJWT = (username = '', id = 0) => {

    if(id <= 0) {
        return;
    }

    return new Promise ((resolve, reject) => {

        const payload = { username, id };

        jwt.sign( payload, process.env.SECRET_JWT_KEY, {
            expiresIn: process.env.SECRET_JWT_KEY_EXPIRATION
        }, (err, token) => {
            if(err) {
                console.log(`Error signing token: ${err}`);
                reject('No se pudo generar el token');
            }
            else {
                resolve(token);
            }
        });
    });
};

module.exports = {
    generateJWT
};