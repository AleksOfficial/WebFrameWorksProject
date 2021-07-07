var express = require('express');
var app = express.Router();

app.delete("/", (req, res, next)=> {
  if (req.query.email == undefined || req.query.token == undefined) {
      res.status(400).json({
          message: "Username or token missing!"
      });
  } else {
      if (validateToken(req.query.email, req.query.token)) {
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
  console.log(token);
  const data = await UserData.find({email:email});
  console.log(data[0]);
  console.log(data != undefined && data[0].token == token);
  return data != undefined && data[0].token == token;
}
module.exports = app;