const pattern = /^([0-9 +()-]+|\d+)$/i;

export default (value, options = {}, text = '') => {
    const isValid = pattern.test(value);

    if (!isValid) {
        return options.text || text;
    }
};
