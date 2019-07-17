import path from 'path';

export default function wwwRedirect (req, res, next) {
    if (req.originalUrl.match(/^\/.well-known\/pki-validation\/D52112ABFF61F3E3FC4DB57A558077AC.txt/)) {
        return res.sendFile(path.resolve(__dirname, '..', 'verification', 'https.txt'));
    }

    next();
};
