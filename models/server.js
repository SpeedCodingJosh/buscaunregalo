const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.middlewares();
        this.routes();
    }

    middlewares () {
        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(cors());
    }

    routes () {
        this.app.get('/', (req, res) => {
            res.sendFile('index.html');
        })

        this.app.get('/api', (req, res) => {
            res.json({});
        })

        this.app.post('/api', (req, res) => {
            res.json({});
        })

        this.app.put('/api', (req, res) => {
            res.json({});
        })

        this.app.delete('/api', (req, res) => {
            res.json({});
        })
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log(`Listening to port: ${this.port}`);
        });
    }
}

module.exports = Server;