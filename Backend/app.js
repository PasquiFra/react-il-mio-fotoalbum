//modulo express
const express = require('express');
const app = express();

//modulo dotenv
require("dotenv").config();
// modulo cors
const cors = require('cors')
app.use(cors())
// decodificatori
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import dei componenti, middlewares, routers
const routeNotFound = require('./middlewares/routeNotFound');
const errorHandler = require('./middlewares/errorHandler');
const photosRouter = require('./routers/photosRouter');
const categoriesRouter = require('./routers/categoriesRouter');


//! Logica dell'app: rotte, middlewares ecc.

app.get("/", (req, res) => {
    res.send('Home Page');
})

app.use("/photos", photosRouter)
app.use("/categories", categoriesRouter)

// middlewares per errori di rotta/generici
app.use(routeNotFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server avviato alla porta http://localhost:${process.env.PORT}`)
})