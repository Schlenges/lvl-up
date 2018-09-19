const db = require('../db');

exports.showSkills = (req, res) => {
  let sql = `SELECT * FROM skills WHERE user_ID = ${req.session.passport.user}`;

  db.query(sql, (err, result) => {
    if(err) throw err;
    res.render('overview', {result: result, page: 'overview'});
  })
};

exports.createSkill = (req, res) => {
  if(req.body.skillID){
    let sql = `UPDATE skills
                SET name = '${req.body.skill}', curr_lvl = ${req.body.currLvl}, max_lvl = ${req.body.maxLvl}
                WHERE ID = ${req.body.skillID}`;

    db.query(sql, (err, result) => {
      if(err) throw err;
    });

  } else if(req.body.skill != ''){
    let sql = `INSERT INTO skills (name, curr_lvl, max_lvl, user_ID)
                VALUES ('${req.body.skill}', ${req.body.currLvl}, ${req.body.maxLvl}, ${req.session.passport.user})`;

    db.query(sql, (err, result) => {
      if(err) throw err;
    });
  }
  res.redirect('/skills/edit');
};

exports.skillForm = (req, res) => {
  res.render('editSkills', {result: false, page: 'profile'});
};

exports.editOverview = (req, res) => {
  let sql = `SELECT skills.name, skills.curr_xp, skills.curr_lvl, skills.max_lvl, battles.description, battles.xp, skills.ID AS skill_ID, battles.ID AS battle_ID
              FROM skills
              LEFT JOIN battles ON skills.ID = battles.skill_ID
              WHERE skills.user_ID = ${req.session.passport.user}`;

  db.query(sql, (err, result) => {
    if(err) throw err;
    if(result.length == 0){
      res.redirect('/skills/new');
    } else{
      res.render('edit', {result: result, page: 'profile'});
    }
  });
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
    res.redirect('/skills/edit');
  });
};

module.exports = exports;