const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose'); //MongoDB

//Tables for DB
const Highscore = require('./schemas/highscore');
const UserData = require('./schemas/user-data');

//Defining Possible Routes
let signupRouter        = require('./routes/signup');
let highscoreRouter     = require('./routes/highscore');
let getuserdataRouter   = require('./routes/getUserData');
let loginRouter         = require('./routes/login');
let checkloginRouter    = require('./routes/checklogin');
let logoutRouter        = require('./routes/logout');
let gethighscoreRouter  = require('./routes/getHighscore');

//connector to DB
mongoose.connect("mongodb+srv://webfrfinex:webfrfinex@webfrfinalproject.krvha.mongodb.net/webfrfinex?retryWrites=true&w=majority")
    .then(()=> {
        console.log("Connected to DB");
    })
    .catch(()=> {
        console.log("Connection failed");
    })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//linking routes
app.use('/signup',      signupRouter);
app.use('/highscore',   highscoreRouter);
app.use('/getUserData', getuserdataRouter);
app.use('/login',       loginRouter);
app.use('/checklogin',  checkloginRouter);
app.use('/logout',      logoutRouter);
app.use('/getHighscore', gethighscoreRouter);

module.exports = app;

