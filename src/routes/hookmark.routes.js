const express = require('express');
const { getUserHooks, addHookMark } = require('../controllers/hookmark.controller');

const router = express.Router();

// get hooks for a user
router.get('/:userId', getUserHooks);

// add a hookmark
router.post('/add', addHookMark);

module.exports = router;
