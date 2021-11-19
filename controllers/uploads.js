const { response } = require("express");
const path = require('path');
const { showError } = require("../helpers/alert");

const cargarArchivo = (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.img){
        const route = req.route.path.substring(1);
        return showError(req, res, route, 'Error al subir la imagen');
    }

    const {img} = req.files;
    const uploadPath = path.join(__dirname, '../uploads/gifts', img.name);

    img.mv(uploadPath, (err) => {
        if (err)
            return showError(req, res, route, 'Error desconocido, consulte con el administrador (codigo 500)');

        return res.redirect('/profile');
    })
}

module.exports = {
    cargarArchivo
}