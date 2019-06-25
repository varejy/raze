import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './PreviouslyViewed.css';

import { Link, withRouter } from 'react-router-dom';

const PREVIEW_WIDTH = 1110;
const MAX_SLIDES = 3;

class PreviouslyViewed extends Component {
    state = {
        leftPosition: 0
    };

    static propTypes = {
        viewed: PropTypes.array,
        match: PropTypes.object
    };

    static defaultProps = {
        viewed: [],
        match: {}
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

    render () {
        const { viewed, match: { params } } = this.props;

        return <div className={classNames(styles.productPreviouslyViewed, styles.infoContainer)}>
            <div className={styles.bottomHeader}>недавно просматривали</div>
            <div className={styles.sliderContainer}>
                <div className={styles.previouslyViewed}>
                    <div className={styles.slides} style={{ left: `-${this.state.leftPosition.toString()}px` }}>
                        {viewed.map((item, i) =>
                            <Link className={styles.link} key={item.id} to={`/${params.category}/${item.id}`}>
                                <div className={styles.sliderItem} key={i}>
                                    <div className={styles.previouslyViewedItem}>
                                        <div><img className={styles.avatar} src={item.avatar} alt={`${item.name} photo`} />
                                        </div>
                                        <div className={styles.itemInfoContainer}>
                                            <div className={styles.viewedProductName}>{item.name}</div>
                                            <div className={styles.viewedCategoryName}>{item.company}</div>
                                            <div className={styles.itemPrice}>{item.price} UAH</div>
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

export default withRouter(PreviouslyViewed);
