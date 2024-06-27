
const contactValidation = {

    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: "L'email non può essere vuota",
            bail: true
        },
        isEmail: {
            errorMessage: "L'email deve avere un formato valido",
            bail: true
        }
    },
    message: {
        in: ["body"],
        isString: {
            errorMessage: "Il contenuto dev'essere un testo",
            bail: true
        }
    }
}


module.exports = { contactValidation } 