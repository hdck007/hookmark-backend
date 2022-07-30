const { PrismaClient } = require('@prisma/client');
const express = require('express');

const prisma = new PrismaClient();
const router = express.Router();

// add or update rating
router.post('/', async (req, res) => {
  try {
    const { websiteId, ratings, userId } = req.body;
    let ratingToAdd = null;
    const alreadyExists = await prisma.rating.findFirst({
      where: {
        websiteId,
        createdBy: userId,
      },
    });
    if (alreadyExists) {
      ratingToAdd = await prisma.rating.update({
        where: {
          id: alreadyExists.id,
        },
        data: {
          ratings,
        },
      });
    } else {
      ratingToAdd = await prisma.rating.create({
        data: {
          ratings,
          createdBy: userId,
          website: {
            connect: {
              id: websiteId,
            },
          },
        },
      });
    }
    res.status(201).json(ratingToAdd);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// get average rating for a website
router.get('/:websiteId', async (req, res) => {
  try {
    let { websiteId } = req.params;
    websiteId = +websiteId;
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

// get my rating for the website
router.post('/my/:websiteId', async (req, res) => {
  try {
    const { userId } = req.body;
    let { websiteId } = req.params;
    websiteId = +websiteId;
    const rating = await prisma.rating.findFirst({
      where: {
        websiteId,
        createdBy: userId,
      },
    });
    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
