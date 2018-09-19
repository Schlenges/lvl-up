const db = require('../db');

exports.createSkill = (req, res) => {
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
};

exports.skillForm = (req, res) => {
  res.render('editSkills', {result: false, page: 'profile'});
};

exports.editSkill = (req, res) => {
  let sql = `SELECT ID, name, curr_lvl, max_lvl FROM skills WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw (err);
    res.render('editSkills', {result: result, page: 'profile'});
  });
};

exports.deleteSkill = (req, res) => {
  let sql = `DELETE FROM skills WHERE ID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.redirect('/edit');
  });
};

module.exports = exports;