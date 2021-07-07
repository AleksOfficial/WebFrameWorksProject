const login = async function(username, password) {
  let authenticationToken = null;
  const query = await UserData.find({email:username, password:password})
  if(query.length==1) {
      authenticationToken = Math.random().toString(36).substr(2, 8);
      const x = await UserData.findOneAndUpdate({email: username, password: password},{token:authenticationToken});
  }
  return authenticationToken;
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

const validateToken = async function (email, token) {
  console.log(token);
  const data = await UserData.find({email:email});
  console.log(data[0]);
  console.log(data != undefined && data[0].token == token);
  return data != undefined && data[0].token == token;
}