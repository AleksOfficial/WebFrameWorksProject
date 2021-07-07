var express = require('express');
var app = express.Router();
const UserData = require('../schemas/user-data');


app.get("/", async function (req, res, next) {
  if (req.query.email == undefined || req.query.token == undefined) {
      res.status(400).json({
          message: "Username or token missing!"
      });
  } else {
   // console.log(req);
      if (await validateToken(req.query.email, req.query.token)) {
          console.log("valid token is true");
          res.status(200).json({
              valid: true
          });
      } else {
          console.log("valid token is false");
          res.status(401).json({
              valid: false
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