var express = require('express');
var app = express.Router();
const UserData = require('../schemas/user-data');


app.get("/", async function (req, res, next) {
  if (req.query.email == undefined || req.query.token == undefined) {
      res.status(400).json({
          message: "Username or token missing!"
      });
  } else {
      if (await validateToken(req.query.email, req.query.token)) {
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

const validateToken = async function (email, token) {
  const data = await UserData.find({email:email});
  return data != undefined && data[0].token == token;
}

module.exports = app;