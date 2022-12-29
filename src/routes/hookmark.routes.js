const express = require('express');
const { getUserHooks, addHookMark, searchHookMark } = require('../controllers/hookmark.controller');

const router = express.Router();

// get hooks for a user
router.get('/:userId', getUserHooks);

// search hooks for a user
router.get('/:userId/search', searchHookMark);

// add a hookmark
router.post('/add', addHookMark);

module.exports = router;
