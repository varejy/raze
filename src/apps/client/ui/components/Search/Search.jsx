import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, withRouter } from 'react-router-dom';

import outsideClick from '../../hocs/outsideClick';

import { connect } from 'react-redux';
import searchByText from '../../../services/client/searchByText';

import noop from '@tinkoff/utils/function/noop';
import dropLast from '@tinkoff/utils/array/dropLast';

import styles from './Search.css';

const mapDispatchToProps = (dispatch) => ({
    searchByText: payload => dispatch(searchByText(payload))
});

@outsideClick
class Search extends Component {
    static propTypes = {
        turnOnClickOutside: PropTypes.func,
        searchByText: PropTypes.func,
        categories: PropTypes.array,
        history: PropTypes.object
    };

    static defaultProps = {
        turnOnClickOutside: noop,
        searchByText: noop,
        categories: []
    };

    state = {
        inputTxt: '',
        visibleTips: false,
        tips: []
    }

    handleVisibleTipsNone = () => {
        this.setState({
            inputTxt: '',
            visibleTips: false,
            tips: []
        });
    }

    handleInputSubmit = event => {
        const { inputTxt } = this.state;
        event.preventDefault();
        this.props.history.push(`/search?text=${inputTxt}`);
        this.handleVisibleTipsNone();
    }

    handleInputChange = event => {
        const value = event.target.value;
        const { visibleTips } = this.state;

        this.props.searchByText(value).then((products) => {
            const mapTips = [];

            products.map(product => {
                mapTips.push({
                    title: product.name,
                    categoryId: product.categoryId,
                    id: product.id
                });
            });

            products.length > 5
                ? this.setState({
                    tips: dropLast(products.length - 5, mapTips)
                })
                : this.setState({
                    tips: mapTips
                });
        });

        this.setState({
            inputTxt: value,
            visibleTips: !!value
        });

        !visibleTips && this.props.turnOnClickOutside(this, this.handleVisibleTipsNone);
    }

    render () {
        const { visibleTips, inputTxt, tips } = this.state;

        return <form onSubmit={this.handleInputSubmit}>
            <input
                value={inputTxt}
                onChange={this.handleInputChange}
                className={classNames(styles.searchFormInput, { [styles.searchFormInputActive]: visibleTips })}
                placeholder='Поиск продуктов...'
            />
            {
                visibleTips && <div className={styles.tipsRoot}>
                    <div className={styles.tipsWrapp}>
                        <div className={styles.break}></div>
                        <ul className={styles.adviceСontainer} onClick={this.handleVisibleTipsNone}>
                            {
                                tips.map((tip, i) => {
                                    return (
                                        <Link key={i} className={styles.tipLink} to={`/${tip.categoryId}/${tip.id}`}>
                                            <li className={styles.tip}>{tip.title}</li>
                                        </Link>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
            }
            <button className={styles.searchFormIcon} onClick={this.handleInputSubmit}><img src='/src/apps/client/ui/components/Header/images/search.png' alt='search.png'/></button>
        </form>;
    }
}

export default withRouter(connect(null, mapDispatchToProps)(Search));
