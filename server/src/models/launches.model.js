const launches = new Map();

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

launches.set(launch.flightNumber, launch);

function getAllLaunches(){
    return Array.from(launches.values());
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