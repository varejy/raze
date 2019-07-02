const pattern = value => value >= 1 && value <= 5;

export default (value, options = {}) => {
    const isValid = pattern(value);

    if (!isValid) {
        return options.text || 'Оцените продукт пожалуйста !';
    }
};
