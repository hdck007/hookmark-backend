const { PrismaClient } = require('@prisma/client');
const express = require('express');

const prisma = new PrismaClient();
const router = express.Router();

// add or update rating
router.post('/', async (req, res) => {
  try {
    const { websiteId, ratings, userId } = req.body;
    const ratingToAdd = await prisma.rating.upsert({
      where: {
        websiteId,
        userId,
      },
      update: {
        data: {
          ratings,
        },
      },
      create: {
        data: {
          createdBy: userId,
          ratings,
          website: {
            connect: {
              id: websiteId,
            },
          },
        },
      },
    });
    res.status(201).json(ratingToAdd);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get average rating for a website
router.get('/:websiteId', async (req, res) => {
  try {
    const { websiteId } = req.params;
    const aggregateRating = await prisma.rating.aggregate({
      _avg: {
        ratings: true,
      },
      where: {
        websiteId,
      },
    });
    res.status(200).json(aggregateRating._avg.ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
