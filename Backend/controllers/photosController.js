// import di prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import dei moduli
const errorHandler = require('../middlewares/errorHandler')
const { getUserId } = require("../utils/getUserId");
const { titleSlugger } = require('../utils/titleSlugger')
const { deleteFile } = require('../utils/fileSystem')
const { storeFromPhotos } = require('../controllers/categoriesController')
const path = require("path");

//? azioni delle rotte

const index = async (req, res) => {

    const { category, searchTerm, orderBy = 'desc' } = req.query
    try {
        if (req.query && category) {

            // setup paginazione
            // prelevo gli elementi dalla req
            let { page = 1, limit = 3 } = req.query;

            // se viene richiesta una pagina = 0 o negativa restituisco la prima pagina
            if (page <= 0) {
                page = 1
            }

            //calcolo dell'offset (numero di elementi da saltare)
            const offset = (page - 1) * limit;
            // determino il totale delle foto e delle pagine
            const totalPhotos = await prisma.photo.count()
            const totalPages = Math.ceil(totalPhotos / limit)

            // se la pagina non esiste restituisco un errore
            if (page > totalPages) {
                throw new Error('La pagina richiesta non esiste.', 400)
            }

            const photos = await prisma.photo.findMany({
                orderBy: [
                    {
                        createdAt: orderBy
                    }
                ],
                where: {
                    visible: true,
                    category: {
                        some: {
                            name: category
                        }
                    }
                },
                take: parseInt(limit),
                skip: parseInt(offset),
                include: {
                    category: {
                        select: { name: true }
                    }
                }
            })
            return res.status(200).json({
                data: photos,
                page: page,
                totalPhotos,
                totalPages
            })
        } else if (req.query && searchTerm) {

            // setup paginazione
            // prelevo gli elementi dalla req
            let { page = 1, limit = 3 } = req.query;

            // se viene richiesta una pagina = 0 o negativa restituisco la prima pagina
            if (page <= 0) {
                page = 1
            }

            //calcolo dell'offset (numero di elementi da saltare)
            const offset = (page - 1) * limit;
            // determino il totale delle foto e delle pagine
            const totalPhotos = await prisma.photo.count()
            const totalPages = Math.ceil(totalPhotos / limit)

            // se la pagina non esiste restituisco un errore
            if (page > totalPages) {
                throw new Error('La pagina richiesta non esiste.', 400)
            }

            const photos = await prisma.photo.findMany({
                orderBy: [
                    {
                        createdAt: orderBy
                    }
                ],
                where: {
                    visible: true,
                    OR: [
                        {
                            title: {
                                contains: searchTerm
                            }
                        },
                        {
                            description: {
                                contains: searchTerm
                            }
                        }
                    ]
                },
                take: parseInt(limit),
                skip: parseInt(offset),
                include: {
                    category: {
                        select: { name: true }
                    }
                }
            })
            return res.status(200).json({
                data: photos,
                page: page,
                totalPhotos,
                totalPages
            })

        } else {

            // setup paginazione
            // prelevo gli elementi dalla req
            let { page = 1, limit = 3 } = req.query;

            // se viene richiesta una pagina = 0 o negativa restituisco la prima pagina
            if (page <= 0) {
                page = 1
            }

            //calcolo dell'offset (numero di elementi da saltare)
            const offset = (page - 1) * limit;
            // determino il totale delle foto e delle pagine
            const totalPhotos = await prisma.photo.count()
            const totalPages = Math.ceil(totalPhotos / limit)

            // se la pagina non esiste restituisco un errore
            if (page > totalPages) {
                throw new Error('La pagina richiesta non esiste.', 400)
            }

            const photos = await prisma.photo.findMany({
                orderBy: [
                    {
                        createdAt: orderBy
                    }
                ],
                where: {
                    visible: true
                },
                take: parseInt(limit),
                skip: parseInt(offset),
                include: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            return res.status(200).json({
                data: photos,
                page: page,
                totalPhotos,
                totalPages
            })
        }
    } catch (err) {

        errorHandler(err, req, res);
    }
}

const allList = async (req, res) => {
    try {
        // setup paginazione
        // prelevo gli elementi dalla req
        let { page = 1, limit = 9, orderBy = 'desc' } = req.query;

        // se viene richiesta una pagina = 0 o negativa restituisco la prima pagina
        if (page <= 0) {
            page = 1
        }

        //calcolo dell'offset (numero di elementi da saltare)
        const offset = (page - 1) * limit;
        // determino il totale delle foto e delle pagine
        const totalPhotos = await prisma.photo.count()
        const totalPages = Math.ceil(totalPhotos / limit)

        // se la pagina non esiste restituisco un errore
        if (page > totalPages) {
            throw new Error('La pagina richiesta non esiste.', 400)
        }

        const photos = await prisma.photo.findMany({
            orderBy: [
                {
                    createdAt: orderBy
                }
            ],
            take: parseInt(limit),
            skip: parseInt(offset),
            include: {
                category: {
                    select: { name: true }
                }
            }
        })
        return res.status(200).json(
            {
                data: photos,
                page: page,
                totalPhotos,
                totalPages
            }
        )


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

    const title = req.params.title

    try {

        const photo = await prisma.photo.findUnique({
            where: {
                title: title
            },
            include: {
                category: {
                    select: { name: true }
                }
            }
        })

        return res.status(200).json({ data: photo })

    } catch (err) {

        errorHandler(err, req, res);
    }
}

const update = async (req, res) => {

    const title = req.params.title

    try {

        // Cerco la foto da modificare
        const photoToUpdate = (await prisma.photo.findUnique({
            where: { title: title }
        }))

        if (!photoToUpdate) {
            throw new Error("La foto non è stata trovata", 404)
        }

        if (!req.file?.mimetype.includes('image')) {
            req.file?.filename ? deleteFile(req.file.filename, 'photos') : '';
        }


        // validazione dell'utente tramite token. ricavo le info dell'utente dal token 
        // ed estrapolo l'ID verificando con il DB con getUserId(token)
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        const userId = await getUserId(token)
        const photoUserId = photoToUpdate.userId

        // verifico che lo userId della foto corrisponda allo userId dell'utente loggato
        if (userId != photoUserId) {
            throw new Error("Non sei autorizzato a modificare questa foto", 405)
        } else {


            const { title, description, category, visible } = req.body

            const categoryIds = await storeFromPhotos(req, res, category);
            const uniqueTitle = await titleSlugger(title);


            const data = {
                title: uniqueTitle,
                image: req.file && req.file.mimetype.includes('image') ? req.file.filename : photoToUpdate.image,
                description,
                visible: visible == 'true' ? true : false,
                category: {
                    connect: categoryIds.map(catId => ({ id: catId }))
                }
            }

            const updatedPhoto = await prisma.photo.update({
                where: { title: photoToUpdate.title },
                data
            })

            // se l'immagine che ricevo è conforme cancello quella vecchia
            if (req.file && req.file.mimetype.includes('image')) {
                deleteFile(photoToUpdate.image, 'photos');
            }

            res.status(200).json(updatedPhoto)
        }
    } catch (err) {
        if (req.file) {
            deleteFile(req.file.filename, 'photos');
        }
        errorHandler(err, req, res);
    }
}

const destroy = async (req, res) => {

    const title = req.params.title

    try {

        // Cerco la foto da cancellare
        const photoToDelete = (await prisma.photo.findUnique({
            where: { title: title }
        }))

        if (!photoToDelete) {
            throw new Error("La foto non è stata trovata", 404)
        }

        // validazione dell'utente tramite token. ricavo le info dell'utente dal token 
        // ed estrapolo l'ID verificando con il DB con getUserId(token)
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        const userId = await getUserId(token)
        const photoUserId = photoToDelete.userId

        // verifico che lo userId della foto corrisponda allo userId dell'utente loggato
        if (userId != photoUserId) {
            throw new Error("Non sei autorizzato a cancellare questa foto", 405)
        } else {
            deleteFile(photoToDelete.image, 'photos');
            await prisma.photo.delete({
                where: { title: title }
            })
        }

        return res.status(200).send(`Foto con titolo ${photoToDelete.title} eliminata`)

    } catch (err) {
        errorHandler(err, req, res);
    }
}

const sendImage = (req, res) => {
    console.log("arrivato")
    const imageName = req.params.image;
    console.log(imageName)
    const imagePath = path.join(__dirname, '../public', 'photos', imageName);

    // Invia il file immagine al frontend
    res.sendFile(imagePath);

}

module.exports = {
    index, store, show, update, destroy, allList, sendImage
}