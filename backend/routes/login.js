var express = require('express');
var app = express.Router();
const UserData = require('../schemas/user-data');


app.post("/", async function(req, res, next) {
  if (req.body.email == undefined || req.body.password == undefined) {
      res.status(400).json({
          message: "Username or password missing!"
      });
  } else {
      let authenticationToken = await login(req.body.email, req.body.password);
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

const login = async function(username, password) {
    let authenticationToken = null;
    const query = await UserData.find({email:username, password:password})
    if(query.length==1) {
        authenticationToken = Math.random().toString(36).substr(2, 8);
        const x = await UserData.findOneAndUpdate({email: username, password: password},{token:authenticationToken});
    }
    return authenticationToken;
  }
module.exports = app;
