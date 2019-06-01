import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';

import AdminTable from '../../components/AdminTable/AdminTable.jsx';
import CategoryForm from '../../components/CategoryForm/CategoryForm';

import { connect } from 'react-redux';
import getCategories from '../../../services/getCategories';
import deleteCategoriesByIds from '../../../services/deleteCategoriesByIds';

const materialStyles = theme => ({
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh'
    },
    warningContent: {
        paddingBottom: '0'
    }
});
const getHost = () => {
    const protocol = location.hostname === 'localhost' ? 'http://' : 'https://';

    return `${protocol}${location.host}`;
};

const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'category', label: 'Путь' },
    { id: 'active', label: 'Active' }
];
const tableCells = [
    { prop: category => category.name },
    { prop: category => <Link
        href={`${getHost()}/${category.path}`}
        target='_blank'
    >
        /{category.path}
    </Link> },
    { prop: category => category.hidden ? <CloseIcon /> : <CheckIcon /> }
];

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload)),
    deleteCategories: payload => dispatch(deleteCategoriesByIds(payload))
});

class CategoryPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getCategories: PropTypes.func.isRequired,
        deleteCategories: PropTypes.func.isRequired,
        categories: PropTypes.array
    };

    static defaultProps = {
        categories: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            filtersShowed: false,
            editableCategory: null
        };
    }

    componentDidMount () {
        this.props.getCategories()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    handleFormDone = () => {
        this.props.getCategories()
            .then(this.handleCloseCategoryForm);
    };

    handleFormOpen = category => () => {
        this.setState({
            formShowed: true,
            editableCategory: category
        });
    };

    handleFiltersOpen = () => {
        this.setState({
            filtersShowed: true
        });
    };

    handleCloseCategoryForm = () => {
        this.setState({
            formShowed: false,
            editableCategory: null
        });
    };

    render () {
        const { classes, categories } = this.props;
        const { loading, editableCategory, formShowed } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div>
            <AdminTable
                headerRows={headerRows}
                tableCells={tableCells}
                values={categories}
                headerText='Категории'
                deleteValueWarningTitle='Вы точно хотите удалить категорию?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующие категории?'
                onDelete={this.props.deleteCategories}
                onFormOpen={this.handleFormOpen}
                onFiltersOpen={this.handleFiltersOpen}
                filters={false}
            />
            <Modal open={formShowed} onClose={this.handleCloseCategoryForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <CategoryForm category={editableCategory} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(CategoryPage));
