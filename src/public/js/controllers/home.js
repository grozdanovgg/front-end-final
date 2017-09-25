import $ from 'jquery';
import { templater } from '../utils/templater.js';

const homeController = {
    get() {
        Promise.all([templater.get('home'), templater.get('shared/footer-recent'), templater.get('shared/footer-archived')])
            .then(templates => {
                $('#main-root').html(templates[0]());
                $('#footer-recent').html(templates[1]());
                $('#footer-archived').html(templates[2]());
                // toastr.success("Welcome home!");
            });
    }
};

export { homeController };