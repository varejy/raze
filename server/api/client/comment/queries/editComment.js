import Comment from '../model';

export default function editComment (comment) {
    return Comment.findOneAndUpdate({ id: comment.id }, comment, { new: true });
}
