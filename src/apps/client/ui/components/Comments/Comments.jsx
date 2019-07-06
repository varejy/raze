import React, { Component } from 'react';

import styles from './Comments.css';

import Comment from '../Comment/Comment';

const COMMENTS = [
    {
        name: 'Валерий Шандыба',
        rating: 3,
        comment: 'Прекрасный нож. Вчера убил соседку. Отмыл мозги за 7 минут. Рекомендую.'
    },
    {
        name: 'Василий Буденко',
        rating: 5,
        comment: 'Прекрасный нож. : )'
    }
];

class Comments extends Component {
    render () {
        return <section className={styles.commentsWrapper}>
            {
                COMMENTS.map((comment, i) => {
                    return (
                        <div key={i} className={styles.feedback}>
                            <Comment name={comment.name} rating={comment.rating} comment={comment.comment} />
                        </div>
                    );
                })
            }
        </section>;
    }
}

export default Comments;
