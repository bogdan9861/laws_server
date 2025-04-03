const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const { register, login, current } = require("../controllers/users");

router.post("/register", fileMiddleware.single("image"), register);
router.post("/login", fileMiddleware.single("image"), login);
router.get("/", auth, current);

module.exports = router;
