import path from 'path';

export default function wwwRedirect (req, res, next) {
    if (req.originalUrl.match(/^\/.well-known\/pki-validation\/7907C0F90AE6F0BD3F1C24AA464E3553.txt/)) {
        return res.sendFile(path.resolve(__dirname, '..', 'verification', 'https.txt'));
    }

    next();
};
