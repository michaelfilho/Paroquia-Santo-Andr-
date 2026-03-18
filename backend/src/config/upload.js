const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg\+xml/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test((file.mimetype || '').toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(new Error('Apenas imagens são permitidas!'));
    }
});

module.exports = upload;
