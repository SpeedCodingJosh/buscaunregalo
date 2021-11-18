const { validationResult } = require("express-validator");
const {showInfo, showError} = require('../helpers/alert');

const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        const route = req.route.path.substring(1);
        return showError(req, res, route, errors.errors[0].msg);
    }

    next();
};

module.exports = validateFields;