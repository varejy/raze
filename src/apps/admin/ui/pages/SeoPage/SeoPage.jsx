import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import SeoTabs from '../../components/SeoTabs/SeoTabs';
import getAllSeo from '../../../services/getAllSeo';
import getCategories from '../../../services/getCategories';

import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import pick from '@tinkoff/utils/object/pick';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import classNames from 'classnames';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import find from '@tinkoff/utils/array/find';
import search from '../../../services/search';
import MetaForm from '../../components/MetaForm/MetaForm';

const materialStyles = () => ({
    paper: {
        padding: '0 24px 24px 24px'
    },
    container: {
        padding: '24px 0',
        width: '100%'
    },
    headerContainer: {
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start'
    },
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchWrapp: {
        display: 'flex',
        marginTop: '15px',
        flexDirection: 'column',
        alignItems: 'center'
    },
    search: {
        width: '350px'
    },
    products: {
        padding: '48px'
    },
    cardContainer: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        padding: '45px'
    },
    card: {
        maxWidth: '345px',
        border: '1px solid transparent'
    },
    cardLink: {
        textDecoration: 'none',
        margin: '20px 10px',
        width: '254px'
    },
    media: {
        height: 0,
        paddingTop: '56.25%',
        backgroundSize: '190px'
    },
    selectedProduct: {
        border: '1px solid rgb(63, 80, 181)'
    }
});
const PAGES = [
    { header: 'Главная страница', page: 'main' },
    { header: 'Страница заказа', page: 'order' },
    { header: 'Страница поиска', page: 'search' }
];
const mapStateToProps = ({ products, application }) => {
    return {
        products: products.products,
        categories: application.categories
    };
};
const mapDispatchToProps = (dispatch) => ({
    getAllSeo: payload => dispatch(getAllSeo(payload)),
    getCategories: payload => dispatch(getCategories(payload)),
    search: payload => dispatch(search(payload))
});

class SeoPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getAllSeo: PropTypes.func.isRequired,
        search: PropTypes.func,
        products: PropTypes.array,
        categories: PropTypes.array,
        getCategories: PropTypes.func
    };

    static defaultProps = {
        products: [],
        categories: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            tabsValue: 0,
            tips: [],
            searchTxt: '',
            selectedProduct: null
        };
    }

    componentWillReceiveProps (nextProps) {
        nextProps.getAllSeo();
        this.setTips(nextProps);
    }

    componentDidMount () {
        this.props.getAllSeo()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
        this.props.getCategories();
    }

    handleTableChange = event => () => {
        this.setState({
            tabsValue: event
        });
    };

    handleSearchChange = event => {
        const searchTxt = event.target.value;

        this.setState({
            searchTxt
        });

        searchTxt.length !== 0
            ? this.searchProducts(searchTxt)
            : this.setState({
                tips: [],
                selectedProduct: {}
            });
    };

    handleSelectedProduct = product => () => {
        this.setState({
            selectedProduct: product
        });
    };

    searchProducts = searchText => {
        this.props.search(searchText);
    };

    setTips = (props = this.props) => {
        const { selectedProduct } = this.state;
        const { products } = props;

        const newTips = products
            .map(product => {
                return {
                    ...product
                };
            });
        const newSelectedProduct = selectedProduct ? find(tip => tip.id === selectedProduct.id, newTips) : null;

        this.setState({
            tips: newTips,
            selectedProduct: newSelectedProduct
        });
    };

    renderEditSeo = () => {
        const { classes } = this.props;

        return <div>
            <Paper className={classes.paper}>
                <div className={classes.headerContainer}>
                    <Typography variant='h6' id='seoTitle'>SEO</Typography>
                </div>
                <SeoTabs pages={PAGES} option='seo'/>
            </Paper>
        </div>;
    };

    renderEditCategorySeoPage = () => {
        const { classes, categories } = this.props;
        let categoriesMap = [];
        categories.map(category => {
            categoriesMap.push({ header: `Редактирование категории '${category.name}'`, page: category.name });
        });

        return <div>
            <Paper className={classes.paper}>
                <div className={classes.headerContainer}>
                    <Typography variant='h6' id='seoTitle'>SEO</Typography>
                </div>
                <SeoTabs pages={categoriesMap} categories={categories} option='category'/>
            </Paper>
        </div>;
    };

    renderSearchPage = () => {
        const { classes } = this.props;
        const { searchTxt, tips, selectedProduct } = this.state;
        const { id } = pick(['id'], selectedProduct || {});
        const check = (prop) => id === prop;

        return <div>
            <div className={classes.searchWrapp}>
                <TextField
                    label='Поиск'
                    value={searchTxt}
                    onChange={this.handleSearchChange}
                    margin='normal'
                    className={classes.search}
                    variant='outlined'
                />
            </div>
            {
                searchTxt.length !== 0 && <div className={classes.products}>
                    <Typography variant='h6'>{` По запросу '${searchTxt}' ${(!tips.length && searchTxt.length) ? 'ничего не найдено' : 'найдено'}`}</Typography>
                    <div className={classes.cardContainer}>
                        {
                            tips.map(tip => {
                                return <div key={tip.id} onClick={this.handleSelectedProduct(tip)} className={classes.cardLink}>
                                    <Card className={classNames(classes.card, { [classes.selectedProduct]: check(tip.id) })}>
                                        <CardHeader
                                            title={tip.name}
                                            subheader={tip.company}
                                        />
                                        <CardMedia
                                            className={classes.media}
                                            image={tip.avatar}
                                            title={tip.name}
                                        />
                                    </Card>
                                </div>;
                            })
                        }
                    </div>
                </div>
            }
            {
                !!id && <Paper className={classes.paper} component="div">
                    <MetaForm page='product' product={selectedProduct} searchQuery={searchTxt} option='product'/>
                </Paper>
            }
        </div>;
    };

    render () {
        const { classes } = this.props;
        const { loading, tabsValue } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div className={classes.container}>
            <AppBar position="static" color="default">
                <Tabs
                    value={tabsValue}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab onClick={this.handleTableChange(0)} label="Редактирование SEO страниц" />
                    <Tab onClick={this.handleTableChange(1)} label="Редактирование SEO категорий" />
                    <Tab onClick={this.handleTableChange(2)} label="Поиск по товарам" />
                </Tabs>
            </AppBar>
            <SwipeableViews
                index={tabsValue}
                onChangeIndex={this.handleChangeIndex}
            >
                {this.renderEditSeo(0)}
                {this.renderEditCategorySeoPage(1)}
                {this.renderSearchPage(2)}
            </SwipeableViews>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(SeoPage));
