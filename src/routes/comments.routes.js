const express = require('express');
const {
  getHighestLikedComment,
  likeComment,
  dislikeComment,
  getAllComments,
  addComment,
} = require('../controllers/comments.controller');

const router = express.Router();

// GET highest liked comment for a website
router.get('/highest-liked/:websiteId', getHighestLikedComment);

// Add comment
router.post('/', addComment);

// get all comments for a website
router.post('/:websiteId', getAllComments);

// like a comment
router.post('/:commentId/like', likeComment);

// dislike a comment
router.post('/:commentId/dislike', dislikeComment);

module.exports = router;
