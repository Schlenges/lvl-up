const express = require('express');
      router = express.Router();
      helpers = require('../helpers/battles');


router.route('/').post(helpers.createBattle); // Edit/ Create Battles

router.route('/new').put(helpers.addBattle); // Add Battle Form

router.route('/:id')
  .get(helpers.editBattle) // Edit Battle Form
  .delete(helpers.deleteBattle) // Delete Battles


module.exports = router;