import fs from 'fs';
import path from 'path';
import multer from 'multer';

export default function multipart (regex) {
    const destination = 'src/apps/admin/files';
    const destinationPath = path.resolve(__dirname, '..', destination);

    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, `${file.fieldname.match(regex)}${Date.now()}${path.extname(file.originalname)}`);
        }
    });

    return multer({ storage }).any();
}
