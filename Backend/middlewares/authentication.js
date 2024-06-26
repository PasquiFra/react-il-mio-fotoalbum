const jwt = require("jsonwebtoken");
require("dotenv").config();

const errorHandler = require('../middlewares/errorHandler');

const loggedUser = (req, res, next) => {

    //recupero il token dalla chiamata 
    const authToken = req.headers.authorization

    if (!authToken) {
        return res.status(401).send('Accesso non consentito, token mancante')
    };

    // splitto il token (Bearer xxxxxxxxxxx)
    const token = authToken.split(' ')[1];

    //verifico che il token sia valido hashandolo con la mia private key
    //? Il metodo verify mi restituirà il payload del token, contenente i dati codificati nel token al momento della sua creazione.
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            err.message == "jwt expired" ? err.message = "token scaduto" : err.message = "Autenticazione fallita, effettua il login"
            err.status = 401;
            return errorHandler(err, req, res, next)
        }
        //se l'user che ricevo nella decodifica corrisponde lo assegno nella request
        req.user = payload

        next()
    });
}

module.exports = { loggedUser }