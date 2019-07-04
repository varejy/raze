import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import isString from '@tinkoff/utils/is/string';
import isNumber from '@tinkoff/utils/is/number';
import cond from '@tinkoff/utils/function/cond';
import T from '@tinkoff/utils/function/T';

import saveCommentQuery from '../queries/saveComment';
import getCommentsByProductId from '../queries/getCommentsByProductId';
import editProduct from '../../product/queries/editProduct';

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 200;
const MAX_TEXT_LENGTH = 1200;

const validateComment = cond([
    [({ name }) => isString(name) && name < MAX_NAME_LENGTH, T],
    [({ email }) => isString(email) && email < MAX_EMAIL_LENGTH, T],
    [({ text }) => isString(text) && text < MAX_TEXT_LENGTH, T],
    [({ rating }) => isNumber(rating) && rating > 0 && rating < 6, T]
]);

export default function saveComment (req, res) {
    const { productId } = req.query;
    const { name, email, rating } = req.body;
    const comment = {
        id: uniqid(),
        productId,
        date: Date.now(),
        name,
        email,
        rating
    };
    const isValid = validateComment(comment);

    if (!isValid) {
        return res.status(FORBIDDEN_STATUS_CODE).end();
    }

    saveCommentQuery(comment)
        .then(() => {
            return getCommentsByProductId(productId)
                .then((comments) => {
                    const ratingSum = comments.reduce((sum, comment) => {
                        return sum + comment.rating;
                    }, 0);
                    const averageRating = comments.length ? Math.round(ratingSum / comments.length) : comment.rating;

                    return editProduct({ id: productId, rating: averageRating })
                        .then(() => {
                            const validComments = comments
                                .map(comment => ({
                                    id: comment.id,
                                    name: comment.name,
                                    text: comment.text,
                                    rating: comment.rating
                                }))
                                .sort((prev, next) => next.date - prev.date);
                            return res.status(OKEY_STATUS_CODE).send(validComments);
                        });
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
