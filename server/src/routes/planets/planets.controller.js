const { getAllPlanets } = require('../../models/planets.model');

async function httpGetHabitablePlanets(req, res, next){
    return res.status(200).json(await getAllPlanets());
}

module.exports = {
    httpGetHabitablePlanets
};