import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';

import uniqid from 'uniqid';

import noop from '@tinkoff/utils/function/noop';
import map from '@tinkoff/utils/array/map';

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
        userSelect: 'none',
        padding: '16px',
        margin: '0 8px 0 0',
        width: '200px'
    },
    fileImage: {
        width: '100%'
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

        this.state = {
            files: this.props.initialFiles
        };
    }

    getClearFiles = files => map(file => file.image, files);

    handleFileUpload = (event) => {
        const newFiles = map(file => file, event.target.files);
        const files = [...this.getClearFiles(this.state.files), newFiles];

        this.props.onFilesUpload(files);

        this.setState({
            files: [
                ...this.state.files,
                ...map((file, i) => ({
                    image: newFiles[i],
                    id: uniqid()
                }), newFiles)
            ]
        });
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

        this.props.onFilesUpload(this.getClearFiles(files));

        this.setState({
            files
        });
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
                            const imagePreviewUrl = URL.createObjectURL(file.image);

                            return <Draggable key={file.id} draggableId={file.id} index={index}>
                                {provided => (
                                    <div
                                        ref={provided.innerRef}
                                        className={classes.fileItem}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={provided.draggableProps.style}
                                    >
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
