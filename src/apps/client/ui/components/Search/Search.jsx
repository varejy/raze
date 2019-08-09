import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link, withRouter } from 'react-router-dom';

import outsideClick from '../../hocs/outsideClick';

import { connect } from 'react-redux';
import searchByText from '../../../services/client/searchByText';

import noop from '@tinkoff/utils/function/noop';
import find from '@tinkoff/utils/array/find';

import styles from './Search.css';

const MAX_LENGTH_TIPS_NAMES = 23;

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    searchByText: payload => dispatch(searchByText(payload))
});

@outsideClick
class Search extends Component {
    static propTypes = {
        turnOnClickOutside: PropTypes.func,
        searchByText: PropTypes.func,
        outsideClickEnabled: PropTypes.bool,
        categories: PropTypes.array,
        history: PropTypes.object,
        isMobileVersion: PropTypes.bool.isRequired,
        handleCloseSearch: PropTypes.func.isRequired
    };

    static defaultProps = {
        turnOnClickOutside: noop,
        searchByText: noop,
        categories: []
    };

    state = {
        inputTxt: '',
        tips: []
    };

    handleTipsClose = () => {
        this.setState({
            tips: []
        });
        this.props.handleCloseSearch();
    };

    handleInputSubmit = event => {
        const { inputTxt } = this.state;

        event.preventDefault();
        if (inputTxt) {
            this.props.history.push(`/search?text=${inputTxt}`);
            this.handleTipsClose();
        }
    };

    handleInputChange = event => {
        const value = event.target.value;
        const { categories } = this.props;
        const { outsideClickEnabled, turnOnClickOutside } = this.props;

        this.setState({
            inputTxt: value
        });

        value.length
            ? this.props.searchByText(value).then((products) => {
                const newTips = products
                    .slice(0, 5)
                    .map(product => {
                        const category = find(category => category.id === product.categoryId)(categories);

                        return {
                            title: product.name,
                            categoryPath: category.path,
                            id: product.id
                        };
                    });

                this.setState({
                    tips: newTips
                });

                !outsideClickEnabled && turnOnClickOutside(this, this.handleTipsClose);
            })
            : this.setState({
                tips: []
            });
    };

    getTipName = name => {
        return name.length > MAX_LENGTH_TIPS_NAMES ? `${name.substring(0, MAX_LENGTH_TIPS_NAMES)}...` : name;
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.isMobileVersion !== nextProps.isMobileVersion) {
            const { outsideClickEnabled, turnOnClickOutside, handleCloseSearch } = this.props;
            !outsideClickEnabled && turnOnClickOutside(this, handleCloseSearch);
        }
    }

    render () {
        const { inputTxt, tips } = this.state;
        const { isMobileVersion } = this.props;

        return <form onSubmit={this.handleInputSubmit} className={styles.form}>
            <input
                value={inputTxt}
                onChange={this.handleInputChange}
                className={classNames(styles.searchFormInput, { [styles.searchFormInputActive]: !!tips.length })}
                placeholder='Поиск продуктов'
                onFocus={this.handleInputChange}
                autoFocus={isMobileVersion}
            />
            {
                !!tips.length && <div className={styles.tipsRoot}>
                    <div className={styles.tipsWrapp}>
                        <div className={styles.break}/>
                        <ul className={styles.adviceContainer} onClick={this.handleTipsClose}>
                            {
                                tips.map((tip, i) => {
                                    return (
                                        <Link key={i} className={styles.tipLink} to={`/${tip.categoryPath}/${tip.id}`}>
                                            <li className={styles.tip}>{this.getTipName(tip.title)}</li>
                                        </Link>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
            }
            <button className={styles.searchFormIcon} type='submit'>
                <img className={styles.searchIcon} src='/src/apps/client/ui/components/Header/images/search.png' alt='search'/>
            </button>
        </form>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));
