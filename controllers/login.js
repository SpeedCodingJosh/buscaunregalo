const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const { showError, showInfo, successfulAlert } = require('../helpers/alert');
const registerPath = 'register';
const loginPath = 'login';

const login = async (req, res) => {
    
    try {
        const { username, password } = req.body;

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error loging user: ${err}`);
                return res.redirect(500, '/server/error');
            }

            // Login
            const loginUser = `SELECT id, name, username, pass, email, img, sub, visible FROM users WHERE ((username = '${username}') XOR (email = '${username}')) AND visible = 1`;
            conn.query(loginUser, async (err, rows) => {
                
                if(err) {
                    console.log(err);
                    return res.redirect(500, '/server/error');
                }

                if(rows.length > 0) {
                    // Compare passwords
                    if(!bcryptjs.compareSync(`${password}${process.env.PASSCRYPT}`, rows[0].pass)) {
                        return res.render('login', {
                            errorCode: 'Usuario o contraseña incorrecta'
                        });
                    }

                    // Map result
                    const result = rows.map(({ id, name, username, email, img, sub }) => ({ id, name, username, email, img, sub }));

                    // Generate web token
                    const token = await generateJWT(result[0].username, result[0].id);

                    const cookieOptions = {
                        expires: new Date(Date.now() + process.env.SECRET_JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };

                    res.cookie('jwt', token, cookieOptions);

                    return res.redirect('/profile');
                }

                else {
                    return res.render('login', {
                        errorCode: 'Usuario o contraseña incorrecta'
                    });
                }

            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).redirect('/login');
    }
};

const register = (req, res) => {

    const { username, email, password, img = 'unknownUser.png', displayName = ''} = req.body;

    try {

        req.getConnection((err, conn) => {

            if(err) {
                console.log(`Error creating user: ${err}`);
                return res.redirect(500, '/server/error');
            }

            // Encrypt the password
            const salt = bcryptjs.genSaltSync();
            const cryptedPass = bcryptjs.hashSync(`${password}${process.env.PASSCRYPT}`, salt);

            // Store new user
            const createUser = `INSERT INTO users (name, username, email, pass, img) values ('${displayName}', '${username}', '${email}', '${cryptedPass}', '${img}')`;
            conn.query(createUser, (err, rows) => {
                
                if(err) {
                    console.log(err);
                    if(err.errno === 1062)
                        // Validate if email already exists
                        if(err.sqlMessage.includes('email'))
                            return showError(req, res, registerPath, 'Este correo ya existe, por favor elija otro.');
                        // Validate if username already exists
                        else if(err.sqlMessage.includes('username'))
                            return showError(req, res, registerPath, 'Este nombre de usuario ya existe, por favor elija otro.');
                        else 
                            return showError(req, res, registerPath, 'Error desconocido, consulte con el administrador (codigo 1062)');
                        
                    else
                        return showError(req, res, registerPath, 'Error desconocido, consulte con el administrador (codigo 500)');
                }

                return successfulAlert(req, res, loginPath, 'Usuario registrado correctamente');
                // return res.render(loginPath);
            });
        });

    }
    catch (error) {
        console.log(error);
        return showError(req, res, registerPath, 'Error desconocido, consulte con el administrador (codigo 500)');
    }
};

module.exports = {
    register, login
}