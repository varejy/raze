import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import isString from '@tinkoff/utils/is/string';
import isNumber from '@tinkoff/utils/is/number';
import isEmpty from '@tinkoff/utils/is/empty';
import cond from '@tinkoff/utils/function/cond';
import T from '@tinkoff/utils/function/T';
import F from '@tinkoff/utils/function/F';

import saveCommentQuery from '../queries/saveComment';
import getCommentsByProductId from '../queries/getCommentsByProductId';
import editProduct from '../../product/queries/editProduct';

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 200;
const MAX_TEXT_LENGTH = 1200;

const validateComment = cond([
    [({ name }) => !isString(name) || isEmpty(name) || name.length > MAX_NAME_LENGTH, F],
    [({ email }) => !isString(email) || isEmpty(email) || email.length > MAX_EMAIL_LENGTH, F],
    [({ text }) => !isString(text) || isEmpty(text) || text.length > MAX_TEXT_LENGTH, F],
    [({ rating }) => !isNumber(rating) || rating < 1 || rating > 5, F],
    [T, T]
]);

export default function saveComment (req, res) {
    const { productId } = req.query;
    const { name, email, text, rating } = req.body;
    const comment = {
        id: uniqid(),
        productId,
        verified: false,
        date: Date.now(),
        name,
        email,
        text,
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
                            return res.status(OKEY_STATUS_CODE).end();
                        });
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
