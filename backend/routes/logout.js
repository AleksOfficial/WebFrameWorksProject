var express = require('express');
var app = express.Router();
const UserData = require('../schemas/user-data');

app.delete("/", (req, res, next)=> {
  if (req.query.email == undefined || req.query.token == undefined) {
      res.status(400).json({
          message: "Username or token missing!"
      });
  } else {
      if (validateToken(req.query.email, req.query.token)) {
          //Set token logged in the DB to nothing
          let userdata = UserData.findOneAndUpdate({email:req.query.email}, {token: ''});
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

const validateToken = async function (email, token) {
  const data = await UserData.find({email:email});
  return data != undefined && data[0].token == token;
}
module.exports = app;