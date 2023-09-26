require('dotenv').config();
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

async function startServer(){
    await loadPlanetsData();
    app.listen(process.env.PORT, () => {
        console.log(`server started on ${process.env.PORT}`);
    })
}

startServer();