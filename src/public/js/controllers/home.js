import $ from 'jquery';
import { templater } from '../utils/templater.js';

const homeController = {
    get() {
        Promise.all([
            templater.get('home/home'),
            templater.get('home/home-carousel'),
            templater.get('shared/footer-recent'),
            templater.get('shared/footer-archived')
        ])
            .then(templates => {
                $('#main-root').html(templates[0]());
                $('#carousel-container').html(templates[1]());
                $('#footer-recent').html(templates[2]());
                $('#footer-archived').html(templates[3]());
                // toastr.success("Welcome home!");
            })
            .then(() => {
                const header = $('header').removeClass('background-standard');
                header.addClass('background-home')
            }
            )
    }
};

export { homeController };