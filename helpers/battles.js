const db = require('../db');

exports.showBattles = (req, res) => {
  let sql = `SELECT skills.name, skills.curr_xp, skills.curr_lvl, skills.max_lvl, battles.description, battles.xp, battles.skill_ID
              FROM skills
              JOIN battles ON skills.ID = battles.skill_ID
              WHERE skills.user_ID = ${req.session.passport.user}`

  db.query(sql, (err, result) => {
    if(err) throw err;

    res.render('battles', {result: result, page: 'battles'});
  });
};

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

exports.updateXP = (req, res) => {
  let skill_ID = req.body.skill;

  let sql = `UPDATE skills
              SET curr_xp = curr_xp + ${req.body.xp}
              WHERE skills.ID = ${skill_ID}`;

  db.query(sql, (err) => {
    if(err) throw err;

    let sql2 = `SELECT curr_xp, curr_lvl, max_lvl
                FROM skills
                WHERE skills.ID = ${skill_ID}`;

    db.query(sql2, (err, result) => {
      if(err) throw err;

      if(result[0].curr_xp > 100){
        if(result[0].curr_lvl < result[0].max_lvl){
          let xp = result[0].curr_xp - 100;
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
};

module.exports = exports;