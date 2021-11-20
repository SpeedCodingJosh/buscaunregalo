const { showError, showInfo, successfulAlert } = require('../helpers/alert');
const giftPath = '../views/users/create-gift';
const userProfile = 'profile';

const createPublicGift = async (req, res) => {

    try {

        const { id } = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_JWT_KEY);

        const { productName, productDesc, productImg = '' } = req.body;

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log(`Error creating gift: ${err}`);
                return showError(req, res, giftPath, 'Error desconocido, consulte con el administrador (codigo 500).');
            }

            // Store new user
            const createGift = `INSERT INTO gifts (name, desc, img, user_id) values ('${productName}', '${productDesc}', '${productImg}', ${id})`;
            conn.query(createGift, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return showError(req, res, registerPath, 'Error desconocido, consulte con el administrador (codigo 500)');
                }

                return successfulAlert(req, res, userProfile, 'Nuevo regalo creado correctamente.');
                // return res.render(loginPath);
            });

        });
    }
    catch (error) {
        console.log(err);
        return showError(req, res, registerPath, 'Error desconocido, consulte con el administrador (codigo 500)');
    }

};

module.exports = {
    createPublicGift
}