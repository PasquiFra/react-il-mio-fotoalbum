const express = require("express");
const router = express.Router();

// moduli per upload photo
const multer = require("multer");
const uploader = multer({ dest: "public/photos" });

// import dei moduli
const { loggedUser } = require("../middlewares/authentication");
const { index, store, show, update, destroy } = require('../controllers/photosController')

// Rotte /photos 
router.get("/", index);

router.use("/", loggedUser)

router.post("/", uploader.single("image"), store);

router.get("/:title", show)
router.put("/:title", uploader.single("image"), update)
router.delete("/:title", destroy)

module.exports = router