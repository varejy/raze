import React, { Component } from 'react';
import styles from './ProductPreview.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import findIndex from '@tinkoff/utils/array/findIndex';
import remove from '@tinkoff/utils/array/remove';
import find from '@tinkoff/utils/array/find';
import setLiked from '../../../actions/setLiked';
import saveProductsLiked from '../../../services/client/saveProductsLiked';
import PopupBasket from '../PopupBasketAdding/PopupBasket';
import openPopup from '../../../actions/openPopup';
import closePopup from '../../../actions/closePopup';
import openBasketPopup from '../../../actions/openBasketPopup';

const SLIDER_IS_FULL_SCREEN_DEVICE_WIDTH = 720;
const PREVIEW_WIDTH = 700;

const mapStateToProps = ({ application, savedProducts }) => {
    return {
        media: application.media,
        liked: savedProducts.liked,
        basket: savedProducts.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    setLiked: payload => dispatch(setLiked(payload)),
    saveProductsLiked: payload => dispatch(saveProductsLiked(payload)),
    openPopup: payload => dispatch(openPopup(payload)),
    closePopup: payload => dispatch(closePopup(payload)),
    openBasketPopup: payload => dispatch(openBasketPopup(payload))
});

class ProductPreview extends Component {
    state = {
        leftPosition: 0,
        slidesQuantity: this.props.product.files.length
    };

    static propTypes = {
        product: PropTypes.object,
        media: PropTypes.object.isRequired,
        liked: PropTypes.array.isRequired,
        setLiked: PropTypes.func.isRequired,
        saveProductsLiked: PropTypes.func.isRequired,
        openPopup: PropTypes.func.isRequired,
        closePopup: PropTypes.func.isRequired,
        openBasketPopup: PropTypes.func.isRequired,
        basket: PropTypes.array.isRequired
    };

    static defaultProps = {
        product: {},
        media: {},
        basket: []
    };

    handleDotClick = (leftMoveIndex) => () => {
        const { media } = this.props;
        const sliderIsFullScreen = media.width <= SLIDER_IS_FULL_SCREEN_DEVICE_WIDTH;

        this.setState({
            leftPosition: !sliderIsFullScreen ? (leftMoveIndex * PREVIEW_WIDTH) : (leftMoveIndex * media.width)
        });
    };

    handleArrowClick = (arrowType) => () => {
        const { leftPosition } = this.state;
        const { media } = this.props;
        const sliderIsFullScreen = media.width <= SLIDER_IS_FULL_SCREEN_DEVICE_WIDTH;

        if (arrowType === 'left') {
            this.setState({
                leftPosition: !sliderIsFullScreen ? (leftPosition - PREVIEW_WIDTH) : (leftPosition - media.width)
            });
        } else {
            this.setState({
                leftPosition: !sliderIsFullScreen ? (leftPosition + PREVIEW_WIDTH) : (leftPosition + media.width)
            });
        }
    };

    handleLikeClick = () => {
        const { setLiked, liked, saveProductsLiked, product } = this.props;
        let newLiked;

        if (!this.isLiked()) {
            newLiked = !this.isLiked() ? [
                product,
                ...liked
            ] : [...liked];
            this.setState({ isLiked: true });
        } else {
            const index = findIndex(likedItem => likedItem.id === product.id, liked);
            newLiked = [
                ...remove(index, 1, liked)
            ];
            this.setState({ isLiked: false });
        }
        setLiked(newLiked);
        saveProductsLiked(newLiked.map((product) => product.id));
    };

    isLiked = () => {
        const { liked, product } = this.props;
        return !!find(likedProduct => product.id === likedProduct.id, liked);
    };

    isInBasket = () => {
        const { basket, product } = this.props;
        return !!find(basketProduct => product.id === basketProduct.product.id, basket);
    };

    handleOpenBasket = () => {
        const { openPopup, product } = this.props;
        openPopup(<PopupBasket product={product}/>);
    };

    handleOpenBasketMain = () => {
        this.props.closePopup();
        this.props.openBasketPopup();
    };

    render () {
        const { product, media } = this.props;
        const { slidesQuantity, leftPosition } = this.state;
        const sliderIsFullScreen = media.width <= SLIDER_IS_FULL_SCREEN_DEVICE_WIDTH;
        const isLiked = this.isLiked();
        const inBasket = this.isInBasket();

        return <div className={styles.productPreviewContainer}>
            <div className={styles.productPreview}>
                <div className={styles.productPhotoContainer}>
                    <div className={styles.slides} style={{ left: `-${leftPosition.toString()}px` }}>
                        {product.files.map((sliderImage, i) =>
                            <div className={styles.productPreviewSlide} key={i}>
                                <img className={styles.slidePhoto} src={sliderImage} alt={`slide${i}`} />
                            </div>)}
                    </div>
                    { leftPosition !== 0 && <button
                        className={classNames(styles.buttonLeft)}
                        onClick={this.handleArrowClick('left')}
                    >
                        <div className={styles.arrowButton}/>
                    </button>}
                    { leftPosition !== ((!sliderIsFullScreen ? PREVIEW_WIDTH : media.width) * (slidesQuantity - 1)) && <button
                        className={classNames(styles.buttonRight)}
                        onClick={this.handleArrowClick('right')}
                    >
                        <div className={styles.arrowButton}/>
                    </button>}
                    <div className={styles.dotsContainer}>
                        <div className={styles.buttonDots}>
                            {product.files.map((sliderImage, i) =>
                                <div key={i} className={classNames(styles.dot, {
                                    [styles.dotActive]: leftPosition === i * (!sliderIsFullScreen ? PREVIEW_WIDTH : media.width)
                                })}
                                onClick={this.handleDotClick(i)}/>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.productInfoContainer}>
                    <div className={styles.productPreviewHeader}>
                        <div className={styles.productName}>{product.company} {product.name}</div>
                        <div className={styles.likeIcon} onClick={this.handleLikeClick}>
                            <img src={!isLiked
                                ? '/src/apps/client/ui/components/ProductPreview/images/likeHeart.png'
                                : '/src/apps/client/ui/components/ProductPreview/images/heartGreen.png'}
                            alt='like'
                            />
                        </div>
                    </div>
                    <div className={styles.productPreviewInfo}>
                        <div className={styles.parameters}>
                            {product.features.map((parameter, i) =>
                                <div key={i} className={classNames(styles.parameterLine, {
                                    [styles.parameterLineGrey]: i % 2 !== 0
                                })}>
                                    <div className={styles.parameterName}>{parameter.prop}</div>
                                    <div className={styles.parameterValue}>{parameter.value}</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.description}>{product.description}
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button
                            className={classNames(styles.addToBasketButton, styles.buttonDefault)}
                            onClick={() => { !inBasket ? this.handleOpenBasket() : this.handleOpenBasketMain(); }}>
                            {!inBasket ? 'в корзину' : 'уже в корзине'}
                        </button>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPreview);
