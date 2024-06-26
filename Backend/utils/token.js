// import dei moduli
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// funzione per generazione token
const generateToken = (payload, expiresIn = '2h') => {
    return token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn })
}

// funzione di check della password
const comparePassword = async (passwordToCheck, hashedPassword) => {
    const passwordCheck = await bcrypt.compare(passwordToCheck + process.env.PEPPER_KEY, hashedPassword)
    return passwordCheck
}

module.exports = { generateToken, comparePassword }