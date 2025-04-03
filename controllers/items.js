const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { name, code } = req.body;
    const file = req.file;

    if (!name || !code || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await prisma.item.findFirst({
      where: {
        inventarization_code: code,
      },
    });

    if (isExist) {
      return res
        .status(400)
        .json({ message: "Item with this inventory code already exists" });
    }

    const item = await prisma.item.create({
      data: {
        name,
        inventarization_code: code,
        photo_url: file.path,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Failed to create item" });
    }

    res.status(201).json({ data: item });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const name = req.query.name;
    const code = req.query.code;

    const where = {};

    if (name) {
      where.name = {
        contains: name,
      };
    }

    if (code) {
      where.inventarization_code = {
        contains: code,
      };
    }

    const items = await prisma.item.findMany({
      where: where,
    });

    res.status(200).json({ data: items });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = await prisma.item.findFirst({
      where: {
        id,
      },
    });

    res.status(200).json({ data: item });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const update = async (req, res) => {
  try {
    const { id, name, code } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({ message: "ID field is required" });
    }

    const item = await prisma.item.findFirst({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatedItem = await prisma.item.update({
      where: {
        id,
      },
      data: {
        name: name || item.name,
        inventarization_code: code || item.inventarization_code,
        photo_url: file?.path || item.photo_url,
      },
    });

    res.status(200).json({ data: updatedItem });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID field is required" });
    }

    const item = await prisma.item.findFirst({
      where: {
        id,
      },
    });

    if (!item) {
      return res.status(400).json({ message: "Item does not exist" });
    }

    const deletedItem = await prisma.item.delete({
      where: {
        id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Failed to delete" });
    }

    res.status(201).json({ data: deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  getAll,
  create,
  getByID,
  update,
  remove,
};
