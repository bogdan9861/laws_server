const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { register, login, current, getAll } = require("../controllers/users");

router.post("/register", register);
router.post("/login", login);
router.get("/", auth, current);
router.get("/all", auth, getAll);

module.exports = router;
