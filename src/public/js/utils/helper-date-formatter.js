import moment from 'moment';


const DateFormats = {
    short: "MMMM DD, YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};

const dateFormatter = {
    do() {
        Handlebars.registerHelper("formatDate", function (datetime, format) {
            console.log(moment)
            if (moment) {
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;

                console.log(moment(datetime).format(format));
                return moment(datetime).format(format);
            }
            else {
                return datetime;
            }
        });
    }
};

export { dateFormatter };