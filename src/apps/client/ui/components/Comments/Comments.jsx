import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Comments.css';

import Comment from '../Comment/Comment';

class Comments extends Component {
    static propTypes = {
        product: PropTypes.object
    };

    static defaultProps = {
        product: {}
    };

    render () {
        const { product } = this.props;
        return <section className={styles.commentsWrapper}>
            {
                product.comments.length
                    ? product.comments.map((comment, i) => {
                        return (
                            <div key={i} className={styles.feedback}>
                                <Comment name={comment.name} rating={comment.rating} comment={comment.text} />
                            </div>
                        );
                    })
                    : <div className={styles.feedback}>
                        У этого товара еще нет комментариев, будьте первым кто его оставит !
                    </div>
            }
        </section>;
    }
}

export default Comments;
