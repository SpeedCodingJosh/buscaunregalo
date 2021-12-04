const { rejects } = require("assert");
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
        let id = 0;

        if(req.cookies.jwt)
            id = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            // Get user profile
            const getProfile = `SELECT u.id, u.name as profileName, u.username, u.img as profilePicture, u.visible, g.id as giftID, g.name giftName, g.img as giftPicture, g.user_id, g.visible FROM users as u INNER JOIN gifts as g ON g.user_id = u.id WHERE u.username = '${username}' AND u.visible = 1 AND g.visible = 1`;
            conn.query(getProfile, async (err, rows) => {
                
                if(err) {
                    console.log(`Error on sql: ${err}`);
                    return res.redirect('/server/error');
                }

                let isInFavorite = id === 0;
                // Show user and gifts
                if(rows.length > 0) {
                
                    if(id !== 0)
                        isInFavorite = await isUserOnFavorite(req, res, id.id, rows[0].id);

                    return res.render(path, {
                        ownerID: id !== 0 ? id.id : false,
                        targetID: rows[0].id,
                        profilePicture: rows[0].profilePicture,
                        displayName: rows[0].profileName,
                        username: rows[0].username,
                        giftID: rows[0].giftID,
                        rows,
                        isAuth: req.cookies.jwt ? true : false,
                        isMine: id !== 0 && id.id === rows[0].id,
                        inFavorites: isInFavorite
                    });
                }

                // In case this user has no gifts, show only profile
                else {
                    const getProfileOnly = `SELECT id, name, username, img, visible FROM users WHERE username = '${username}' AND visible = 1`;
                    conn.query(getProfileOnly, async (err, rows) => {
                        
                        if(err) {
                            console.log(`Error on sql no gift: ${err}`);
                            return res.redirect('/server/error');
                        }

                        // Show user and gifts
                        if(rows.length > 0) {
                
                            if(id !== 0)
                                isInFavorite = await isUserOnFavorite(req, res, id.id, rows[0].id);
        
                            return res.render(path, {
                                ownerID: id !== 0 ? id.id : false,
                                targetID: rows[0].id,
                                profilePicture: rows[0].img,
                                displayName: rows[0].name,
                                isAuth: req.cookies.jwt ? true : false,
                                isMine: id !== 0 && id.id === rows[0].id,
                                inFavorites: isInFavorite
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
        console.log(`Error on catch: ${error}`);
        if(error instanceof jwt.TokenExpiredError)
            return res.redirect('/login');

        return res.redirect('/server/error');
    }
};

const getEditProfile = async (req, res = response) => {
    try {

        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            // Get user profile
            const getProfile = `SELECT id, name, username, img, visible FROM users WHERE id = '${id}' AND visible = 1`;
            conn.query(getProfile, async (err, rows) => {
                
                if(err) {
                    console.log(`Error on sql: ${err}`);
                    return res.redirect('/server/error');
                }

                if(rows.length > 0) {
                    return res.render('profile-edit', {
                        profilePicture: rows[0].img,
                        displayName: rows[0].name,
                        username: rows[0].username,
                        isAuth: req.cookies.jwt ? true : false,
                        uploadImgPath: process.env.UPLOADURL
                    });
                }
            });
        });
    }
    catch (error) {
        console.log(`Error on catch: ${error}`);
        if(error instanceof jwt.TokenExpiredError)
            return res.redirect('/login');

        return res.redirect('/server/error');
    }
};

const postEditProfile = async (req, res = response) => {
    try {

        const { profilePicture, profileName, username } = req.body;

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            // Get user profile
            const setProfile = `UPDATE users SET img = "${profilePicture}", name = "${profileName}" WHERE username = "${username}"`;
            conn.query(setProfile, async (err, rows) => {
                
                if(err) {
                    console.log(`Error on sql: ${err}`);
                    return res.redirect('/server/error');
                }

                return res.redirect('/profile');
            });
        });
    }
    catch (error) {
        console.log(`Error on catch: ${error}`);
        if(error instanceof jwt.TokenExpiredError)
            return res.redirect('/login');

        return res.redirect('/server/error');
    }
};

const isUserOnFavorite = async (req, res, ownerID, targetID) => {
    return new Promise ((resolve, rejects) => {
        try {
            req.getConnection((err, conn) => {

                if(err) {
                    console.log(`Error getting user profile: ${err}`);
                    rejects(`Error getting user profile: ${err}`);
                }

                // Get user profile
                const getFavorite = `SELECT owner_id, target_id FROM favorites WHERE owner_id = ${ownerID} AND target_id = ${targetID}`;
                conn.query(getFavorite, async (err, rows) => {
                    
                    if(err) {
                        console.log(err);
                        rejects(`${err}`);
                    }
                    
                    if(rows.length > 0) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        }
        catch (error) {
            console.log(error);
            rejects(`${error}`);
        }
    });
};

const getInitUsers = (req, res = response) => {

    try {

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            // Get user profile
            const getProfile = `SELECT id, name, username, img, visible FROM users WHERE visible = 1 ORDER BY RAND() LIMIT 5`;
            conn.query(getProfile, async (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.redirect('/server/error');
                }

                // Show users
                return res.render("home", {
                    rows,
                    isAuth: req.cookies.jwt ? true : false
                });
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.redirect('/server/error');
    }
};

const addFavorite = (req, res = response) => {
    
    try {

        const { ownerID, targetID } = req.body;

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            // Get user profile
            const addToFav = `INSERT INTO favorites (owner_id, target_id) values (${ownerID}, ${targetID})`;
            conn.query(addToFav, async (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.redirect('/server/error');
                }

                // Show users
                return res.redirect("/favorites");
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.redirect('/server/error');
    }
};

const getFavoriteList = async (req, res = response) => {
    
    try {

        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error getting user profile: ${err}`);
                return res.redirect('/server/error');
            }

            const getFavoriteList = `SELECT f.owner_id, f.target_id, u.id, u.name, u.username, u.img FROM favorites as f INNER JOIN users as u ON u.id = f.target_id WHERE owner_id = ${id}`;
            conn.query(getFavoriteList, async (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.redirect('/server/error');
                }

                // Get users profiles
                return res.render('favorites', {
                    rows
                });
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
    userProfile,
    getInitUsers,
    getEditProfile,
    postEditProfile,
    addFavorite,
    getFavoriteList
}