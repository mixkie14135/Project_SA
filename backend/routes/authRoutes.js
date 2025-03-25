const express = require("express");
const { register, login, getUser, updateUsername } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/me", getUser);
router.put("/update-username", updateUsername);  



module.exports = router;
