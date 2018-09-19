const db = require('../db');

exports.createBattle = (req, res) => {
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
  res.redirect('/skills/edit');
};

exports.addBattle = (req, res) => {
  res.render('editBattles', {result: false, skillID: req.body.skillID, page: 'profile'});
};

exports.editBattle = (req, res) => {
  let sql = `SELECT * FROM battles WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('editBattles', {result: result, page: 'profile'});
  });
};

exports.deleteBattle = (req, res) => {
  let sql = `DELETE FROM battles WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.redirect('/skills/edit');
  });
};

module.exports = exports;