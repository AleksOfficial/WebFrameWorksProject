var express = require('express');
var app = express.Router();
const UserData = require('../schemas/user-data')

app.get("/", (req, res, next) => {
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
  const data = await UserData.find({email:email});
  return data != undefined && data[0].token == token;
}

module.exports = app;