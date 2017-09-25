import $ from 'jquery';
import { templater } from '../utils/templater.js';

const homeController = {
    get() {
        templater.get('home')
            .then(template => {
                $('#contents').html(template());
                // toastr.success("Welcome home!");
            });
    }
};

export { homeController };