const db = require('../config/db');

module.exports = (req, res) => {
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