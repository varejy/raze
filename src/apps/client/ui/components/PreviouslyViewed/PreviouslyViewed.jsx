import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './PreviouslyViewed.css';

import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import find from '@tinkoff/utils/array/find';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories,
        media: application.media
    };
};

class PreviouslyViewed extends Component {
    state = {
        leftPosition: 0,
        containerWidth: 0,
        maxSlides: 0,
        slideSetsAmount: 0
    };

    static propTypes = {
        viewed: PropTypes.array,
        categories: PropTypes.array,
        media: PropTypes.object.isRequired
    };

    static defaultProps = {
        viewed: [],
        categories: [],
        media: {}
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.media !== nextProps.media) {
            const { media } = nextProps;
            const { viewed } = this.props;

            if (media.width < 550) {
                this.setState({ containerWidth: 256, maxSlides: 1, slideSetsAmount: (viewed.length - 1) });
            } else if (media.width < 990) {
                this.setState({ containerWidth: 370, maxSlides: 1, slideSetsAmount: (viewed.length - 1) });
            } else if (media.width < 1310) {
                this.setState({ containerWidth: 740, maxSlides: 2, slideSetsAmount: 2 });
            } else {
                this.setState({ containerWidth: 1110, maxSlides: 3, slideSetsAmount: 1 });
            }
        }
    }

    handleArrowClick = (arrowType) => () => {
        const { containerWidth, leftPosition } = this.state;

        if (arrowType === 'left') {
            this.setState({
                leftPosition: leftPosition - containerWidth
            });
        } else {
            this.setState({
                leftPosition: leftPosition + containerWidth
            });
        }
    };

    getCategoryPath = categoryId => {
        const { categories } = this.props;

        return find(category => category.id === categoryId, categories).path;
    };

    render () {
        const { viewed } = this.props;
        const { leftPosition, containerWidth, maxSlides, slideSetsAmount } = this.state;

        return <div className={classNames(styles.productPreviouslyViewed, styles.infoContainer)}>
            {!!viewed.length && <div className={styles.bottomHeader}>недавно просматривали</div>}
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
                {viewed.length > maxSlides &&
                <div className={styles.buttons}>
                    <button
                        className={classNames(styles.buttonLeft)}
                        onClick={this.state.leftPosition !== 0 ? this.handleArrowClick('left') : undefined}
                    >
                        <div
                            className={this.state.leftPosition === 0 && styles.buttonDisabled ? styles.buttonDisabled : styles.buttonEnabled}/>
                    </button>
                    <button
                        className={classNames(styles.buttonRight)}
                        onClick={this.state.leftPosition !== containerWidth * slideSetsAmount
                            ? this.handleArrowClick('right')
                            : undefined }
                    >
                        <div
                            className={this.state.leftPosition === containerWidth * slideSetsAmount
                                ? styles.buttonDisabled
                                : styles.buttonEnabled }/>
                    </button>
                </div>}
            </div>
        </div>;
    }
}

export default withRouter(connect(mapStateToProps, null)(PreviouslyViewed));
