const express = require('express');
      router = express.Router();
      helpers = require('../helpers/battles');


router.post('/', helpers.createBattle); // Edit/ Create Battles

router.put('/new', helpers.addBattle); // Add Battle Form

router.route('/:id')
  .get(helpers.editBattle) // Edit Battle Form
  .delete(helpers.deleteBattle) // Delete Battles


module.exports = router;