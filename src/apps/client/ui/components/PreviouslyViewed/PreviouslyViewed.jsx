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
        return <div className={classNames(styles.productPreviouslyViewed, styles.infoContainer)}>
            <div className={styles.bottomHeader}>недавно просматривали</div>
            <div className={styles.previouslyViewed}>
                {this.props.viewed.map((item, i) =>
                    <div key={i} className={styles.previouslyViewedItem}>
                        <div><img className={styles.avatar} src={item.viewedAvatar} alt=''/></div>
                        <div className={styles.itemInfoContainer}>
                            <div className={styles.viewedProductName}>{item.viewedName}</div>
                            <div className={styles.viewedCategoryName}>{item.viewedCompany}</div>
                            <div className={styles.itemPrice}>{item.viewedPrice} UAH</div>
                        </div>
                    </div>)}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PreviouslyViewed);
