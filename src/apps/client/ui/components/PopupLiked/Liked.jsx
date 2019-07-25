import React, { Component } from 'react';

import styles from './Liked.css';
import closeLikedPopup from '../../../actions/closeLikedPopup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import setLiked from '../../../actions/setLiked';
import remove from '@tinkoff/utils/array/remove';
import saveProductsLiked from '../../../services/client/saveProductsLiked';
import Scroll from '../Scroll/Scroll';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import find from '@tinkoff/utils/array/find';

const mapStateToProps = ({ popup, savedProducts, application }) => {
    return {
        likedVisible: popup.likedVisible,
        liked: savedProducts.liked,
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeLikedPopup: (payload) => dispatch(closeLikedPopup(payload)),
    setLiked: payload => dispatch(setLiked(payload)),
    saveProductsLiked: payload => dispatch(saveProductsLiked(payload))
});

class Liked extends Component {
    static propTypes = {
        closeLikedPopup: PropTypes.func.isRequired,
        likedVisible: PropTypes.bool.isRequired,
        liked: PropTypes.array.isRequired,
        setLiked: PropTypes.func.isRequired,
        saveProductsLiked: PropTypes.func.isRequired,
        categories: PropTypes.array
    };

    static defaultProps = {
        likedVisible: false,
        liked: [],
        categories: []
    };

    handleCloseLiked = () => {
        this.props.closeLikedPopup();
    };

    deleteItem = (index) => () => {
        const newLiked = [
            ...remove(index, 1, this.props.liked)
        ];

        this.props.setLiked(newLiked);
        this.props.saveProductsLiked(newLiked.map((product) => product.id));
    };

    componentDidMount () {
        window.addEventListener('keydown', this.handleKeyDown);
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.likedVisible !== nextProps.likedVisible) {
            document.body.style.overflowY = nextProps.likedVisible ? 'hidden' : 'auto';
        }
    };

    componentWillUnmount () {
        window.removeEventListener('keydown', this.handleKeyDown);
    };

    handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.props.closeLikedPopup();
        }
    };

    getCategoryPath = categoryId => {
        const { categories } = this.props;

        return find(category => category.id === categoryId, categories).path;
    };

    render () {
        const { liked, likedVisible } = this.props;

        return <div className={classNames(styles.root, {
            [styles.rootVisible]: likedVisible
        })}>
            <div className={classNames(styles.backing, {
                [styles.backingVisible]: likedVisible
            })}/>
            <div className={classNames(styles.popupContent, {
                [styles.popupContentVisible]: likedVisible
            })}>
                <div>
                    <div className={styles.headerContainer}>
                        <div className={styles.header}>избранные</div>
                        <div className={styles.closeButton} onClick={this.handleCloseLiked}>+</div>
                    </div>
                    {liked.length > 0 ? <div className={styles.items}>
                        <Scroll>
                            {liked.map((item, i) =>
                                <div className={styles.item} key={i}>
                                    <Link className={styles.productLink} key={item.id}
                                        to={`/${this.getCategoryPath(item.categoryId)}/${item.id}`}>
                                        <div className={styles.itemImageWrapp}>
                                            <div className={styles.deleteItem} onClick={this.deleteItem(i)}>
                                                <img src='/src/apps/client/ui/components/PopupBasket/img/deleteIcon.png' alt='delete'/>
                                            </div>
                                            <div className={styles.itemImage}>
                                                <img
                                                    className={styles.itemAvatar}
                                                    src={item.avatar}
                                                    alt='product'/>
                                            </div>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h2 className={styles.itemName}>{item.name}</h2>
                                            <div className={styles.itemCompany}>{item.company}</div>
                                            <h2 className={styles.itemPrice}>{item.price} UAH</h2>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </Scroll>
                    </div>
                        : <div className={styles.noLikedItems}>
                            К сожалению, Вы не добавили в избранное товары.<br/>
                            Исправить ситуацию Вы можете выбрав товар в каталоге.
                        </div>
                    }
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Liked);
