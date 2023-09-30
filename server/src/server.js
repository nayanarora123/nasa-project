const app = require('./app');
const { getPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 5000;

async function startServer(){
    await getPlanetsData();
    app.listen(PORT, (err) => {
        if(!err){
            console.log(`server started on ${PORT} port`);
        } else {
            console.log(err);
        }
    })
}

startServer();