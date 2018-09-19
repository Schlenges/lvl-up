const express = require('express');
      router = express.Router();
      editOverview = require('../helpers/profile');


router.get('/', (req, res) => res.render('profile', {page: 'profile'}));

router.get('/edit', editOverview);           // Edit Overview

module.exports = router;