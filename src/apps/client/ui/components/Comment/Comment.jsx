import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getStarsArray from '../../../utils/getStarsArray';

import styles from './Comment.css';

const STAR = {
    full: '/src/apps/client/ui/pages/ProductPage/images/starFull.png',
    empty: '/src/apps/client/ui/pages/ProductPage/images/starEmpty.png'
};

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

    renderStars = () => getStarsArray(STAR, this.props.rating);

    render () {
        const { name, comment } = this.props;

        return <section className={styles.commentWrapper}>
            <div className={styles.rating}>
                {this.renderStars().map((star, i) =>
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
                    <div className={styles.title}><div className={styles.name}>{name}</div> написал</div>
                </div>
                <div className={styles.comment}>
                    {comment}
                </div>
            </div>
        </section>;
    }
}

export default Comment;
