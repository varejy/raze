import Comment from '../model';

export default function getCommentsByProductId (productId) {
    return Comment.find({ productId });
}
