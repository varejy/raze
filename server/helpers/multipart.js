import fs from 'fs';
import path from 'path';
import multer from 'multer';

import { FILE_FIELD_NAME_REGEX } from '../constants/constants';

export default function multipart () {
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
            cb(null, `${file.fieldname.match(FILE_FIELD_NAME_REGEX)}${Date.now()}${path.extname(file.originalname)}`);
        }
    });

    return multer({ storage }).any();
}
