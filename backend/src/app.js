const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: 'http://localhost:8081', // Replace with your frontend URL
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes');

app.use('/api', routes);

module.exports = app;
