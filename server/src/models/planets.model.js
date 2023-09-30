const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

let planets = [];

function orbitablePlanets(planet){
    return planet.koi_disposition === 'CONFIRMED' 
    && planet.koi_insol > 0.36 && planet.koi_insol < 1.11
    && planet.koi_prad < 1.6;
}

function getPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kelper_data.csv'))
        .pipe(parse({
            columns: true,
            comment: '#'
        }))
            .on('data', (chunks) => {
                if (orbitablePlanets(chunks)) {
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
    planets,
    getPlanetsData
};