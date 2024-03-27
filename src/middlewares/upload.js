const multer = require("multer");
const path = require("path");
const fs = require("fs");

const memoryStorage = multer.memoryStorage();
const uploadToBucket = multer({ 
    storage: memoryStorage,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        /** create video upload folder */
        const imageDir = `./public/upload`
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        if (['image'].includes(file.fieldname)) {
            cb(null, imageDir);
        }
    },
    filename: function (req, file, cb) {
        if (file) {

            const fileExt = path.extname(file.originalname).toLowerCase();

            if (['.webp', '.jpg', '.png'].includes(fileExt)) {
                cb(null, Date.now() + '_' + String(file.originalname).split(' ').join('_'));
            }

            return file;
        }
    },
});


const upload = multer({
    storage: storage,
    limits: { files: 50, fileSize: 10196090 },
});
module.exports = { upload, uploadToBucket};
