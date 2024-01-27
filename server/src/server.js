const http = require('http');
require('dotenv').config();
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');
const { connectMongoose } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await connectMongoose();
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(PORT, () => {
        console.log(`server started on ${process.env.PORT}`);
    })
}

startServer();

/**
 * Version 6 and above does not need this needed parameters
 *  await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
 */