
const postValidation = {

    title: {
        in: ['body'],
        isString: {
            errorMessage: "Il titolo dev\'essere una stringa",
            bail: true
        },
        notEmpty: {
            errorMessage: "Il titolo non può essere vuoto",
            bail: true
        },
        isLength: {
            errorMessage: "Il titolo deve avere almeno 3 caratteri",
            options: { min: 3 }
        }
    },
    visible: {
        in: ["body"],
        isBoolean: {
            errorMessage: "Il campo published dev'essere un booleano",
        }
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: "Il contenuto dev'essere un testo",
            bail: true
        }
    }
}


module.exports = { postValidation }