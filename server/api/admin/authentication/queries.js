import Admin from './model';

import nodemailer from 'nodemailer';

const LOGIN = process.env.LOGIN || 'dev.occam@gmail.com';
const PASS = process.env.PASS || 'R4*KCCe-r*<5bEsQ';
const SENDER = process.env.SENDER || 'Dev minion';

export function getAdminByLogin (login) {
    return Admin.findOne({ login });
}
export function getAdminByEmail (email) {
    return Admin.findOne({ email });
}

export function changeCredentials (credentials) {
    return Admin.findOneAndUpdate({ id: credentials.id }, credentials, { new: true });
}

export function addAdmin (credential) {
    return Admin.create(credential);
}

export function sendRecoveryEmail (email, subject, content, successCallback, failureCallback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: LOGIN,
            pass: PASS
        }
    });
    const mailOptions = {
        from: SENDER,
        to: email,
        subject,
        html: content
    };

    return transporter.sendMail(mailOptions, error => {
        if (error) {
            return failureCallback();
        }

        return successCallback();
    });
}
