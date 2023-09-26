const { planets } = require('../../models/planets.model');

function getHabitablePlanets(req, res, next){
    return res.status(200).json(planets);
}

module.exports = {
    getHabitablePlanets
};