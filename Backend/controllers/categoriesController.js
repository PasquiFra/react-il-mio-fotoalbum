// import di prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import dei moduli
const errorHandler = require('../middlewares/errorHandler')


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

}

const update = async (req, res) => {

}

const destroy = async (req, res) => {

}

module.exports = {
    index, store, show, update, destroy, storeFromPhotos
}