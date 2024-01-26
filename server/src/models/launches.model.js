const Launch = require('./launches.mongo');


const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 17, 2030'),
    target: 'kepler-442 b',
    customers: ['NAYAN', 'NASA'],
    upcoming: true,
    success: true
};

saveLaunch(launch);

async function getAllLaunches(){
    return await Launch.find({}, '-_id -__v');
}

async function saveLaunch(launch){
    try{
        await Launch.updateOne(
            { flightNumber: launch.flightNumber },
            launch, 
            { upsert: true }
        );
    } catch(err) {
        console.log(`Could not create launches. Error: ${err}`);
    }
}

function addNewLaunch(launch){
    let launchesArr = getAllLaunches();
    let latestFlightNo = (launchesArr[launchesArr.length - 1].flightNumber) + 1
    let remainingKeys = {
        flightNumber: latestFlightNo,
        customers: ['NAYAN', 'NASA'],
        upcoming: true,
        success: true
    };
    launches.set(latestFlightNo, Object.assign(launch, remainingKeys));
}

function getOneLaunch(id){
    if(!launches.has(id)){
        return false;
    }
    return launches.get(id);
}

function abortLaunch(id){
    let aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    getOneLaunch,
    abortLaunch
}