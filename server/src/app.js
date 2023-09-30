const express = require('express');
const cors = require('cors');
const planetsRoute = require('./routes/planets/planets.route');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/planets', planetsRoute);

module.exports = app;