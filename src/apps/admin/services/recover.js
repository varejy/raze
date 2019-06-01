import request from 'superagent';
import base from './base';

export default function authenticate (email) {
    return () => base(
        request
            .get('/api/admin/authentication/recover')
            .query({ email })
    );
}
