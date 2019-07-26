import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import CommentForm from '../../components/CommentForm/CommentForm';

import { connect } from 'react-redux';
import getComments from '../../../services/getComments';
import editComment from '../../../services/editComment';
import getCategories from '../../../services/getCategories';
import deleteCommentsByIds from '../../../services/deleteCommentsByIds';
import search from '../../../services/search';

import format from 'date-fns/format';
import find from '@tinkoff/utils/array/find';

const headerRows = [
    { id: 'name', label: 'Имя' },
    { id: 'email', label: 'Почта' },
    { id: 'date', label: 'Дата' },
    { id: 'rating', label: 'Рейтинг' }
];
const tableCells = [
    { prop: comment => comment.name },
    { prop: comment => comment.email },
    { prop: comment => format(comment.date, 'hh:mm:ss - DD MMM YYYY') },
    { prop: comment => comment.rating }
];

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
    valuesActions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
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
        maxWidth: '345px'
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
    }
});

const mapStateToProps = ({ application, products }) => {
    return {
        categories: application.categories,
        comments: products.comments,
        products: products.products
    };
};

const mapDispatchToProps = (dispatch) => ({
    search: payload => dispatch(search(payload)),
    getCategories: payload => dispatch(getCategories(payload)),
    getComments: payload => dispatch(getComments(payload)),
    editComment: payload => dispatch(editComment(payload)),
    deleteCommentsByIds: payload => dispatch(deleteCommentsByIds(payload))
});

class CommentsPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        comments: PropTypes.array,
        products: PropTypes.array,
        categories: PropTypes.array,
        getComments: PropTypes.func,
        getCategories: PropTypes.func,
        editComment: PropTypes.func,
        deleteCommentsByIds: PropTypes.func,
        search: PropTypes.func
    };

    static defaultProps = {
        comments: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            editableComment: null,
            searchTxt: '',
            tips: [],
            comments: [],
            tabsValue: 0,
            valueForDelete: null,
            rowsPerPage: 10,
            page: 0
        };
    }

    componentDidMount () {
        const { getComments, getCategories } = this.props;
        Promise.all([
            getComments(),
            getCategories()
        ]).then(() => {
            this.setState({
                loading: false,
                comments: this.filteredComments()
            });
        });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.comments !== nextProps.comments) {
            this.setState({
                comments: this.filteredComments(nextProps)
            });
        }
    }

    filteredComments = (props = this.props) => {
        return props.comments.filter(comment => comment.verified === false);
    };

    handleFormDone = () => {
        this.props.getComments()
            .then(this.handleCloseCommentForm);
    };

    handleFormOpen = comment => () => {
        this.setState({
            formShowed: true,
            editableComment: comment
        });
    };

    handleDelete = value => () => {
        this.props.deleteCommentsByIds(value.id);
    };

    handleDelete = value => () => {
        this.setState({
            valueForDelete: value
        });
    };

    handleWarningDisagree = () => {
        this.setState({
            valueForDelete: null
        });
    };

    handleWarningAgree = () => {
        const { valueForDelete } = this.state;

        this.props.deleteCommentsByIds(valueForDelete.id)
            .then(() => {
                this.setState({
                    valueForDelete: null
                });
            });
    };

    handleSearchChange = event => {
        const value = event.target.value;
        const { categories, products } = this.props;

        this.setState({
            searchTxt: value
        });

        value.length
            ? this.props.search(value).then(() => {
                const newTips = this.props.products
                    .slice(0, 10)
                    .map(product => {
                        const category = find(category => category.id === product.categoryId, categories);

                        return {
                            title: product.name,
                            company: product.company,
                            comments: product.comments,
                            avatar: product.avatar,
                            categoryPath: category.path,
                            id: product.id
                        };
                    });

                this.setState({
                    tips: newTips
                });
            })
            : this.setState({
                tips: []
            });
    };

    handleCloseCommentForm = () => {
        this.setState({
            formShowed: false,
            editableComment: null
        });
    };

    getProductPayload = (
        {
            name,
            email,
            date,
            text,
            productId,
            verified,
            rating,
            id
        }) => {
        return {
            name,
            email,
            date,
            text,
            productId,
            verified,
            rating,
            id
        };
    };

    handleCheckClick = value => () => {
        const { editComment } = this.props;
        const id = value.id;
        value.verified = true;
        const productPayload = this.getProductPayload(value);

        editComment({ ...productPayload, id })
            .then(
                this.setState({
                    comments: this.filteredComments()
                })
            );
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = ({ target: { value } }) => {
        const { comments } = this.state;
        const rowsPerPage = comments.length > value ? value : comments.length;
        this.setState({ rowsPerPage });
    };

    handleTableChange = event => () => {
        this.setState({
            tabsValue: event
        });
    }

    renderTableNotVerified = (dir) => {
        const { classes } = this.props;
        const { comments, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, comments.length - page * rowsPerPage);

        return <Paper className={classes.paper} component="div" dir={dir}>
            <Toolbar
                className={classes.toolbar}
            >
                <Typography variant='h6' id='tableTitle'>
                    Неверифицированные комментарии
                </Typography>
                <div className={classes.spacer} />
            </Toolbar>
            <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby='tableTitle'>
                    <TableHead>
                        <TableRow>
                            {headerRows.map(
                                (row, i) => (
                                    <TableCell key={i}>
                                        {row.label}
                                    </TableCell>
                                )
                            )}
                            <TableCell align='right' />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comments
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((value, i) => {
                                return (
                                    <Tooltip key={i} title={value.text}>
                                        <TableRow
                                            hover
                                            role='checkbox'
                                            tabIndex={-1}
                                            className={classes.row}
                                        >
                                            {tableCells.map((tableCell, i) => <TableCell key={i}>{tableCell.prop(value)}</TableCell>)}
                                            <TableCell padding='checkbox' align='right'>
                                                <div className={classes.valueActions}>
                                                    <IconButton onClick={this.handleCheckClick(value)}>
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton onClick={this.handleFormOpen(value)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={this.handleDelete(value)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </Tooltip>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                component='div'
                count={comments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        </Paper>;
    }

    renderSearchPage = () => {
        const { classes } = this.props;
        const { searchTxt, tips } = this.state;

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
                                return <Link key={tip.id} className={classes.cardLink} target='_blank' to={`/${tip.categoryPath}/${tip.id}`}>
                                    <Card className={classes.card}>
                                        <CardHeader
                                            title={tip.title}
                                            subheader={tip.company}
                                        />
                                        <CardMedia
                                            className={classes.media}
                                            image={tip.avatar}
                                            title={tip.title}
                                        />
                                    </Card>
                                </Link>;
                            })
                        }
                    </div>
                </div>
            }
        </div>;
    }

    render () {
        const { classes } = this.props;
        const { loading, editableComment, formShowed, valueForDelete, tabsValue } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div>
            <AppBar position="static" color="default">
                <Tabs
                    value={tabsValue}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab onClick={this.handleTableChange(0)} label="Неверифицированные комментарии" />
                    <Tab onClick={this.handleTableChange(1)} label="Поиск" />
                </Tabs>
            </AppBar>
            <SwipeableViews
                index={tabsValue}
                onChangeIndex={this.handleChangeIndex}
            >
                {this.renderTableNotVerified(0)}
                {this.renderSearchPage(1)}
            </SwipeableViews>
            <Modal open={formShowed} onClose={this.handleCloseCommentForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <CommentForm comment={editableComment} onDone={this.handleFormDone} />
                </Paper>
            </Modal>
            <Dialog
                open={!!valueForDelete}
                onClose={this.handleWarningDisagree}
            >
                <DialogTitle>Вы точно хотите удалить комментарий?</DialogTitle>
                <DialogContent className={classes.warningContent}>
                    <DialogContentText>{valueForDelete && valueForDelete.name}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWarningDisagree} color='primary'>
                        Нет
                    </Button>
                    <Button onClick={this.handleWarningAgree} color='primary' autoFocus>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(CommentsPage));
