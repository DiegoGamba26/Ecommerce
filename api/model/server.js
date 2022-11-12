const NODE_ENV = process.env.NODE_ENV || 'production';
require('dotenv').config({
    path: './.env'
});
const http = require('http');
const app = require('../../app');

const port = process.env.PORT || 4000;
console.log(port);

const server = http.createServer(app);
server.listen(port);