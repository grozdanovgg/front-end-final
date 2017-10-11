const stringTrim = {
    do() {
        Handlebars.registerHelper("stringTrim", function (string, length) {
            return string.slice(0, length);
        });
    }
};

export { stringTrim };