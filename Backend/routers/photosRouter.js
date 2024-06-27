const express = require("express");
const router = express.Router();

// moduli per upload photo
const multer = require("multer");
const uploader = multer({ dest: "public/photos" });

// import dei moduli
const { loggedUser } = require("../middlewares/authentication");
const { index, allList, store, show, update, destroy, sendImage } = require('../controllers/photosController')
const validator = require('../middlewares/validator');
const { postValidation } = require('../validations/postValidator')

// Rotte /photos 
router.get("/", index);
router.get("/:image", sendImage);

router.use("/", loggedUser)
router.get("/all-list", allList);

router.post("/", uploader.single("image"), validator(postValidation), store);

router.get("/:title", show)
router.put("/:title", uploader.single("image"), validator(postValidation), update)
router.delete("/:title", destroy)

module.exports = router