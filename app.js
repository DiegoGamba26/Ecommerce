const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sh = {
    keys:'DIEGO'
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

//ROUTES

const userRoute = require('./api/routes/userRoutes');
app.use('/users', userRoute);
module.exports = app,sh;