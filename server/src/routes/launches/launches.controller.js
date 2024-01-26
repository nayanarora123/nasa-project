const {
    getAllLaunches, 
    addNewLaunch,
    getOneLaunch,
    abortLaunch
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res){
    return res.status(200).json(await getAllLaunches());
}

function httpAddNewLaunch(req, res){
    const launch = req.body;
    if(!launch.mission || !launch.target || !launch.launchDate || !launch.rocket){
        return res.status(400).json({
            error: "Missing required launch property"
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: "Invalid launch date" 
        });
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res){
    let id = Number(req.params.id);
    let launch = getOneLaunch(id);
    if(!launch){
        return res.status(404).json({error: 'launch not found'});
    }
    abortLaunch(id);
    return res.status(200).json(launch)
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}