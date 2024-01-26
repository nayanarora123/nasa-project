require('dotenv').config();
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const mongoose = require('mongoose')

mongoose.connection.on('open', () => {
    console.log(`MongoDB connected successfully!`);
})

mongoose.connection.on('error', err => {
    console.log(`Mongoose error: ${err}`);
})

async function startServer(){
    await mongoose.connect(process.env.MONGO_URL);
    await loadPlanetsData();
    app.listen(process.env.PORT || 8000, () => {
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