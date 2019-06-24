import React, { Component } from 'react';

import styles from './Comments.css';

import Comment from '../Comment/Comment';

class Comments extends Component {
    render () {
        return <section className={styles.commentsWrapper}>
            <div className={styles.feedback}>
                <Comment name='Валерий Шандыба' rating='3' comment='Прекрасный нож. Вчера убил соседку. Отмыл мозги за 7 минут. Рекомендую.'/>
            </div>
            <div className={styles.feedback}>
                <Comment name='Василий Буденко' rating='5' comment='Прекрасный нож.'/>
            </div>
        </section>;
    }
}

export default Comments;
