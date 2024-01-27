const Launch = require('./launches.mongo');
const Planet = require('./planets.mongo');
const axios = require('axios');


const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
    try{      
        const response = await axios.post(SPACEX_API_URL, {
            query: {},
            options: {
                "pagination": false,
                populate: [
                    { path: 'rocket', select: 'name' },
                    { path: 'payloads', select: 'customers' },
                ]
            }
        })

        if(response.status !== 200){
            throw new Error('Request made against SPACEX API is invalid');
        }
        
        const launchDocs = response.data.docs;
        
        for (const launch of launchDocs) {
    
            const customers = launch.payloads.flatMap(payload => payload.customers);
    
            const launchData = {
                flightNumber: launch.flight_number,
                mission: launch.name,
                rocket: launch.rocket.name,
                launchDate: launch.date_local,
                upcoming: launch.upcoming,
                success: launch.success,
                customers,
            };
            saveLaunch(launchData);
        }
        
        console.log('Launches from SPACEX loaded successfully!');
        
    } catch (err) {
        throw new Error(`Could not load planets. Error: ${err}`);
    }

}

async function loadLaunchesData(){
    const loadedLaunch = await isLaunchExists({
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1'
    });

    if(loadedLaunch) {
        console.log('Loaded launches already exists!');
        return; 
    } else {
        await populateLaunches();
    }
}

async function getAllLaunches(skip, limit){
    const launches = await Launch.find({}, '-_id -__v')
        .sort('flightNumber')
        .skip(skip)
        .limit(limit);
    const totalCount = await Launch.countDocuments({});
    const pager = {
        totalItems: totalCount,
        totalPages: limit === 0  ? 0 : Number(Math.ceil(totalCount / limit)),
        pageNo: Number(skip + 1),
        limit: Number(limit)
    };
    return { docs: launches, pager }; 
}

async function saveLaunch(launch){
    try{
        if('target' in launch){
            const planet = await Planet.findOne({ keplerName: launch.target });
            if(!planet){
                throw new Error('No matching target planet found.') 
            }
        }
        /**
         * Replacing updateOne with findOneAndUpdate 
         * because we do not need extra fields in response
         * such as we get $setOnInsert if we use updateOne
         * to prevent any risk from hackers and to give clean 
         * response. 
         */
        await Launch.findOneAndUpdate
        (
            { flightNumber: launch.flightNumber },
            launch, 
            { upsert: true }
        );
    } 
    catch(err) {
        throw new Error(`Could not create launches. ${err}`);
    }
}

async function scheduleNewLaunch(launch){
    let latestFlightNo = await getLatestFlightNumber() + 1;
    let remainingKeys = {
        flightNumber: latestFlightNo,
        customers: ['NAYAN', 'NASA'],
        upcoming: true,
        success: true
    };
    const newLaunch = Object.assign(launch, remainingKeys);
    await saveLaunch(newLaunch);
}

async function getLatestFlightNumber(){
    const DEFAULT_FLIGHT_NUMBER = 100;
    const launch = await Launch
    .findOne()
    // '-' indicates DESC order
    .sort('-flightNumber');

    if(!launch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return launch.flightNumber;
}

async function isLaunchExists(filter){
    return await Launch.findOne(filter);
}

async function isLaunchExistWithId(launchId){
   const launch = await isLaunchExists({ flightNumber: launchId });
   return launch;
}

async function abortLaunch(launchId){
    const launch = await Launch.updateOne(
        { flightNumber: launchId },
        { upcoming: false, success: false }
    )
    return launch.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    loadLaunchesData,
    scheduleNewLaunch,
    isLaunchExistWithId,
    abortLaunch
}
