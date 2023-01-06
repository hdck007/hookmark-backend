const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get or add websites data and return it
const upsertWebsite = async (req, res) => {
  try {
    const { websites } = req.body;
    const toBeReturnedData = [];
    for (let i = 0; i < websites.length; i++) {
      const alreadyExists = await prisma.webSite.findFirst({
        where: {
          url: websites[i].url,
        },
        include: {
          comments: {
            orderBy: {
              likesCount: 'desc',
            },
          },
        },
      });
      if (alreadyExists) {
        const aggregateRating = await prisma.rating.aggregate({
          _avg: {
            ratings: true,
          },
          where: {
            websiteId: alreadyExists.id,
          },
        });
        toBeReturnedData.push({
          ...alreadyExists,
          averageRating: aggregateRating._avg.ratings,
        });
      } else {
        const website = await prisma.webSite.create({
          data: {
            url: websites[i].url,
            key: websites[i].key,
          },
          include: {
            comments: true,
          },
        });
        toBeReturnedData.push({
          ...website,
          averageRating: 0,
        });
      }
    }
    res.status(200).json(toBeReturnedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { upsertWebsite };
