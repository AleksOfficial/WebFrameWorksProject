var express = require('express');
var app = express.Router();
const Highscore = require('../schemas/highscore')
const UserData = require('../schemas/user-data')

app.post("/", async function(req, res, next) {
  if (req.body.email == undefined || req.body.currentToken == undefined || req.body.highScore == undefined || typeof req.body.highScore != "number") {
      res.status(400).json({
          message: "Username, token or highscore missing or wrong format!"
      });
  } else {
      if (await validateToken(req.body.email , req.body.currentToken)) {
          addHighScore(req.body.highScore, req.body.email);
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

app.get("/", (req, res, next)=> {
  if (req.query.email == undefined || req.query.token == undefined) {
      res.status(400).json({
          message: "Username or token missing!"
      });
  } else {
      if (validateToken(req.query.email, req.query.token)) {
          Highscore.find().sort({value: "desc"}).then( (docs) => {
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

const validateToken = async function (email, token) {
  console.log(token);
  const data = await UserData.find({email:email});
  console.log(data[0]);
  console.log(data != undefined && data[0].token == token);
  return data != undefined && data[0].token == token;
}

  
const addHighScore = async function(highScore, email) {
  const x = await Highscore.find().sort({value:"desc"});
  if (x.length>=10)
  {
      if(x[x.length-1].value<highScore)
      {
          //delete last value
          const _ = await Highscore.findOneAndRemove({email: x[9].email, value: x[9].value});
      }
      else 
      {
          const _ = await Highscore.find({email:email}).sort({value:"desc"});
          if(highScore<_.value)
              return;
          else
              await Highscore.findOneAndRemove({email: email, value: _.value});
      };
  }
  const newHighscore = new Highscore({
      email: email,
      value: highScore
  });
  const __ = await newHighscore.save();
}        


module.exports = app;