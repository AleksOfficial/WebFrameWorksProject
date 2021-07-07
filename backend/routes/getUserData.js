var express = require('express');
var app = express.Router();
const UserData = require('../schemas/user-data')

app.get("/", (req, res, next) => {
  console.log(req.query.email + " " + req.query.token);
  if (req.query.email == undefined || req.query.token == undefined) {
      res.status(400).json({
          message: "Username or token missing!"
      });
  } else {
      if (validateToken(req.query.email, req.query.token)) {
          UserData.find({email: req.query.email}).then((docs)=> {
            res.status(200).json(docs[0]);
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

module.exports = app;