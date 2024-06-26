const express = require("express");
const router = express.Router();

// moduli per upload photo
const multer = require("multer");
const uploader = multer({ dest: "public/profileImg" });

// import dei moduli
const { login, register } = require('../controllers/authController')
const validator = require('../middlewares/validator');
const { loginValidation, registerValidation } = require('../validations/userAuth')

// Rotte /auth 
router.post("/login", validator(loginValidation), login);

router.post("/register", uploader.single("image"), validator(registerValidation), register);

module.exports = router