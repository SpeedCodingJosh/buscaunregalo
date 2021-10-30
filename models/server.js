const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.userPath = 'api/'
        this.middlewares();
        this.routes();
    }

    middlewares () {
        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(cors());
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