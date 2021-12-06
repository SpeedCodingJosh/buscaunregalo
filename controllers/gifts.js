const { showError, showInfo, successfulAlert } = require('../helpers/alert');
const specificGiftPath = '../views/users/wish-info';
const giftPath = '../views/users/create-gift';
const editPath = '../views/users/edit-gift';
const userProfile = 'profile';
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); 
const { response } = require('express');

const createPublicGift = async (req, res = response) => {

    try {
        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        let { productName, productDesc, productImg = 'unknownGift.png' } = req.body;

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log(`Error creating gift: ${err}`);
                return showError(req, res, giftPath, 'Error desconocido, consulte con el administrador (codigo 500).');
            }

            // Store new gift
            productName = productName.replace("'", "");
            productDesc = productDesc.replace("'", "");
            productImg = productImg.replace("'", "");
            productName = productName.replace('"', '');
            productDesc = productDesc.replace('"', '');
            productImg = productImg.replace('"', '');
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

const editPublicGift = async (req, res = response) => {

    try {
        let { productName, productDesc, productImg = 'unknownGift.png', giftID, username} = req.body;

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log(`Error creating gift: ${err}`);
                return showError(req, res, editPath, 'Error desconocido, consulte con el administrador (codigo 500).');
            }

            // Edit gift
            productName = productName.replace("'", "");
            productDesc = productDesc.replace("'", "");
            productImg = productImg.replace("'", "");
            productName = productName.replace('"', '');
            productDesc = productDesc.replace('"', '');
            productImg = productImg.replace('"', '');
            const createGift = `UPDATE gifts SET name = '${productName}', description = '${productDesc}', img = '${productImg}' WHERE id = ${giftID}`;
            conn.query(createGift, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
                }

                return res.redirect(`/users/${username}/${giftID}`);
            });

        });
    }
    catch (error) {
        console.log(error);
        return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
    }

};

const deletePublicGift = async (req, res = response) => {

    try {
        const { giftID } = req.params;

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log(`Error creating gift: ${err}`);
                return showError(req, res, editPath, 'Error desconocido, consulte con el administrador (codigo 500).');
            }

            // Edit gift
            const createGift = `UPDATE gifts SET visible = 0 WHERE id = ${giftID}`;
            conn.query(createGift, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
                }

                return res.redirect(`/profile`);
            });

        });
    }
    catch (error) {
        console.log(error);
        return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
    }

};

const getPublicGiftData = (req, res = response) => {
    return getGiftData(req, res, specificGiftPath);
};

const getSpecificGiftData = (req, res = response) => {
    return getGiftData(req, res, editPath);
};

const getGiftData = async (req, res = response, route) => {

    try {
        const { username, giftID } = req.params;
        let id = 0;

        if(req.cookies.jwt)
            id = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log(`Error creating gift: ${err}`);
                return showError(req, res, giftPath, 'Error desconocido, consulte con el administrador (codigo 500).');
            }

            // Select gift
            const selectGift = `SELECT g.id as giftID, g.name as giftName, g.description, g.img, g.user_id, g.visible, u.id as userID, u.username, u.visible FROM gifts as g INNER JOIN users as u ON g.user_id = u.id WHERE g.id = ${giftID} AND u.username = '${username}' AND g.visible = 1 AND u.visible = 1`;
            conn.query(selectGift, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return showError(req, res, 'server-error', 'Error desconocido, consulte con el administrador (codigo 500)');
                }

                return res.render(route, {
                    giftName: rows[0].giftName,
                    giftDesc: rows[0].description,
                    giftImg: rows[0].img,
                    giftID: rows[0].giftID,
                    username: rows[0].username,
                    uploadGiftsPictures: process.env.UPLOADGIFTSURL,
                    isAuth: req.cookies.jwt ? true : false,
                    isMine: id !== 0 && id.id === rows[0].userID
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
    getPublicGiftData,
    editPublicGift,
    getSpecificGiftData,
    deletePublicGift
}