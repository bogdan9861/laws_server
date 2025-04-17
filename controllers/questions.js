const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { title, text, document_number, answers, description } = req.body;

    if (!title || !text || !document_number || !answers.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const question = await prisma.question.create({
      data: {
        title,
        text,
        document_number,
        description: description || "",
        answers: {
          create: answers.map((answer) => ({
            text: answer.text,
            isValid: answer.isValid,
          })),
        },
      },
      include: {
        answers: {
          include: {
            Question: false,
          },
        },
      },
    });

    res.status(201).json(question);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, document_number } = req.body;

    const question = await prisma.question.findFirst({
      where: {
        id: +id,
      },
      include: {
        answers: {
          include: {
            Question: false,
          },
        },
      },
    });

    if (!question) {
      res.status(404).json({ message: "Question not found" });
    }

    const updatedQuestion = await prisma.question.update({
      where: {
        id: +id,
      },
      data: {
        title: title || question.title,
        text: text || question.text,
        document_number: document_number || question.document_number,
      },
      include: {
        answers: {
          include: {
            Question: false,
          },
        },
      },
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findFirst({
      where: {
        id: +id,
      },
    });

    if (!question) {
      return res.status(404).json({ message: "Question already deleted" });
    }

    const deltedQuestion = await prisma.question.delete({
      where: {
        id: +id,
      },
    });

    res.status(204).json(deltedQuestion);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const number = req.query.number;

    const where = {};

    if (number) {
      where.document_number = {
        contains: number,
      };
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        answers: {
          include: {
            Question: true,
          },
        },
      },
    });

    res.status(200).json(questions);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Can not get id" });
    }

    const question = await prisma.question.findFirst({
      where: { id: +id },
      include: {
        answers: {
          include: {
            Question: true,
          },
        },
      },
    });

    res.status(200).json(question);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  getAll,
  create,
  edit,
  remove,
  getById,
};
