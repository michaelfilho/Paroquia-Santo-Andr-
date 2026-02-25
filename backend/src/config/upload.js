const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = req.params.folder || 'geral';
        // O backend original servia do React (/Styles/img) mas como 
        // precisaremos que o express também as sirva em rotas absolutas da DB, 
        // garantiremos que exista a pasta dinamicamente.
        const uploadDir = path.join(__dirname, '../../../Styles/img', folder);

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
