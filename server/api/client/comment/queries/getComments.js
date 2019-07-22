import Comment from '../model';

export default function getComments () {
    return Comment.find({});
}
