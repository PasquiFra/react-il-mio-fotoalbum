const express = require("express");
const router = express.Router();

// import dei moduli
const { storeContact } = require('../controllers/contactsController')
const validator = require('../middlewares/validator');
const { contactValidation } = require('../validations/contactValidation')

// Rotte /contacts
router.post("/", validator(contactValidation), storeContact);


module.exports = router