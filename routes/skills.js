const express = require('express');
      router = express.Router();
      helpers = require('../helpers/skills');


router.route('/')
  .get(helpers.showSkills)                          // Skills Overview
  .post(helpers.createSkill);                       // Edit/ Create Skill

router.get('/new', helpers.addSkill);               // Add Skill Form

router.route('/:id')
  .get(helpers.editSkill)                           // Edit Skill Form
  .delete(helpers.deleteSkill);                     // Delete Skill
  

module.exports = router;