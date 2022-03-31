require('dotenv').config();
const {urlencoded} = require('express');
const express = require('express');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const User = require('./models/user');
const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "mySessions",
});
const neighborhoodController = require('./controllers/neighborhoodController');
const userController = require('./controllers/userController');


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
app.use(express.static("public"));
app.use(require('./middleware/logger'));
const isLoggedIn = require('./middleware/isLoggedIn');
app.use(express.json());
app.use(morgan('short'));
app.use(cors());

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
}));
app.use(async (req, res, next)=>{
    console.log('in app.js')
    // This will send info from session to templates
    res.locals.isLoggedIn = req.session.isLoggedIn;
    if(req.session.isLoggedIn){
        const currentUser = await User.findById(req.session.userId);
        res.locals.username = currentUser.username;
        res.locals.userId = req.session.userId.toString();
    };
    next();
});

// preroute
app.use('/neighborhoods', neighborhoodController);
app.use('/users', userController);

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log('app is running');
});