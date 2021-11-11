const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        const route = req.route.path.substring(1);
        return res.render(route, {
            alert:true,
            alertTitle: 'Parece que algo salió mal!',
            alertMessage: errors.errors[0].msg,
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: req.route.path
        });
    }

    next();
};

module.exports = validateFields;