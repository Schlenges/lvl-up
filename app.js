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

require('./config/passport');

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
//                            MIDDLEWARE
// -----------------------------------------------------------------

// Check if user is already logged in
const authentication = require('./routes/middleware/auth');

//-----------------------------------------------------------------
//                            ROUTES 
// -----------------------------------------------------------------

app.all('*', authentication);



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
const loginRoutes = require('./routes/login');
      updateRoutes = require('./routes/updates');
      skillRoutes = require('./routes/skills');
      battleRoutes = require('./routes/battles');

app.use('/', loginRoutes);
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