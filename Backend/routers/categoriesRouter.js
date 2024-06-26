const express = require("express");
const router = express.Router();

// import dei moduli
const { loggedUser } = require("../middlewares/authentication");
const { index, store, show, update, destroy } = require('../controllers/categoriesController')

// Rotte /categories 
router.get("/", index);

router.use("/", loggedUser)

router.post("/", store);

router.get("/:name", show)
router.delete("/:name", destroy)

module.exports = router