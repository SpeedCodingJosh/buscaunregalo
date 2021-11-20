const { response } = require("express");
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); 

const getProfile = async (req, res = response) => {
    
    try {

        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            // Login
            const loginUser = `SELECT id, name, img, sub, visible FROM users WHERE id = ${id} AND visible = 1`;
            conn.query(loginUser, async (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.redirect('/server/error');
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

const userProfile = async (req, res = response) => {
    
    try {

        const { username } = req.params;

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            // Get user profile
            const getProfile = `SELECT u.id, u.name as profileName, u.username, u.img as profilePicture, u.visible, g.id as giftID, g.name giftName, g.img as giftPicture, g.user_id, g.visible FROM users as u INNER JOIN gifts as g ON g.user_id = u.id WHERE u.username = '${username}' AND u.visible = 1 AND g.visible = 1`;
            conn.query(getProfile, async (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.redirect('/server/error');
                }

                // Show user and gifts
                if(rows.length > 0) {
                    return res.render(process.env.OTHER_USER_PROFILE_ROUTE, {
                        profilePicture: rows[0].profilePicture,
                        displayName: rows[0].profileName,
                        rows
                    });
                }

                // In case this user has no gifts, show only profile
                else {
                    const getProfileOnly = `SELECT id, name, username, img, visible FROM users WHERE username = '${username}' AND visible = 1`;
                    conn.query(getProfileOnly, async (err, rows) => {
                        
                        if(err) {
                            console.log(err);
                            return res.redirect('/server/error');
                        }

                        // Show user and gifts
                        if(rows.length > 0) {
                            return res.render(process.env.OTHER_USER_PROFILE_ROUTE, {
                                profilePicture: rows[0].img,
                                displayName: rows[0].name
                            });
                        }

                        // In case this user has no gifts, show only profile
                        else {
                            return res.redirect('/server/error');
                        }
                    });
                }
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.redirect('/server/error');
    }
};

module.exports = {
    getProfile,
    userProfile
}