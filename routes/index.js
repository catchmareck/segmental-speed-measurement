'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });

const root = require('./main');

router.use('/', root);

module.exports = router;
