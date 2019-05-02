import request from 'superagent';
import base from './base';

export default function changeCredentials (credentials) {
    return () => base(
        request
            .post('/api/admin/authentication/change')
            .send(credentials)
    );
}
