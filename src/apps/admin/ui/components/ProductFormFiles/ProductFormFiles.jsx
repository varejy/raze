import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
        display: 'flex',
        padding: '8px',
        overflow: 'auto'
    },
    fileItem: {
        position: 'relative',
        userSelect: 'none',
        padding: '16px',
        margin: '0 8px 0 0',
        width: '200px',
        '&:hover $fileItemDeleteContainer': {
            visibility: 'visible'
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

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);

    return result;
};

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
                path: file,
                id: uniqid()
            }), this.props.initialFiles)
        };
    }

    getClearFiles = files => map(file => file.path || file.content, files);

    handleFileUpload = (event) => {
        const newFiles = map(file => ({
            content: file,
            id: uniqid()
        }), event.target.files);
        const files = [...this.state.files, ...newFiles];

        this.setState({
            files
        }, this.handleFilesChange);
    };

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const files = reorder(
            this.state.files,
            result.source.index,
            result.destination.index
        );

        this.setState({
            files
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

    renderFilesPreview = () => {
        const { classes } = this.props;
        const { files } = this.state;

        return <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId='droppable' direction='horizontal'>
                {provided => (
                    <div
                        className={classes.filesList}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {files.map((file, index) => {
                            const imagePreviewUrl = file.path || URL.createObjectURL(file.content);

                            return <Draggable key={file.id} draggableId={file.id} index={index}>
                                {provided => (
                                    <div
                                        ref={provided.innerRef}
                                        className={classes.fileItem}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={provided.draggableProps.style}
                                    >
                                        <div className={classes.fileItemDeleteContainer}>
                                            <IconButton
                                                aria-label='Delete'
                                                onClick={this.handleFileDelete(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                        <img className={classes.fileImage} src={imagePreviewUrl} />
                                    </div>
                                )}
                            </Draggable>;
                        })}
                    </div>
                )}
            </Droppable>
        </DragDropContext>;
    };

    render () {
        const { classes } = this.props;

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
            {this.renderFilesPreview()}
        </div>;
    }
}

export default withStyles(materialStyles)(ProductForm);
