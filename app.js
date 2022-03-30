require('dotenv').config();
const {urlencoded} = require('express');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const neighborhoodController = require('./controllers/neighborhoodController');


// Configuration
const db = mongoose.connection;

// Connect to Mongo
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
console.log(process.env.MONGO_URI);

// Connection Error/Success
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", process.env.MONGO_URI));
db.on("disconnected", () => console.log("mongo disconnected"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('short'));
app.use(cors());

// preroute
app.use('/neighborhoods', neighborhoodController);

app.listen(3001, ()=>{
    console.log('app is running');
});