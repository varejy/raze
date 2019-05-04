import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import uniqid from 'uniqid';

import noop from '@tinkoff/utils/function/noop';
import map from '@tinkoff/utils/array/map';
import remove from '@tinkoff/utils/array/remove';
import arrayMove from '../../../utils/arrayMove';

const materialStyles = theme => ({
    uploadInput: {
        display: 'none'
    },
    upload: {
        marginTop: theme.spacing.unit
    },
    uploadIcon: {
        marginLeft: theme.spacing.unit
    },
    filesList: {
        overflow: 'auto'
    },
    fileItem: {
        position: 'relative',
        userSelect: 'none',
        padding: '16px',
        margin: '0 8px 0 0',
        width: '200px',
        float: 'left',
        zIndex: '9999',
        cursor: 'grab',
        '&:hover $fileItemDeleteContainer': {
            visibility: 'visible'
        }
    },
    fileItemSorting: {
        '&:hover $fileItemDeleteContainer': {
            visibility: 'hidden'
        }
    },
    fileImage: {
        width: '100%'
    },
    fileItemDeleteContainer: {
        position: 'absolute',
        right: '0',
        top: '0',
        visibility: 'hidden',
        background: 'white',
        borderRadius: '100%'
    }
});

const FilePreview = SortableElement(({ file, index, classes, onFileDelete, isSorting }) =>
    <div className={classNames(classes.fileItem, {
        [classes.fileItemSorting]: isSorting
    })}>
        <div className={classes.fileItemDeleteContainer}>
            <IconButton
                aria-label='Delete'
                onClick={onFileDelete(index)}
            >
                <DeleteIcon />
            </IconButton>
        </div>
        <img className={classes.fileImage} src={file.path} />
    </div>);

const FilesPreviews = SortableContainer(({ files, classes, ...rest }) => {
    return (
        <div className={classes.filesList}>
            {files.map((file, i) => <FilePreview
                key={i}
                index={i}
                file={file}
                classes={classes}
                {...rest}
            />)}
        </div>
    );
});

class ProductForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onFilesUpload: PropTypes.func.isRequired,
        initialFiles: PropTypes.array
    };

    static defaultProps = {
        onDone: noop,
        initialFiles: []
    };

    constructor (...args) {
        super(...args);

        this.removedFiles = [];

        this.state = {
            files: map(file => ({
                path: file || '/wrong-path',
                id: uniqid()
            }), this.props.initialFiles),
            isSorting: false
        };

        this.handleFilesChange();
    }

    handleFileUpload = (event) => {
        const newFiles = map(file => ({
            content: file,
            path: URL.createObjectURL(file),
            id: uniqid()
        }), event.target.files);
        const files = [...this.state.files, ...newFiles];

        this.setState({
            files
        }, this.handleFilesChange);

        event.target.value = '';
    };

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            files: arrayMove(this.state.files, oldIndex, newIndex)
        }, this.handleFilesChange);
    };

    handleFileDelete = i => () => {
        const { files } = this.state;

        if (files[i].path) {
            this.removedFiles.push(files[i]);
        }

        this.setState({
            files: remove(i, 1, files)
        }, this.handleFilesChange);
    };

    handleFilesChange = () => {
        const { files } = this.state;

        this.props.onFilesUpload(files, this.removedFiles);
    };

    render () {
        const { classes } = this.props;
        const { files, isSorting } = this.state;

        return <div>
            <Typography variant='h6'>Фотографии</Typography>
            <input
                className={classes.uploadInput}
                id='uploadInput'
                type='file'
                accept='image/*'
                onChange={this.handleFileUpload}
                multiple
            />
            <label htmlFor='uploadInput'>
                <Button variant='contained' component='span' color='default' className={classes.upload}>
                    Загрузить
                    <CloudUploadIcon className={classes.uploadIcon} />
                </Button>
            </label>
            <FilesPreviews
                axis='xy'
                classes={classes}
                files={files}
                onFileDelete={this.handleFileDelete}
                onSortStart={this.onDragStart}
                onSortEnd={this.onDragEnd}
                isSorting={isSorting}
            />
        </div>;
    }
}

export default withStyles(materialStyles)(ProductForm);
