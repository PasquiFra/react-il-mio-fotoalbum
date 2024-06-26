// import di prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import dei moduli
const errorHandler = require('../middlewares/errorHandler')
const { getUserId } = require("../utils/getUserId");
const { titleSlugger } = require('../utils/titleSlugger')
const { deleteFile } = require('../utils/fileSystem')
const { storeFromPhotos } = require('../controllers/categoriesController')

//? azioni delle rotte

const index = async (req, res) => {

    try {

        const photos = await prisma.photo.findMany({
            where: {
                visible: true
            },
            include: {
                category: {
                    select: { name: true }
                }
            }
        })
        console.log(photos)
        return res.status(200).json({ data: photos })

    } catch (err) {

        errorHandler(err, req, res);
    }
}

const store = async (req, res) => {

    const { title, description, visible, category } = req.body

    try {

        // validazione dell'utente tramite token. ricavo le info dell'utente dal token 
        // ed estrapolo l'ID verificando con il DB con getUserId(token)
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        const userId = await getUserId(token)

        // Se il file non è un'immagine lo elimino
        if (!req.file.mimetype.includes('image')) {
            deleteFile(req.file.filename, 'photos');
            throw new Error("Image is not an image file.", 400)
        }

        const uniqueTitle = await titleSlugger(title);
        const categoryIds = await storeFromPhotos(req, res, category);

        const photoData = {
            title: uniqueTitle,
            description,
            visible: visible == 'true' ? true : false,
            image: req.file.filename,
            userId
        }

        const createPhoto = await prisma.photo.create({
            data: {
                ...photoData,
                category: {
                    connect: categoryIds.map(catId => ({ id: catId }))
                }
            }
        })

        res.status(200).send(createPhoto)

    } catch (err) {
        if (req.file) {
            deleteFile(req.file.filename, 'photos');
        }
        errorHandler(err, req, res);
    }
}

const show = async (req, res) => {

}

const update = async (req, res) => {

}

const destroy = async (req, res) => {

}

module.exports = {
    index, store, show, update, destroy
}