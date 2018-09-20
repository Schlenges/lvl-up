const passport = require('passport');
      LocalStrategy = require('passport-local').Strategy;
      db = require('../config/db');

//-----------------------------------------------------
//                    Local Signup
//-----------------------------------------------------

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',           // originally defaults to 'username'
    passReqToCallback: true
  },
  function(req, email, password, done){
    let sql = `SELECT email, name 
                FROM users 
                WHERE email = '${email}' OR name = '${req.body.username}'`;

    db.query(sql, (err, user) => {
      if(err) return done(err);

      if(user.length > 0){
        let message = '';
        // if email is already signed up
        if(user[0].email == email){
          message = 'This email is already signed up!';
        }
        // if username is already taken
        else if(user[0].name == req.body.username){
          message = 'Sorry, this username is already taken!';
        }

        return done(null, false, {message: message});
      }

      // create the user and set the local credentials
      let newUser = {
        username: req.body.username,
        password: password
      };

      let sql = `INSERT INTO users (name, email, password) 
                  VALUES ('${req.body.username}', '${email}', '${password}')`;

      db.query(sql, (err) => {
        if(err) throw err;
        newUser.ID = user.insertId;  
        return done(null, newUser);
      });
    });
  }
));

//-----------------------------------------------------
//                  Local Login
//-----------------------------------------------------

passport.use('local-login', new LocalStrategy(
  function(username, password, done){
    let sql = `SELECT * FROM users WHERE name = '${username}'`;

    db.query(sql, (err, user) => {
      if (err) return done(err);
      //if username doesn't exist
      if (!user.length){
        return done(null, false, {message: 'No user found'});
      }
      //if password is wrong
      else if (!(user[0].password == password)){
        return done(null, false, {message: 'Wrong password'});
      }
      //if successful
      return done(null, user[0]);			
    });
  }
));

//-----------------------------------------------------
//                  Session Setup
//-----------------------------------------------------

// Serialize user for session
passport.serializeUser(function(user, done){
  done(null, user.ID);
});

// Deserialize user
passport.deserializeUser(function(id, done){
  db.query(`SELECT * FROM users WHERE ID = ${id}`, (err, user) => {
    done(err, user[0]);
  });
});