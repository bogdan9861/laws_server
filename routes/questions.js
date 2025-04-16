const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const {
  getAll,
  create,
  edit,
  remove,
  getById,
} = require("../controllers/questions");

router.get("/", auth, getAll);
router.get("/:id", auth, getById);
router.post("/", auth, admin, create);
router.put("/:id", auth, admin, edit);
router.delete("/:id", auth, admin, remove);

module.exports = router;
