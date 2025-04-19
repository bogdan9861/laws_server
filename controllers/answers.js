const { prisma } = require("../prisma/prisma.client");

const addUserToQuestion = async (req, res) => {
  try {
    const { questionId, isValid } = req.body;

    const relation = await prisma.questionToUser.create({
      data: {
        userId: req.user.id,
        questionId: +questionId,
        validAnswer: isValid,
      },
      include: {
        question: {
          include: {
            QuestionToUser: false,
          },
        },
        user: {
          include: {
            QuestionToUser: false,
          },
        },
      },
    });

    const users = await prisma.user.findMany();

    const passedUsers = await prisma.questionToUser.findMany({
      where: {
        questionId: +questionId,
        validAnswer: true,
      },
      include: {
        user: {
          include: {
            QuestionToUser: false,
          },
        },
      },
    });

    const failedUsers = await prisma.questionToUser.findMany({
      where: {
        questionId: +questionId,
        validAnswer: false,
      },
      include: {
        user: {
          include: {
            QuestionToUser: false,
          },
        },
      },
    });

    const question = await prisma.question.update({
      where: {
        id: +questionId,
      },
      data: {
        passedPercent: (passedUsers.length / users.length) * 100,
        failedPercent: (failedUsers.length / users.length) * 100,
      },
    });

    res.status(201).json(relation);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const passedUsers = await prisma.questionToUser.findMany({
      where: {
        questionId: +id,
        validAnswer: true,
      },
      include: {
        user: {
          include: {
            QuestionToUser: false,
          },
        },
      },
    });

    const failedUsers = await prisma.questionToUser.findMany({
      where: {
        questionId: +id,
        validAnswer: false,
      },
      include: {
        user: {
          include: {
            QuestionToUser: false,
          },
        },
      },
    });

    res.status(200).json([...failedUsers, ...passedUsers]);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = { addUserToQuestion, getUsers };
