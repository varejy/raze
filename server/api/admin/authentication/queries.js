import Admin from './model';

export function getAdminByLogin (login) {
    return Admin.findOne({ login });
}

export function addAdmin (credential) {
    return Admin.create(credential);
}
