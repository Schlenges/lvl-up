const express = require('express');
const mysql = require('mysql');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport'); //passport
const LocalStrategy = require('passport-local').Strategy; // Local Strategy

const app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// Passport setup
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Database Connection

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'lvl_up'
});

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('MySQL is connected');
});

// Passport Authentication Strategy
passport.use('local-login', new LocalStrategy({passReqToCallback: true},
  function(req, username, password, done){
    let sql = `SELECT * FROM users WHERE name = '${username}'`;
    db.query(sql, (err, user) => {
      if (err) return done(err);
      //if username doesn't exist
      if (!user){
        return done(null, false);
      }
      //if password is wrong
      if (!( user[0].password == password)){
        return done(null, false);
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

//----------------------------------------------------------------- ROUTES ---------------------------------------------------------------------------------------

// Index
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', 
  passport.authenticate('local-login', { successRedirect: '/overview', failureRedirect: '/login' })
);

// Skill Overview
app.get('/overview', (req, res) => {
  let userID = req.session.passport.user;
  let sql = `SELECT * FROM skills WHERE user_ID = ${userID}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('overview', {result: result, page: 'overview'});
  })
});

// Battle Updates Overview
app.get('/updates', (req, res) => {
  let sql = `SELECT skills.name, skills.curr_xp, skills.curr_lvl, skills.max_lvl, battles.description, battles.xp, battles.skill_ID FROM skills JOIN battles ON skills.ID = battles.skill_ID WHERE skills.user_ID = ${req.session.passport.user}`
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('battles', {result: result, page: 'battles'});
  });
});

// Updating XP/LVL
app.put('/updates', (req, res) => {
  let skill_ID = req.body.skill;
  let sql = `UPDATE skills SET curr_xp = curr_xp + ${req.body.xp} WHERE skills.ID = ${skill_ID}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    let sql2 = `SELECT curr_xp, curr_lvl, max_lvl FROM skills WHERE skills.ID = ${skill_ID}`;
    db.query(sql2, (err, result2) => {
      if(err) throw err;
      if(result2[0].curr_xp > 100){
        if(result2[0].curr_lvl < result2[0].max_lvl){
          let xp = result2[0].curr_xp - 100;
          var sql3 = `UPDATE skills SET curr_xp = ${xp}, curr_lvl = curr_lvl + 1 WHERE skills.ID = ${skill_ID}`;
        } else {
          var sql3 = `UPDATE skills SET curr_xp = 100, curr_lvl = max_lvl WHERE skills.ID = ${skill_ID}`;
        };
        db.query(sql3, (err, result3) => {
          if(err) throw err;
        });
      };
    res.redirect('/updates');
    });
  });
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

// Add Skill Form
app.get('/skills/new', (req, res) => {
  res.render('editSkills', {result: false, page: 'profile'});
});

// Edit Skill Form
app.get('/skills/:id', (req, res) => {
  let sql = `SELECT ID, name, curr_lvl, max_lvl FROM skills WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw (err);
    res.render('editSkills', {result: result, page: 'profile'});
  });
});

// Edit/ Create Skills
app.post('/skills', (req, res) => {
  if(req.body.skillID){
    let sql = `UPDATE skills SET name = '${req.body.skill}', curr_lvl = ${req.body.currLvl}, max_lvl = ${req.body.maxLvl} WHERE ID = ${req.body.skillID}`
    db.query(sql, (err, result) => {
      if(err) throw err;
    });
  } else if(req.body.skill != ''){
    let sql = `INSERT INTO skills (name, curr_lvl, max_lvl, user_ID) VALUES ('${req.body.skill}', ${req.body.currLvl}, ${req.body.maxLvl}, ${req.session.passport.user})`;
    db.query(sql, (err, result) => {
      if(err) throw err;
    });
  }
  res.redirect('/edit');
});

// Delete Skills
app.delete('/skills/:id', (req, res) => {
  let sql = `DELETE FROM skills WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.redirect('/edit');
  });
});

// Add Battle Form
app.put('/battles/new', (req, res) => {
  res.render('editBattles', {result: false, skillID: req.body.skillID, page: 'profile'});
});

// Edit Battle Form
app.get('/battles/:id', (req, res) => {
  let sql = `SELECT * FROM battles WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('editBattles', {result: result, page: 'profile'});
  });
});

// Edit/ Create Battles
app.post('/battles', (req, res) => {
  if(req.body.id){
    let sql = `UPDATE battles SET description = '${req.body.battle}', xp = ${req.body.xp} WHERE ID = ${req.body.id}`
    db.query(sql, (err, result) => {
      if(err) throw err;
    });
  } else{
    let sql = `INSERT INTO battles (description, xp, skill_ID) VALUES ('${req.body.battle}', ${req.body.xp}, ${req.body.skillID})`;
    db.query(sql, (err, result) => {
      if(err) throw err;
    });
  }
  res.redirect('/edit');
});

// Delete Battles
app.delete('/battles/:id', (req, res) => {
  let sql = `DELETE FROM battles WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.redirect('/edit');
  });
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------

// Start Server
const port = 3000;
app.listen(port, function(){
  console.log('Server started on port ' + port);
});