const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT =  (req, res = response, next) => {
    
    const token = req.header('x-access');

    if(!token) {
        return res.status(401).json({ 
            msg: "No puede acceder, por favor logeese primero."
        });
    }

    try {

        const { username } = jwt.verify(token, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error loging user: ${err}`);
                return res.json({code: 500, error: err});
            }
    
            // Login
            const getUser = `SELECT username, visible FROM users WHERE username = '${username}' AND visible = 1`;
            conn.query(getUser, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.json({code: 500, error: err});
                }
                
                if(rows.length <= 0) {
                    return res.status(401).json({
                        code: 401,
                        msg: "Este usuario no existe"
                    });
                }
    
                next();

            });
        });
    }
    catch (error) {
        console.log(error);

        return res.status(401).json({ 
            msg: "Token no valido"
        });
    }

};

module.exports = {
    validateJWT
};