import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './PreviouslyViewed.css';

import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import find from '@tinkoff/utils/array/find';
import Draggable from '../Draggable/Draggable';

const PROCESS_SWIPE_STATUS = 'process';
const END_SWIPE_STATUS = 'end';
const IGNORE_SWIPE_DISTANCE = 50;
const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories,
        mediaWidth: application.media.width
    };
};

class PreviouslyViewed extends Component {
    state = {
        containerWidth: 0,
        maxSlides: 0,
        slideSetsAmount: 0,
        sliderLeft: 0,
        activeSlide: 0
    };

    static propTypes = {
        viewed: PropTypes.array,
        categories: PropTypes.array,
        mediaWidth: PropTypes.number.isRequired
    };

    static defaultProps = {
        viewed: [],
        categories: []
    };

    maxSlide = this.state.slideSetsAmount;
    maxLeft = this.maxSlide * this.state.containerWidth;

    componentDidMount () {
        this.setSlides(this.props)();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.viewed !== this.props.viewed || nextProps.mediaWidth !== this.props.mediaWidth) {
            const { activeSlide, containerWidth } = this.state;

            this.setSlides(nextProps)();

            this.maxLeft = this.maxSlide * containerWidth;
            this.setState({
                sliderLeft: activeSlide * containerWidth
            });
        }
    }

    setSlides = (props) => () => {
        const { viewed } = props;
        const { mediaWidth } = props;
        const smallSizeSlideSets = viewed.length - 1;
        const mediumSizeSlideSets = viewed.length > 2 ? 1 : 0;
        const bigSizeSlideSets = viewed.length > 4 ? 1 : 0;

        if (mediaWidth < 550) {
            this.setState({ containerWidth: 256, maxSlides: 1, slideSetsAmount: smallSizeSlideSets });
        } else if (mediaWidth < 990) {
            this.setState({ containerWidth: 370, maxSlides: 1, slideSetsAmount: smallSizeSlideSets });
        } else if (mediaWidth < 1310) {
            this.setState({ containerWidth: 740, maxSlides: 2, slideSetsAmount: viewed.length > 4 ? 2 : mediumSizeSlideSets });
        } else {
            this.setState({ containerWidth: 1110, maxSlides: 3, slideSetsAmount: bigSizeSlideSets });
        }
    };

    getTransitionStyles = () => {
        switch (this.swipeStatus) {
        case PROCESS_SWIPE_STATUS:
            return { transition: 'none' };
        case END_SWIPE_STATUS:
            return { transition: 'left .3s' };
        default:
            return { transition: 'left .5s' };
        }
    };

    handleDragStart = () => {
        this.startLeft = this.state.sliderLeft;
        this.swipeStatus = PROCESS_SWIPE_STATUS;
    };

    handleDragProcess = ({ delta: { client: { x: deltaX } } }) => {
        const nextSliderLeft = this.startLeft - deltaX;

        if (nextSliderLeft < 0 || nextSliderLeft > this.maxLeft) {
            return;
        }

        this.setState({
            sliderLeft: this.startLeft - deltaX
        });
    };

    handleDragEnd = ({ delta: { client: { x: deltaX } } }) => {
        const { activeSlide, containerWidth, slideSetsAmount } = this.state;
        const newActiveSlideIndex = deltaX > 0 ? activeSlide - 1 : activeSlide + 1;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE || newActiveSlideIndex === -1 || newActiveSlideIndex === (slideSetsAmount + 1)) {
            return this.setState({
                sliderLeft: activeSlide * containerWidth
            });
        }

        this.startLeft = null;
        this.swipeStatus = END_SWIPE_STATUS;
        this.setState({
            sliderLeft: newActiveSlideIndex * containerWidth,
            activeSlide: newActiveSlideIndex
        }, () => {
            this.swipeStatus = null;
        });
    };

    handleArrowClick = (arrowType) => () => {
        const { containerWidth, sliderLeft, activeSlide } = this.state;

        if (arrowType === 'left') {
            this.setState({
                activeSlide: activeSlide - 1,
                sliderLeft: sliderLeft - containerWidth
            });
        } else {
            this.setState({
                activeSlide: activeSlide + 1,
                sliderLeft: sliderLeft + containerWidth
            });
        }
    };

    getCategoryPath = categoryId => {
        const { categories } = this.props;

        return find(category => category.id === categoryId, categories).path;
    };

    render () {
        const { viewed } = this.props;
        const { sliderLeft, containerWidth, maxSlides, slideSetsAmount } = this.state;

        return <div className={classNames(styles.productPreviouslyViewed, styles.infoContainer)}>
            {!!viewed.length && <div className={styles.bottomHeader}>недавно просматривали</div>}
            <div className={styles.sliderContainer}>
                <div className={styles.previouslyViewed}>
                    <Draggable
                        onDragStart={this.handleDragStart}
                        onDrag={this.handleDragProcess}
                        onDragEnd={this.handleDragEnd}
                        allowDefaultAction
                        touchable
                    >
                        <div className={styles.slides} style={{ left: `-${sliderLeft}px`, ...this.getTransitionStyles() }}>
                            {viewed.map((product, i) =>
                                <Link className={styles.link} key={product.id} to={`/${this.getCategoryPath(product.categoryId)}/${product.id}`}>
                                    <div className={styles.sliderItem} key={i}>
                                        <div className={styles.previouslyViewedItem}>
                                            <div><img className={styles.avatar} src={product.avatar} alt={`${product.name} photo`} />
                                            </div>
                                            <div className={styles.itemInfoContainer}>
                                                <div className={styles.viewedProductName}>{product.name}</div>
                                                <div className={styles.viewedCategoryName}>{product.company}</div>
                                                <div className={styles.itemPrice}>{product.price.toLocaleString('ru')} UAH</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </Draggable>
                </div>
                {viewed.length > maxSlides &&
                <div className={styles.buttons}>
                    <button
                        className={classNames(styles.buttonLeft)}
                        onClick={this.state.sliderLeft !== 0 ? this.handleArrowClick('left') : undefined}
                    >
                        <div
                            className={this.state.sliderLeft === 0 && styles.buttonDisabled ? styles.buttonDisabled : styles.buttonEnabled}/>
                    </button>
                    <button
                        className={classNames(styles.buttonRight)}
                        onClick={this.state.sliderLeft !== containerWidth * slideSetsAmount
                            ? this.handleArrowClick('right')
                            : undefined }
                    >
                        <div
                            className={this.state.sliderLeft === containerWidth * slideSetsAmount
                                ? styles.buttonDisabled
                                : styles.buttonEnabled }/>
                    </button>
                </div>}
            </div>
        </div>;
    }
}

export default withRouter(connect(mapStateToProps, null)(PreviouslyViewed));
