const express = require("express");
const router = express.Router();

// moduli per upload photo
const multer = require("multer");
const uploader = multer({ dest: "public/img" });

// import dei moduli
const { loggedUser } = require("../middlewares/authentication");
const { index, store, show, update, destroy } = require('../controllers/photosController')

// Rotte /photos 
router.get("/", index);

router.use("/", loggedUser)

router.post("/", store);

router.get("/:title", show)
router.put("/:title", update)
router.delete("/:title", destroy)

module.exports = router