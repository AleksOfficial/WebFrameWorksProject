//Since there was a problem last time already with the reference errors, this time, we will just have the functions here
//everywhere they are used, copy and paste them. Bad Practise, but better be safe than sorry. 
//Alternatively it would be possible to define these functions as controllers and export them as modules so they can be used like this:
//app.login(bob, 123); 
//But again, we stick to this method for now. 



//login finds the user with the combination of username and password - YES they are saved in clear text. bad practise again but for now this will do.
//Then returns a token to authenticate the user and saves the current authentication token in the database
const login = async function(username, password) {
  let authenticationToken = null;
  const query = await UserData.find({email:username, password:password})
  if(query.length==1) {
      authenticationToken = Math.random().toString(36).substr(2, 8);
      const x = await UserData.findOneAndUpdate({email: username, password: password},{token:authenticationToken});
  }
  return authenticationToken;
}

//adds Highscore to the database, puzzle = which puzzle this highscore belongs to
const addHighScore = async function(highScore, email, puzzle) {
  const newHighscore = new Highscore({
      email: email,
      value: highScore,
      puzzle: puzzle
  });
  const __ = await newHighscore.save();
}  

//looks for the current token in the database and compares it with the local storage
const validateToken = async function (email, token) {
  const data = await UserData.find({email:email});
  return data != undefined && data[0].token == token;
}
