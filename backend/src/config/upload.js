const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const resolveUploadBaseDir = () => (
    process.env.UPLOAD_DIR
        ? path.resolve(process.env.UPLOAD_DIR)
        : path.join(__dirname, '../../../Styles/img')
);

const toSafeFolder = (folder) => {
    const normalized = String(folder || 'geral').trim().replace(/[^a-zA-Z0-9_-]/g, '');
    return normalized || 'geral';
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = toSafeFolder(req.params.folder);
        const uploadDir = path.join(resolveUploadBaseDir(), folder);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});

const upload = multer({ storage });
module.exports = upload;
