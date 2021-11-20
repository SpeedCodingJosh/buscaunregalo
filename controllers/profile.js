const { response } = require("express");
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); 

const getProfile = async (req, res = response) => {
    
    try {

        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect(500, '/server/error');
            }

            // Login
            const loginUser = `SELECT id, name, img, sub, visible FROM users WHERE id = ${id} AND visible = 1`;
            conn.query(loginUser, async (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.redirect(500, '/server/error');
                }

                if(rows.length > 0) {
                    return res.render('profile', {
                        profilePicture: rows[0].img,
                        displayName: rows[0].name
                    });
                }

                else {
                    return res.redirect('login');
                }

            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).redirect('/login');
    }
};

module.exports = {
    getProfile
}