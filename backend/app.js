const express = require('express');
const cors = require('cors');
const app = express();
const store = require('store');
store.set("highScores", { highScores: [] });
const mongoose = require('mongoose');

const Highscore = require('./schemas/highscore');
const UserData = require('./schemas/user-data');

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

app.post("/login", (req, res, next) => {
    if (req.body.email == undefined || req.body.password == undefined) {
        res.status(400).json({
            message: "Username or password missing!"
        });
    } else {
        let authenticationToken = login(req.body.email, req.body.password);
        if (authenticationToken != null){
            res.status(200).json({
                message: "Login successful",
                currentToken: authenticationToken
            });
        } else {
            res.status(404).json({
                message: "Username or password wrong!"
            });
        }
    }
});

app.post("/signup", (req, res, next) => {
    if (req.body.email == undefined || req.body.password == undefined) {
        res.status(400).json({
            message: "Username or password missing!"
        });
    } else {
        UserData.find({email: req.body.email}).then((docs) => {
            if(docs.length > 0) {
                res.status(409).json({
                    message: "Account already exists!"
                });
            } else {
                const userdata = new UserData( {
                    email: req.body.email,
                    password: req.body.password,
                    street: req.body.street, 
                    city: req.body.city, 
                    postcode: req.body.postcode,
                });
                userdata.save();
                let authenticationToken = login(req.body.email,req.body.password);
                console.log(authenticationToken)
                if (authenticationToken != null){
                    res.status(200).json({
                        message: "Created new account!",
                        currentToken: authenticationToken
                    });
                } else {
                    res.status(500).json({
                        message: "Error creating new account!"
                    })
                }
            }
        })
    }
});

app.get("/checklogin", (req, res, next)=> {
    if (req.query.email == undefined || req.query.token == undefined) {
        res.status(400).json({
            message: "Username or token missing!"
        });
    } else {
        if (validateToken(req.query.email, req.query.token)) {
            res.status(200).json({
                valid: true
            });
        } else {
            res.status(401).json({
                valid: false
            });
        }
    }
});

app.post("/highscore", (req, res, next)=> {
    if (req.body.email == undefined || req.body.currentToken == undefined || req.body.highScore == undefined || typeof req.body.highScore != "number") {
        res.status(400).json({
            message: "Username, token or highscore missing or wrong format!"
        });
    } else {
        if (store.get(req.body.email).currentToken == req.body.currentToken) {
            addHighScore(req.body.highScore, req.body.email);
            console.log(store.get("highScores"));
            res.status(200).json({
                message: "Highscore added!"
            });
        } else {
            res.status(401).json({
                message: "Error validating user. Please log in to set highscores!"
            });
        }
    }
});

app.get("/highscore", (req, res, next)=> {
    if (req.query.email == undefined || req.query.token == undefined) {
        res.status(400).json({
            message: "Username or token missing!"
        });
    } else {
        if (validateToken(req.query.email, req.query.token)) {
            Highscore.find().then( (docs) => {
                let r = { highScores:docs };
                res.status(200).json(r);
            }
            );
        } else {
            res.status(401).json({
                message: "Error validating user. Please log in to see highscores!"
            });
        }
    }
});

app.delete("/logout", (req, res, next)=> {
    if (req.query.email == undefined || req.query.token == undefined) {
        res.status(400).json({
            message: "Username or token missing!"
        });
    } else {
        if (validateToken(req.query.email, req.query.token)) {
            let userdata = store.get(req.query.email);
            userdata.currentToken = "";
            store.set(req.query.email, userdata);
            res.status(200).json({
                message: "Logout successful!"
            });
        } else {
            res.status(401).json({
                message: "Error validating user. Please log in to log out :-P"
            });
        }
    }
});

module.exports = app;

function login(username, password) {
    let authenticationToken = null;
    const query = await UserData.find({email:username, password: password});
    console.log(query);
    /*.then((docs) => {
        console.log(docs);
        if(docs.length==1) {
            authenticationToken = Math.random().toString(36).substr(2, 8);
            UserData.findOneAndUpdate({email: username, password: password},{token:authenticationToken});
        }
    })*/
    return authenticationToken;
}

function addHighScore(highScore, userName) {
    const newHighscore = new Highscore({
        email: userName,
        value: highScore
    });
    newHighscore.save();
}

function validateToken(email, token) {
    let data = store.get(email);
    return data != undefined && data.currentToken == token;
}