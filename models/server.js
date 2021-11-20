const express = require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const cors = require('cors');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const databaseOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
}

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.middlewares();
        this.routes();
    }

    middlewares () {
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(`${__dirname} /../views/partials`);

        this.app.use(express.static('public'));
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(myconn(mysql, databaseOptions, 'single'));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes () {
        const uploadsPath = '/api/uploads';
        
        this.app.use('/', require('../routes/webRoutes'));
        this.app.use('/', require('../routes/auth'));
        this.app.use('/users', require('../routes/users'));
        this.app.use(uploadsPath, require('../routes/uploads'));
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log(`Listening to port: ${this.port}`);
        });
    }
}

module.exports = Server;