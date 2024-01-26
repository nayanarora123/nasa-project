const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Planet = require('./planets.mongo');
const planetsRouter = require('../routes/planets/planets.router');


function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
      && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
      && planet['koi_prad'] < 1.6;
  }

function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            columns: true,
            comment: '#'
        }))
        .on('data', async (data) => {
            if(isHabitablePlanet(data)){
                insertPlanets(data)
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject();
        })
        .on('end', async () => {
            console.log(`${(await getAllPlanets()).length} habitable planets found!`);
            resolve();
        })
    })
}

async function getAllPlanets(){
    return await Planet.find({}, {
        _id: 0, __v: 0
    });
}

async function insertPlanets(planet){
    try{
        await Planet.updateOne(
            { keplerName: planet.kepler_name },
            { $set: { keplerName: planet.kepler_name } },
            { upsert: true }
        )
    } catch(err) {
        console.log(`Could not create new planets: ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}
