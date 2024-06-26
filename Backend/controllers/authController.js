// import di prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import dei moduli
const errorHandler = require('../middlewares/errorHandler')
const { deleteFile } = require('../utils/fileSystem')
const { hashedPassword } = require('../utils/password')
const { comparePassword, generateToken } = require('../utils/token')

const login = async (req, res) => {
    try {

        const { email, password } = req.body

        const userLogin = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!userLogin) {
            throw new Error("email o password non corretta", 400)
        }

        const isPasswordCorrect = await comparePassword(password, userLogin.password)

        if (!isPasswordCorrect) {
            throw new Error("email o password non corretta", 400)
        }

        //Se il login va a buon fine restituisco un token all'utente
        const token = generateToken({
            email: userLogin.email,
            username: userLogin.username
        });

        // rimuovo id e password dalla risposta da inviare al frontend
        delete userLogin.id;
        delete userLogin.password;

        res.json({ token, data: userLogin });

    } catch (err) {
        errorHandler(err, req, res);
    }
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // se il tipo di file non è "image" lo cancello
        if (!req.file.mimetype.includes('image')) {
            req.file?.filename && deleteFile(req.file.filename, 'userPic');
            throw new Error("Image is not an image file.", 400)
        }

        const data = {
            username,
            email,
            image: req.file.filename,
            password: await hashedPassword(password) //genero una password hashata da salvare nel DB
        }

        const user = await prisma.user.create({ data });

        //Se la registrazione va a buon fine do un token di login all'utente
        const token = generateToken({
            email: user.email,
            username: user.username
        });

        // rimuovo id e password dalla risposta da inviare al frontend
        delete user.id;
        delete user.password;

        // restituisco il token di login ed i dati dell'utente
        res.json({ token, data: user });
    } catch (err) {
        if (req.file) {
            deleteFile(req.file.filename, 'userPic');
        }
        errorHandler(err, req, res);
    }
}


module.exports = {
    login, register
}