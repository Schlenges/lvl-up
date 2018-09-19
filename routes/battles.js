const express = require('express');
      router = express.Router();
      helpers = require('../helpers/battles');

router.route('/')
  .get(helpers.showBattles)                 // Battles Update Overview
  .post(helpers.createBattle)               // Edit/ Create Battles
  .put(helpers.updateXP)                    // Update XP

router.put('/new', helpers.addBattle);      // Add Battle Form

router.route('/:id')
  .get(helpers.editBattle)                  // Edit Battle Form
  .delete(helpers.deleteBattle)             // Delete Battle


module.exports = router;