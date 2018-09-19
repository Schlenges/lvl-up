const express = require('express');
      router = express.Router();
      helpers = require('../helpers/update');

router.route('/')
  .get(helpers.battlesUpdates) // Battle Updates Overview
  .put(helpers.xpUpdates); // Updating XP/LVL

module.exports = router;