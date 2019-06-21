import React, { Component } from 'react';
import styles from './PreviouslyViewed.css';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = ({ savedProducts }) => {
    return {
        viewed: savedProducts.viewed
    };
};

class PreviouslyViewed extends Component {
    static propTypes = {
        viewed: PropTypes.array
    };

    static defaultProps = {
        viewed: []
    };

    render () {
        const { viewed } = this.props;

        return <div className={classNames(styles.productPreviouslyViewed, styles.infoContainer)}>
            <div className={styles.bottomHeader}>недавно просматривали</div>
            <div className={styles.previouslyViewed}>
                {viewed.map((item, i) =>
                    <div key={i} className={styles.previouslyViewedItem}>
                        <div><img className={styles.avatar} src={item.avatar} alt=''/></div>
                        <div className={styles.itemInfoContainer}>
                            <div className={styles.viewedProductName}>{item.name}</div>
                            <div className={styles.viewedCategoryName}>{item.company}</div>
                            <div className={styles.itemPrice}>{item.price} UAH</div>
                        </div>
                    </div>)}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PreviouslyViewed);
