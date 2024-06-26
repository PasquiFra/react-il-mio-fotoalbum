const { checkSchema, validationResult } = require("express-validator");
const { deleteFile } = require('../utils/fileSystem')

module.exports = (schema) => {
    return [
        checkSchema(schema),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                if (req.file) {
                    deleteFile(req.file.filename, 'userPic');
                }
                return res.status(400).json({ errors: errors.array() })
            }
            next();
        }
    ]
}