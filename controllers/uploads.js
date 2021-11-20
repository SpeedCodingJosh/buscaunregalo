const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const uploadUserPictures = (req, res = response) => {
    return uploadPictures(req, res, 'users');
}

const uploadGiftPictures = (req, res = response) => {
    return uploadPictures(req, res, 'gifts');
}

const uploadPictures = (req, res = response, destiny = 'users') => {
    // Verificar si no hay archivos
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.productImg) {
        console.log(`Err: ${req.files}`);
        return res.json({ code: 400, msg: 'Error, no se envió ningún archivo.'});
    }

    const { productImg } = req.files;
    const separateName = productImg.name.split('.');
    const extension = separateName[separateName.length - 1];

    // Validar las extensiones permitidas
    const allowedExtensions = ['PNG', 'JPG', 'png', 'jpg', 'jepg'];

    if (!allowedExtensions.includes(extension)) {
        return res.json({ code: 400, msg: 'La extensión del archivo no es permitida.'});
    }

    // Generar nombre unico de la imagen
    // Subir el archivo al path correspondiente
    const hashName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, `../public/uploads/${destiny}`, hashName);
    productImg.mv(uploadPath, (err) => {
        if (err){
            return res.json({ code: 500, msg: 'Error al subir el archivo (MV).'});
        }

        return res.json({ code: 200, result: hashName});
    });
}

module.exports = {
    uploadUserPictures,
    uploadGiftPictures
}