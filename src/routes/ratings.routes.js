const express = require('express');
const { upSertRatings, getAverageRatings, getUserRating } = require('../controllers/ratings.controller');

const router = express.Router();

// add or update rating
router.post('/', upSertRatings);

// get average rating for a website
router.get('/:websiteId', getAverageRatings);

// get my rating for the website
router.post('/my/:websiteId', getUserRating);

module.exports = router;
