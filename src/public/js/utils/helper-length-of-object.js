const lengthOfObject = {
    do() {
        Handlebars.registerHelper("lengthOfObject", function (obj) {
            const length = Object.keys(obj).length;

            if (length === 1) {
                return `${length} Comment`;
            }
            return `${length} Comments`;
        });
    }
};

export { lengthOfObject };