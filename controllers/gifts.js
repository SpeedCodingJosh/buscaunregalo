const { showError, showInfo, successfulAlert } = require('../helpers/alert');
const specificGiftPath = '../views/users/wish-info';
const giftPath = '../views/users/create-gift';
const userProfile = 'profile';
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); 
const { response } = require('express');

const createPublicGift = async (req, res = response) => {

    try {
        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        const { productName, productDesc, productImg = 'unknownGift.png' } = req.body;

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log(`Error creating gift: ${err}`);
                return showError(req, res, giftPath, 'Error desconocido, consulte con el administrador (codigo 500).');
            }

            // Store new gift
            const createGift = `INSERT INTO gifts (name, description, img, user_id) values ('${productName}', '${productDesc}', '${productImg}', ${id})`;
            conn.query(createGift, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
                }

                return res.redirect(`/${userProfile}`);
            });

        });
    }
    catch (error) {
        console.log(error);
        return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
    }

};

const getPublicGiftData = async (req, res = response) => {

    try {
        const { username, giftID } = req.params;
        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log(`Error creating gift: ${err}`);
                return showError(req, res, giftPath, 'Error desconocido, consulte con el administrador (codigo 500).');
            }

            // Store new gift
            const createGift = `SELECT g.id as giftID, g.name as giftName, g.description, g.img, g.user_id, g.visible, u.id as userID, u.username, u.visible FROM gifts as g JOIN users as u ON g.user_id = u.id WHERE g.id = ${giftID} AND u.username = '${username}' AND g.visible = 1 AND u.visible = 1`;
            conn.query(createGift, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
                }

                return res.render(specificGiftPath, {
                    giftName: rows[0].giftName,
                    giftDesc: rows[0].description,
                    giftImg: rows[0].img,
                    username: rows[0].username,
                    isAuth: req.cookies.jwt ? true : false,
                    isMine: id == rows[0].userID
                });
            });

        });
    }
    catch (error) {
        console.log(error);
        return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
    }
}

module.exports = {
    createPublicGift,
    getPublicGiftData
}