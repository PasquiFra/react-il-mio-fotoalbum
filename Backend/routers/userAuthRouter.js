const express = require("express");
const router = express.Router();

// moduli per upload photo
const multer = require("multer");
const uploader = multer({ dest: "public/profileImg" });

// import dei moduli
const { login, register } = require('../controllers/authController')

// Rotte /auth 
router.post("/login", login);

router.post("/register", uploader.single("image"), register);

module.exports = router