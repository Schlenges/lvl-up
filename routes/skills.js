const express = require('express');
      router = express.Router();
      helpers = require('../helpers/skills');


router.route('/')
  .get(helpers.showSkills) // Skill Overview
  .post(helpers.createSkill); // Edit/ Create Skills

router.get('/new', helpers.skillForm); // Add Skill Form

router.get('/edit', helpers.editOverview); // Edit Overview

router.route('/:id')
  .get(helpers.editSkill) // Edit Skill Form
  .delete(helpers.deleteSkill); // Delete Skills

module.exports = router;