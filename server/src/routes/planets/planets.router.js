const express = require('express');
const { httpGetHabitablePlanets } = require('./planets.controller');

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetHabitablePlanets);

module.exports = planetsRouter;