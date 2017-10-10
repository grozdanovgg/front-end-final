const lengthOfObject = {
    do() {
        Handlebars.registerHelper("lengthOfObject", function (obj) {
            if (!obj) {
                return `0 Comments`;
            }
            console.log(obj);
            const length = Object.keys(obj).length;
            if (length === 1) {
                return `${length} Comment`;
            }
            return `${length} Comments`;
        });
    }
};

export { lengthOfObject };