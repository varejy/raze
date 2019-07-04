import Comment from '../model';

export default function saveComment (comment) {
    return Comment.create(comment);
}
