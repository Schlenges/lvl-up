const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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

// Index Route
app.get('/', (req, res) => {
  res.render('overview');
});

// Overview

app.get('/overview', (req, res) => {
  // Select user per mail and get ID (let user = "SELECT ID FROM users WHERE email = " + email)
  let sql = "SELECT * FROM skills WHERE user_ID = 1";
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('overview', {result: result});
  })
});

// Battle Updates Overview
app.get('/battles', (req, res) => {
  let sql = "SELECT skills.name, skills.curr_xp, skills.curr_lvl, skills.max_lvl, battles.description, battles.xp, battles.skill_ID FROM skills JOIN battles ON skills.ID = battles.skill_ID WHERE skills.user_ID = 1"
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('battles', {result: result});
  });
});

// Updating Skills
app.post('/battles', (req, res) => {
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
    res.redirect('/battles');
    });
  });
});

const port = 3000;
app.listen(port, function(){
  console.log('Server started on port ' + port);
});