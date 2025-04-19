const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const { addUserToQuestion, getUsers } = require("../controllers/answers");

router.post("/", auth, addUserToQuestion);
router.get("/:id", auth, getUsers);

module.exports = router;
