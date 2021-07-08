var express = require('express');
var app = express.Router();
const Highscore = require('../schemas/highscore')
const UserData = require('../schemas/user-data')

app.get("/", (req, res, next) => {
  if (req.query.email == undefined || req.query.token == undefined) {
      res.status(400).json({
          message: "Username or token missing!"
      });
  } else {
      if (validateToken(req.query.email, req.query.token)) {
          Highscore.find({email:req.query.email}).sort({value:'desc'}).then((docs)=> {
            if(docs.length>0)
              res.status(200).json(docs[0]);
            else
              res.status(404).json({message: "Error: No Highscores found with from that account"});
          });
      }
  }
});


const validateToken = async function (email, token) {
  const data = await UserData.find({email:email});
  return data != undefined && data[0].token == token;
}

module.exports = app;