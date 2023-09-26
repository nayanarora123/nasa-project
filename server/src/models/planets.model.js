const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

let planets = [];

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
        .on('data', (chunks) => {
            if(isHabitablePlanet(chunks)){
                planets.push(chunks);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject();
        })
        .on('end', () => {
            resolve();
        })
    })
}

module.exports = {
    loadPlanetsData,
    planets
}