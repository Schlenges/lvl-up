const passport = require('passport');
      LocalStrategy = require('passport-local').Strategy;
      db = require('../config/db');

//Local Signup
passport.use('local-signup', new LocalStrategy({usernameField: 'email', passReqToCallback: true},
  function(req, email, password, done){
    let sql = `SELECT email, name FROM users WHERE email = '${email}' OR name = '${req.body.username}'`;
    db.query(sql, (err, user) => {
      if(err) return done(err);
      if(user.length == 0){
        var newUser = {
          username: req.body.username,
          password: password
        };

        let sql = `INSERT INTO users (name, email, password) VALUES ('${req.body.username}', '${email}', '${password}')`;
        db.query(sql, (err, user) => {
          newUser.ID = user.insertId;
          return done(null, newUser);
        })
      } else if(user[0].email == email){
        return done(null, false, {message: 'This email is already signed up!'});
      } else if(user[0].name == req.body.username){
        return done(null, false, {message: 'Sorry, this username is already taken!'});
      }
    })
  }
));

// Local Login
passport.use('local-login', new LocalStrategy({passReqToCallback: true},
  function(req, username, password, done){
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