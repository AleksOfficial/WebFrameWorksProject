var express = require('express');
var app = express.Router();
const UserData = require('../schemas/user-data');

app.post("/",  async function (req, res, next) {
  if (req.body.email == undefined || req.body.password == undefined) {
      res.status(400).json({
          message: "Username or password missing!"
      });
  } else {
      const data = await UserData.find({email: req.body.email});
      if(data.length > 0) {
              res.status(409).json({
                  message: "Account already exists!"
              });
      } else {
          const userdata = new UserData( {
              email: req.body.email,
              password: req.body.password,
              street: req.body.street, 
              city: req.body.city, 
              postcode: req.body.postcode,
              token: ''
          });
          const ret = await userdata.save();
          //console.log(ret)
          let authenticationToken = await login(req.body.email,req.body.password);
          //console.log(authenticationToken)
          if (authenticationToken != null){
              res.status(200).json({
                  message: "Created new account!",
                  token: authenticationToken
              });
          } else {
              res.status(500).json({
                  message: "Error creating new account!" 
              })
          }
      }
      //console.log("Post request complete");
      }}); 

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