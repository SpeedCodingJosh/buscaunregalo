const { response } = require("express");
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); 

const getProfile = async (req, res = response) => {
    const { username } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);
    return getUserInfo(req, res, process.env.MY_USER_PROFILE_ROUTE, { username });
};

const userProfile = async (req, res = response) => {
    const { username } = req.params;
    return getUserInfo(req, res, process.env.OTHER_USER_PROFILE_ROUTE, { username });
};

const getUserInfo = async (req, res = response, path, data) => {
    
    try {

        const { username } = data;

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
                    return res.render(path, {
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
                            return res.render(path, {
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