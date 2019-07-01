import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './PreviouslyViewed.css';

import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import find from '@tinkoff/utils/array/find';

const PREVIEW_WIDTH = 1110;
const MAX_SLIDES = 3;

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

class PreviouslyViewed extends Component {
    state = {
        leftPosition: 0
    };

    static propTypes = {
        viewed: PropTypes.array,
        categories: PropTypes.array
    };

    static defaultProps = {
        viewed: [],
        categories: []
    };

    handleArrowClick = (arrowType) => () => {
        if (arrowType === 'left') {
            this.setState({
                leftPosition: this.state.leftPosition - PREVIEW_WIDTH
            });
        } else {
            this.setState({
                leftPosition: this.state.leftPosition + PREVIEW_WIDTH
            });
        }
    };

    getCategoryPath = categoryId => {
        const { categories } = this.props;

        return find(category => category.id === categoryId, categories).path;
    }

    render () {
        const { viewed } = this.props;
        const { leftPosition } = this.state;

        return <div className={classNames(styles.productPreviouslyViewed, styles.infoContainer)}>
            <div className={styles.bottomHeader}>недавно просматривали</div>
            <div className={styles.sliderContainer}>
                <div className={styles.previouslyViewed}>
                    <div className={styles.slides} style={{ left: `-${leftPosition.toString()}px` }}>
                        {viewed.map((product, i) =>
                            <Link className={styles.link} key={product.id} to={`/${this.getCategoryPath(product.categoryId)}/${product.id}`}>
                                <div className={styles.sliderItem} key={i}>
                                    <div className={styles.previouslyViewedItem}>
                                        <div><img className={styles.avatar} src={product.avatar} alt={`${product.name} photo`} />
                                        </div>
                                        <div className={styles.itemInfoContainer}>
                                            <div className={styles.viewedProductName}>{product.name}</div>
                                            <div className={styles.viewedCategoryName}>{product.company}</div>
                                            <div className={styles.itemPrice}>{product.price} UAH</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
                {viewed.length > MAX_SLIDES &&
                <div className={styles.buttons}>
                    <button
                        className={classNames(styles.buttonLeft)}
                        onClick={this.state.leftPosition !== 0 && this.handleArrowClick('left')}
                    >
                        <div
                            className={this.state.leftPosition === 0 && styles.buttonDisabled ? styles.buttonDisabled : styles.buttonEnabled}/>
                    </button>
                    <button
                        className={classNames(styles.buttonRight)}
                        onClick={this.state.leftPosition !== PREVIEW_WIDTH * (1) && this.handleArrowClick('right')}
                    >
                        <div
                            className={this.state.leftPosition === (PREVIEW_WIDTH * (1)) ? styles.buttonDisabled : styles.buttonEnabled}/>
                    </button>
                </div>}
            </div>
        </div>;
    }
}

export default withRouter(connect(mapStateToProps, null)(PreviouslyViewed));
