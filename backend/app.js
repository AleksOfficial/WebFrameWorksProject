const express = require('express');
const cors = require('cors');
const app = express();
const store = require('store');
store.set("highScores", { highScores: [] });
const mongoose = require('mongoose');

const Highscore = require('./schemas/highscore');

mongoose.connect("mongodb+srv://webfrfinex:webfrfinex@webfrfinalproject.krvha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
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
        if (store.get(req.body.email) == undefined) {
            store.set(req.body.email, {
                password: req.body.password
            });
            let authenticationToken = login(req.body.email, req.body.password);
            if (authenticationToken != null){
                res.status(200).json({
                    message: "Created new account!",
                    currentToken: authenticationToken
                });
            } else {
                store.remove(req.body.email);
                res.status(500).json({
                    message: "Error creating new account!"
                })
            }
        } else {
            res.status(409).json({
                message: "Account already exists!"
            });
        }
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
            res.status(200).json(store.get("highScores"));
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
    let userdata = store.get(username);
    if (userdata != undefined && userdata.password == password) {
        let authenticationToken = Math.random().toString(36).substr(2, 8);
        userdata.currentToken = authenticationToken;
        store.set(username, userdata);
        return authenticationToken;
    }
    return null;
}

function addHighScore(highScore, userName) {
    let highScores = store.get("highScores");
    highScores.highScores.push({ score: highScore, user: userName });
    store.set("highScores", highScores);
}

function validateToken(email, token) {
    let data = store.get(email);
    return data != undefined && data.currentToken == token;
}