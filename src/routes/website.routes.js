const express = require('express');
const { upsertWebsite } = require('../controllers/website.controller');

const router = express.Router();

// get or add websites data and return it
router.post('/', upsertWebsite);

module.exports = router;
