import request from 'superagent';
import base from '../base';

export default function saveEmail ([id, email]) {
    return () => {
        return base(
            request
                .post(`/api/client/product/saveEmail`)
                .query({ id })
                .send({ email })
        );
    };
}
