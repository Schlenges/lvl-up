const express = require('express');
const mysql = require('mysql');

const app = express();

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

// Battle Updates
app.get('/battles', (req, res) => {
  let sql = "SELECT skills.name, skills.curr_xp, skills.curr_lvl, skills.max_lvl, battles.description, battles.xp FROM skills JOIN battles ON skills.ID = battles.skill_ID WHERE skills.user_ID = 1"
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.render('battles', {result: result});
  });
});

const port = 3000;
app.listen(port, function(){
  console.log('Server started on port ' + port);
});