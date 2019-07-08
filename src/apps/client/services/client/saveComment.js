import request from 'superagent';
import base from '../base';

export default function saveComment (productId, comment) {
    return () => {
        return base(
            request
                .post(`/api/client/comment/save`)
                .query({ productId })
                .send(comment)
        );
    };
}
