const express = require('express');
      router = express.Router();
      helpers = require('../helpers/skills');


router.route('/')
  .get(helpers.showSkills) // Skill Overview
  .post(helpers.createSkill); // Edit/ Create Skills

router.route('/new').get(helpers.skillForm); // Add Skill Form

router.route('/edit').get(helpers.editOverview); // Edit Overview

router.route('/:id')
  .get(helpers.editSkill) // Edit Skill Form
  .delete(helpers.deleteSkill); // Delete Skills

module.exports = router;