// -----------------------------------------------------------------
//                               SETUP 
// -----------------------------------------------------------------

const express = require('express');
      methodOverride = require('method-override'); // for form input
      bodyParser = require('body-parser');
      passport = require('passport');
      LocalStrategy = require('passport-local').Strategy;
      flash = require('express-flash');
      cookieParser = require('cookie-parser');
      db = require('./db');

const app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// Passport setup
app.use(cookieParser('keyboard cat'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// -----------------------------------------------------------------
//                 PASSPORT/ AUTHENTICATION STRATEGIES
// -----------------------------------------------------------------

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

// -----------------------------------------------------------------
//                            MIDDLEWARE
// -----------------------------------------------------------------

// Check if user is already logged in
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    if(req.path == '/login' || req.path == '/signup'){
      res.redirect('/overview');
    } else {
      return next();
    }
  } else {
    if(req.path == '/login' || req.path == '/signup'){
      return next();
    } else {
      res.redirect('/login');
    }
  }
};

//-----------------------------------------------------------------
//                            ROUTES 
// -----------------------------------------------------------------

app.all('*', isLoggedIn);

// Index
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Signup
app.get('/signup', (req, res) => {
  res.render('signup', {message: req.flash('error')})
});

app.post('/signup',
  passport.authenticate('local-signup', {successRedirect: '/overview', failureRedirect: '/signup', failureFlash: true})
);

// Login
app.get('/login', (req, res) => {
  res.render('login', {message: req.flash('error')});
});

app.post('/login', 
  passport.authenticate('local-login', {successRedirect: '/overview', failureRedirect: '/login', failureFlash: true})
);

// Logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Skill Overview
app.get('/overview', (req, res) => {
  let userID = req.session.passport.user;
  let sql = `SELECT * FROM skills WHERE user_ID = ${userID}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('overview', {result: result, page: 'overview'});
  })
});

// Profile
app.get('/profile', (req, res) => {
  res.render('profile', {page: 'profile'});
});

// Edit Overview
app.get('/edit', (req, res) => {
  let sql = `SELECT skills.name, skills.curr_xp, skills.curr_lvl, skills.max_lvl, battles.description, battles.xp, skills.ID AS skill_ID, battles.ID AS battle_ID FROM skills LEFT JOIN battles ON skills.ID = battles.skill_ID WHERE skills.user_ID = ${req.session.passport.user}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    if(result.length == 0){
      res.redirect('/skills/new');
    } else{
      res.render('edit', {result: result, page: 'profile'});
    }
  });
});

// ------------------------------------------------------------
const updateRoutes = require('./routes/updates');
      skillRoutes = require('./routes/skills');
      battleRoutes = require('./routes/battles');

app.use('/updates', updateRoutes);
app.use('/skills', skillRoutes);
app.use('/battles', battleRoutes);




// -----------------------------------------------------------------
//                            SERVER
// -----------------------------------------------------------------

// Start Server
const port = 3000;
app.listen(port, function(){
  console.log('Server started on port ' + port);
});