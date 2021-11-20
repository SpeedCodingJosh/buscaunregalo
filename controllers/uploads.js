const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const { showError,
        successfulAlert } = require("../helpers/alert");
const cargarArchivo = (req, res = response) => {

    const route = req.route.path.substring(1);

    // Verificar si no hay archivos
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.productImg){
        return showError(req, res, route, 'Error al subir la imagen');
    }

    const {productImg} = req.files;
    const separateName = productImg.name.split('.');
    const extension = separateName[separateName.length - 1];

    // Validar las extensiones permitidas
    const allowedExtensions = ['PNG', 'JPG'];

    if (!allowedExtensions.includes(extension)){
        res.json({msg: 'Archivo no permitido'});
        return showError(req, res, route, 'Archivo no permitido');
    }

    // Generar nombre unico de la imagen
    // Subir el archivo al path correspondiente
    const hashName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/gifts', hashName);
    productImg.mv(uploadPath, (err) => {
        if (err){
            return showError(req, res, route, 'Error desconocido, consulte con el administrador (codigo 500)');
        }

        res.json({msg: 'File upload to ' + uploadPath});
        successfulAlert(req, res, route, 'Se subio el archivo correctamente');
        return res.redirect('/profile');
    });
}

module.exports = {
    cargarArchivo
}