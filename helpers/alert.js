const showInfo = (req, res, route, msg) => {
    return res.render(route, {
        alert:true,
        alertTitle: 'Parece que algo salió mal!',
        alertMessage: msg,
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: `/${route}`
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
        ruta: `/${route}`
    });
}

const successfulAlert = (req, res, route, msg) => {
    return res.render(route, {
        alert:true,
        alertTitle: msg,
        alertIcon: "success",
        showConfirmButton: true,
        timer: 2000,
        timerProgressBar: true
    });
}

module.exports = {
    showInfo,
    showError,
    successfulAlert
}