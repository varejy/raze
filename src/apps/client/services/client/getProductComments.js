import request from 'superagent';
import base from '../base';

export default function getProductComments (productId) {
    return () => {
        return base(
            request
                .post(`api/client/comment/save`)
                .query({ productId })
        );
    };
}
