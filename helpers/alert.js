const showInfo = (req, res, route, msg) => {
    return res.render(route, {
        alert:true,
        alertTitle: 'Parece que algo salió mal!',
        alertMessage: msg,
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: req.route.path
    });
}

const showError = (req, res, route, msg) => {
    return res.render(route, {
        alert:true,
        alertTitle: 'Parece que algo salió mal!',
        alertMessage: msg,
        alertIcon: "warning",
        showConfirmButton: true,
        timer: false,
        ruta: req.route.path
    });
}

const successfulRegistration = (req, res, route, msg) => {
    return res.render(route, {
        alert:true,
        alertTitle: msg,
        alertIcon: "success",
        showConfirmButton: true,
        timer: 2000,
        timerProgressBar: true,
        ruta: req.route.path
    });
}

module.exports = {
    showInfo,
    showError,
    successfulRegistration
}