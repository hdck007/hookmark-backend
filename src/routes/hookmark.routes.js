const { PrismaClient } = require('@prisma/client');
const express = require('express');

const prisma = new PrismaClient();
const router = express.Router();

// get hooks for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tags = await prisma.hookmark.findMany({
      where: {
        user: userId,
      },
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// add a hookmark
router.post('/add', async (req, res) => {
  try {
    const {
      title,
      user,
      attributeName,
      attributeValue,
      baseuri,
    } = req.body;
    const newHookmark = await prisma.hookmark.create({
      data: {
        title,
        user,
        attributeName,
        attributeValue,
        baseuri,
      },
    });
    res.status(201).json(newHookmark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
