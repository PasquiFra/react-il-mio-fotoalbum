// import di prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import dei moduli
const errorHandler = require('../middlewares/errorHandler')

const storeContact = async (req, res) => {

    const { email, message } = req.body

    try {
        const contactData = {
            email,
            message,
        }

        const storeContact = await prisma.contact.create({
            data: {
                ...contactData
            }
        })

        res.status(200).send(storeContact)

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports = { storeContact }