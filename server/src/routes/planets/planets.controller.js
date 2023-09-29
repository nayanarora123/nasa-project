const { getAllPlanets } = require('../../models/planets.model');

function httpGetHabitablePlanets(req, res, next){
    return res.status(200).json(getAllPlanets());
}

module.exports = {
    httpGetHabitablePlanets
};