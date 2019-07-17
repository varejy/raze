import Comment from '../model';

export default function deleteByIds (ids) {
    return Comment.deleteMany({ id: { $in: ids } });
}
