const jwt = require('jsonwebtoken');

const generateJWT = (username = '') => {

    return new Promise ((resolve, reject) => {

        const payload = { username };

        jwt.sign( payload, process.env.SECRET_JWT_KEY, {
            expiresIn: '24h'
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