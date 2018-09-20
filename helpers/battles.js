const db = require('../config/db');

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
  let sql = '';

  // edit existing battle
  if(req.body.id){
    sql = `UPDATE battles
            SET description = '${req.body.battle}', xp = ${req.body.xp}
            WHERE ID = ${req.body.id}`;
  }
  // create new battle
  else{
    sql = `INSERT INTO battles (description, xp, skill_ID)
            VALUES ('${req.body.battle}', ${req.body.xp}, ${req.body.skillID})`;
  }

  db.query(sql, (err) => {
    if(err) throw err;
  });

  res.redirect('/profile/edit');
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
    res.redirect('/profile/edit');
  });
};


exports.updateXP = (req, res) => {
  let skill_ID = req.body.skill;

  let sql = `UPDATE skills
              SET curr_xp = curr_xp + ${req.body.xp}
              WHERE skills.ID = ${skill_ID}`;

  db.query(sql, (err) => {
    if(err) throw err;

    checkLvlUp(skill_ID);
  });

  res.redirect('/battles'); // <=========================================== could this be a potential issue because of async?
};


function checkLvlUp(skill_ID){
  let sql = `SELECT curr_xp, curr_lvl, max_lvl
                FROM skills
                WHERE skills.ID = ${skill_ID}`;

  db.query(sql, (err, result) => {
    if(err) throw err;

    if(result[0].curr_xp > 100){
      let sql = '';

      if(result[0].curr_lvl < result[0].max_lvl){
        sql = `UPDATE skills
                SET curr_xp = ${result[0].curr_xp - 100}, curr_lvl = curr_lvl + 1 
                WHERE skills.ID = ${skill_ID}`;
      } else {
        sql = `UPDATE skills
                SET curr_xp = 100, curr_lvl = max_lvl
                WHERE skills.ID = ${skill_ID}`;
      };

      db.query(sql, (err) => {
        if(err) throw err;
      });
    };  
  });
}

module.exports = exports;