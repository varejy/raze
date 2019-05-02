import Admin from './model';

export function getAdminByLogin (login) {
    return Admin.findOne({ login });
}

export function changeCredentials (credentials) {
    return Admin.findOneAndUpdate({ id: credentials.id }, credentials, { new: true });
}

export function addAdmin (credential) {
    return Admin.create(credential);
}
