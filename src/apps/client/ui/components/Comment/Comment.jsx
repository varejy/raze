import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getStarsArray from '../../../utils/getStarsArray';

import styles from './Comment.css';

class Comment extends Component {
    static propTypes = {
        name: PropTypes.string,
        comment: PropTypes.string,
        rating: PropTypes.number
    };

    static defaultProps = {
        name: '',
        comment: '',
        rating: 0
    };

    render () {
        const { name, comment, rating } = this.props;

        return <section className={styles.commentWrapper}>
            <div className={styles.rating}>
                {getStarsArray(rating).map((star, i) =>
                    <div
                        key={i}
                        className={styles.star}
                    >
                        <img src={star} alt='star'/>
                    </div>
                )}
            </div>
            <div className={styles.infoWrapper}>
                <div className={styles.header}>
                    <div className={styles.title}><div className={styles.name}>{name}</div></div>
                </div>
                <div className={styles.comment}>
                    {comment}
                </div>
            </div>
        </section>;
    }
}

export default Comment;
