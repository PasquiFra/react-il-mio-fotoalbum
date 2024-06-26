const path = require("path");
const fs = require("fs");


const deleteFile = (fileName, picType) => {
    const folder = () => {
        return picType === 'userPic' ? 'profileImg' : 'photos'
    }
    const filePath = path.join(__dirname, '../public', folder(), fileName);
    console.log(filePath)
    fs.unlinkSync(filePath);
}

module.exports = {
    deleteFile
};