const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserHooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pageNum, limit } = req.query;
    if (pageNum && limit) {
      const hooks = await prisma.hookmark.findMany({
        where: {
          user: userId,
        },
        skip: (+pageNum - 1) * (+limit),
        take: Number(limit),
      });
      return res.status(200).json(hooks);
    }
    const hooks = await prisma.hookmark.findMany({
      where: {
        user: userId,
      },
      take: 10,
    });
    res.status(200).json(hooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add a hookmark
const addHookMark = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};

const searchHookMark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { query } = req.query;
    const generatedQuery = query.split(' ').map((word) => {
      if (word.length > 3) return { title: { contains: word } };
      return null;
    }).filter((word) => word !== null);
    const hooks = await prisma.hookmark.findMany({
      where: {
        user: userId,
        OR: generatedQuery,
      },
    });
    res.status(200).json(hooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserHooks,
  addHookMark,
  searchHookMark,
};
