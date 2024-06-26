const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const errorHandler = require('../middlewares/errorHandler');

const titleSlugger = async (titleToSlug) => {
    try {

        // ottengo un'array di oggetti {title:titolo}
        const photoTitles = await prisma.photo.findMany({
            select: {
                title: true
            }
        });
        // creo un array di titoli ["titolo"]
        const titlesToCheck = photoTitles.map(pt => pt.title)

        const basetitle = titleToSlug.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase()

        if (!basetitle) {
            const err = new Error('Il titolo non è corretto o non contiene un numero minimo di caratteri');
            err.status = 401;
            return errorHandler(err, req, res);
        }

        let counter = 1;
        let title = basetitle;

        while (titlesToCheck.includes(title)) {
            title = `${basetitle}-${counter}`;
            counter++
        }

        return title
    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports = { titleSlugger }