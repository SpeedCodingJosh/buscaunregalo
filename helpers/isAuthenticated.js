const { response } = require('express');
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); 

const isAuthenticated =  async (req, res = response, next) => {
    
    if(req.cookies.jwt) {

        try {

            const { username } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

            req.getConnection((err, conn) => {
                
                if(err) {
                    console.log(err);
                    return next();
                }

                // Login
                const getUser = `SELECT username, visible FROM users WHERE username = '${username}' AND visible = 1`;
                conn.query(getUser, (err, rows) => {
                    
                    if(err) {
                        console.log(err);
                        return next();
                    }
                    
                    if(!rows || rows.length <= 0) {
                        return next();
                    }

                    req.username = username;
                    return next();
                });
            });
        }
        catch (error) {
            console.log(error);
            res.clearCookie('jwt');
            res.redirect('/login');
        }

    }
    else {
        console.log(error);
        res.clearCookie('jwt');
        res.redirect('/login');
    }
};

module.exports = {
    isAuthenticated
};