const express = require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const cors = require('cors');
const hbs = require('hbs');

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
        this.userPath = 'api/'
        this.middlewares();
        this.routes();
    }

    middlewares () {
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(`${__dirname}/views/partials`);

        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(myconn(mysql, databaseOptions, 'single'));
    }

    routes () {
        this.app.use('/api/user', require('../routes/user'));
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log(`Listening to port: ${this.port}`);
        });
    }
}

module.exports = Server;