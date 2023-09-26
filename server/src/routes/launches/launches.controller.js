const { launch } = require('../../models/launches.model');

function getAllLaunches(req, res){
    return res.json(200).json(Array.from(launch.values()));
}

module.exports = {
    getAllLaunches,
}