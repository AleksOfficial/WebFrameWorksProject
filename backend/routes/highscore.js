var express = require('express');
var app = express.Router();
const Highscore = require('../schemas/highscore')
const UserData = require('../schemas/user-data')

app.post("/", async function(req, res, next) {
  if (req.body.email == undefined || req.body.currentToken == undefined 
    || req.body.highScore == undefined || typeof req.body.highScore != "number"
    || req.body.puzzle == undefined || typeof req.body.puzzle != "number") {
      res.status(400).json({
          message: "Username, token, puzzle or highscore missing or wrong format!"
      });
  } else {
      if (await validateToken(req.body.email , req.body.currentToken)) {
          addHighScore(req.body.highScore, req.body.email, req.body.puzzle);
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

app.get("/", (req, res, next) => {
    Highscore.find({puzzle:req.query.puzzle}).sort({value: "desc"}).then( (docs) => {
        let r = { highScores:docs };
        console.log(req.query.puzzle);
        res.status(200).json(r);
    });
});

const validateToken = async function (email, token) {
  console.log(token);
  const data = await UserData.find({email:email});
  console.log(data[0]);
  console.log(data != undefined && data[0].token == token);
  return data != undefined && data[0].token == token;
}

  
const addHighScore = async function(highScore, email, puzzle) {
  const newHighscore = new Highscore({
      email: email,
      value: highScore,
      puzzle: puzzle
  });
  const __ = await newHighscore.save();
}        


module.exports = app;