const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserHooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const hooks = await prisma.hookmark.findMany({
      where: {
        user: userId,
      },
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

module.exports = {
  getUserHooks,
  addHookMark,
};
