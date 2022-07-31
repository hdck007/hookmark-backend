const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getHighestLikedComment = async (req, res) => {
  try {
    let { websiteId } = req.params;
    websiteId = +websiteId;
    const highestLikedComment = await prisma.comment.findMany({
      where: {
        websiteId,
      },
      orderBy: {
        likesCount: 'desc',
      },
    });
    res.status(200).json(highestLikedComment[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addComment = async (req, res) => {
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
};

const getAllComments = async (req, res) => {
  try {
    const { userId } = req.body;
    const { websiteId } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        websiteId: +websiteId,
      },
      orderBy: {
        likesCount: 'desc',
      },
    });
    for (let i = 0; i < comments.length; i++) {
      const isLiked = await prisma.like.findFirst({
        where: {
          user: userId,
          commentId: comments[i].id,
        },
      });
      if (isLiked) {
        comments[i].isLiked = true;
      } else {
        comments[i].isLiked = false;
      }
    }
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeComment = async (req, res) => {
  try {
    let { commentId } = req.params;
    commentId = +commentId;
    const alreadyLiked = await prisma.like.findFirst({
      where: {
        commentId,
        user: req.body.userId,
      },
    });
    if (alreadyLiked) {
      res.status(200).json({ msg: 'You already liked this comment' });
      return;
    }
    await prisma.like.create({
      data: {
        user: req.body.userId,
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
};

const dislikeComment = async (req, res) => {
  try {
    let { commentId } = req.params;
    commentId = +commentId;
    const isLiked = await prisma.like.findFirst({
      where: {
        commentId,
        user: req.body.userId,
      },
    });
    if (!isLiked) {
      res.status(200).json({ msg: 'You have not liked this comment' });
      return;
    }
    await prisma.like.deleteMany({
      where: {
        commentId,
        user: req.body.userId,
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
};

module.exports = {
  getHighestLikedComment,
  addComment,
  getAllComments,
  likeComment,
  dislikeComment,
};
