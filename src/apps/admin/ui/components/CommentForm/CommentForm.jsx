import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import editComment from '../../../services/editComment';
import deleteCommentsByIds from '../../../services/deleteCommentsByIds';
import getProducts from '../../../services/getProducts';
import getCategories from '../../../services/getCategories';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import find from '@tinkoff/utils/array/find';
import format from 'date-fns/format';

const mapStateToProps = ({ application, products }) => {
    return {
        categories: application.categories,
        products: products.products
    };
};

const mapDispatchToProps = (dispatch) => ({
    getProducts: payload => dispatch(getProducts(payload)),
    getCategories: payload => dispatch(getCategories(payload)),
    editComment: payload => dispatch(editComment(payload)),
    deleteCommentsByIds: payload => dispatch(deleteCommentsByIds(payload))
});

const materialStyles = theme => ({
    loader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        marginBottom: '15px'
    },
    title: {
        marginBottom: '12px'
    },
    statusField: {
        width: '100%',
        height: '56px',
        backgroundColor: '#ffffff',
        marginTop: '12px',
        marginBottom: '12px'
    },
    typographyTitle: {
        margin: '12px'
    },
    textField: {
        width: '100%'
    },
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    },
    buttonTested: {
        margin: '10px'
    },
    buttonDelete: {
        margin: '10px',
        backgroundColor: '#e53935',
        color: 'white',
        '&:hover': {
            backgroundColor: '#c62828'
        }
    },
    cardContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '45px'
    },
    card: {
        maxWidth: '345px'
    },
    cardLink: {
        textDecoration: 'none',
        width: '254px'
    },
    media: {
        height: 0,
        paddingTop: '56.25%',
        backgroundSize: '190px'
    }
});

class CommentForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        comment: PropTypes.object.isRequired,
        products: PropTypes.array,
        categories: PropTypes.array,
        editComment: PropTypes.func,
        getProducts: PropTypes.func,
        getCategories: PropTypes.func,
        deleteCommentsByIds: PropTypes.func,
        onDone: PropTypes.func
    };

    static defaultProps = {
        onDone: noop,
        comment: {},
        categories: [],
        products: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            comment: this.props.comment,
            id: prop('id', this.props.comment),
            product: {}
        };
    }

    setProduct = () => {
        const { products, comment, categories } = this.props;
        const product = find(product => comment.productId === product.id, products);
        const category = find(category => product.categoryId === category.id, categories);

        this.setState({
            categoryPath: category.path,
            product: product
        });
    }

    formatCommentDate = comment => format(comment.date, 'hh:mm:ss - DD MMM YYYY');

    componentDidMount () {
        Promise.all([
            this.props.getProducts(),
            this.props.getCategories()
        ])
            .then(() => {
                this.setProduct();
                this.setState({
                    loading: false
                });
            });
    }

    getCommentPayload = (
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
            verified: true,
            rating,
            id
        };
    };

    handleSubmit = event => {
        event.preventDefault();

        const { editComment, onDone } = this.props;
        const { id, comment } = this.state;
        const productPayload = this.getCommentPayload(comment);

        editComment({ ...productPayload, id })
            .then(onDone());
    }

    handleDelete = () => {
        event.preventDefault();

        this.props.deleteCommentsByIds(this.state.id)
            .then(this.props.onDone());
    };

    handleCommentChange = prop => event => {
        const { comment } = this.state;

        comment[prop] = event.target.value;

        this.setState({
            comment
        });
    };

    render () {
        const { classes } = this.props;
        const { comment, product, categoryPath } = this.state;
        const formatCommentDate = this.formatCommentDate(comment);

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5' className={classes.title}>Редактирование комментария</Typography>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2}>Название</TableCell>
                            <TableCell align="center">Значение</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Имя</TableCell>
                            <TableCell align="center">{comment.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Почта</TableCell>
                            <TableCell align="center">{comment.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Рейтинг</TableCell>
                            <TableCell align="center">{comment.rating}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Дата</TableCell>
                            <TableCell align="center">{formatCommentDate}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant='h6'>Продукт</Typography>
            <div className={classes.cardContainer}>
                <Link className={classes.cardLink} target='_blank' to={`/${categoryPath}/${product.id}`}>
                    <Card className={classes.card}>
                        <CardHeader
                            title={product.name}
                            subheader={product.company}
                        />
                        <CardMedia
                            className={classes.media}
                            image={product.avatar}
                            title={product.name}
                        />
                    </Card>
                </Link>
            </div>
            <Typography variant='h6'>Комментарий</Typography>
            <TextField
                label="Комментарий"
                multiline
                rows="3"
                defaultValue={comment.text}
                onChange={this.handleCommentChange('text')}
                className={classes.textField}
                margin="normal"
                variant="outlined"
            />
            <Divider className={classes.divider} />
            <FormControl margin='normal'>
                <Button variant='contained' color="primary" className={classes.buttonTested} type='submit'>
                    Одобрить
                </Button>
            </FormControl>
            <FormControl margin='normal'>
                <Button variant='contained' onClick={this.handleDelete} className={classes.buttonDelete} type='button'>
                    Удалить
                </Button>
            </FormControl>
        </form>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(CommentForm));
