const { PrismaClient } = require('@prisma/client');
const express = require('express');

const prisma = new PrismaClient();
const router = express.Router();

// GET highest liked comment
router.get('/highest-liked', async (req, res) => {
  try {
    const highestLikedComment = await prisma.comment.findOne({
      orderBy: {
        likesCount: 'desc',
      },
    });
    res.status(200).json(highestLikedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment
router.post('/', async (req, res) => {
  try {
    const {
      text, websiteId, userId,
    } = req.body;
    const comment = await prisma.comment.create({
      data: {
        data: text,
        likesCount: 0,
        createdBy: userId,
        website: {
          connect: {
            id: websiteId,
          },
        },
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all comments for a website
router.get('/:websiteId', async (req, res) => {
  try {
    const { websiteId } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        websiteId,
      },
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// like a comment
router.post('/:commentId/like', async (req, res) => {
  try {
    const { commentId } = req.params;
    const alreadyLiked = await prisma.like.findOne({
      where: {
        commentId,
        userId: req.body.userId,
      },
    });
    if (alreadyLiked) {
      res.status(200).json({ msg: 'You already liked this comment' });
      return;
    }
    await prisma.like.create({
      data: {
        userId: req.body.userId,
        comment: {
          connect: {
            id: commentId,
          },
        },
      },
    });
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// dislike a comment
router.post('/:commentId/dislike', async (req, res) => {
  try {
    const { commentId } = req.params;
    const isLiked = await prisma.like.findOne({
      where: {
        commentId,
        userId: req.body.userId,
      },
    });
    if (!isLiked) {
      res.status(200).json({ msg: 'You have not liked this comment' });
      return;
    }
    await prisma.like.deleteMany({
      where: {
        commentId,
        userId: req.body.userId,
      },
    });
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
    });
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
