const express = require('express');
const { getHabitablePlanets } = require('./planets.controller');

const planetsRouter = express.Router();

planetsRouter.get('/planets', getHabitablePlanets);

module.exports = planetsRouter;