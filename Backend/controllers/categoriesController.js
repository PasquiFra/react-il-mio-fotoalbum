// import di prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import dei moduli
const errorHandler = require('../middlewares/errorHandler')
const { getUserId } = require("../utils/getUserId");

const index = async (req, res) => {

    try {
        const categories = await prisma.category.findMany();
        if (!categories) {
            throw new Error("Nessuna categoria trovata ")
        }
        res.status(200).send(categories)

    } catch (err) {
        errorHandler(err, req, res);
    }
}

const store = async (req, res) => {
    const { name } = req.body
    const data = { name }

    try {

        const categoryExists = await prisma.category.findUnique({
            where: {
                name: data.name
            }
        });
        if (!categoryExists) {
            const createCategory = await prisma.category.create({ name });
            res.status(200).send(createCategory)
        } else {
            throw new Error("Categoria già esistente")
        }

    } catch (err) {
        errorHandler(err, req, res);
    }
}

const storeFromPhotos = async (req, res, categories) => {

    try {
        const categoryIds = [];
        const categoryNames = categories.map(async category => {
            const existingCategory = await prisma.category.findUnique({
                where: {
                    name: category
                }
            });
            if (!existingCategory) {
                const newCategory = await prisma.category.create({ data: { name: category } });
                categoryIds.push(newCategory.id)
            } else {
                categoryIds.push(existingCategory.id)
            }
        });
        await Promise.all(categoryNames);

        return categoryIds
    } catch (err) {
        errorHandler(err, req, res);
    }

}

const show = async (req, res) => {
    const name = req.params.name
    try {
        const category = await prisma.category.findUnique({
            where: { name: name }
        });
        if (!category) {
            throw new Error("Nessuna categoria trovata")
        }
        res.status(200).send(category)

    } catch (err) {
        errorHandler(err, req, res);
    }
}

const destroy = async (req, res) => {
    const name = req.params.name
    try {
        // Cerco la categoria da cancellare
        const categoryToDelete = (await prisma.category.findUnique({
            where: { name: name }
        }))

        if (!categoryToDelete) {
            throw new Error("La categoria non è stata trovata", 404)
        }

        // validazione dell'utente tramite token. ricavo le info dell'utente dal token 
        // ed estrapolo l'ID verificando con il DB con getUserId(token)
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        const userId = await getUserId(token)

        // verifico che lo userId della foto corrisponda allo userId dell'utente loggato
        if (!userId) {
            throw new Error("Non sei autorizzato a cancellare questa categoria", 405)
        } else {
            await prisma.category.delete({
                where: { name: name }
            })
        }

        return res.status(200).send(`Categoria con nome ${categoryToDelete.name} eliminata`)

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports = {
    index, store, show, destroy, storeFromPhotos
}