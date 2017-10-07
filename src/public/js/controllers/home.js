import $ from 'jquery';
import { templater } from '../utils/templater.js';

const homeController = {
    get() {
        Promise.all([
            templater.get('home/home'),
            templater.get('home/home-carousel'),
            templater.get('home/home-bubble'),
            templater.get('shared/footer-recent'),
            templater.get('shared/footer-archived')
        ])
            .then(templates => {
                $('#main-root').html(templates[0]());
                $('#carousel-container').html(templates[1]());
                $('#secondary-root').html(templates[2]());
                $('#footer-recent').html(templates[3]());
                $('#footer-archived').html(templates[4]());
                // toastr.success("Welcome home!");
            })
            .then(() => {
                const body = $('body').removeClass('background-standard');
                body.addClass('background-home');
                const header = $('header').removeClass('header-standard');
                header.addClass('header-home');
            }
            );
    }
};

export { homeController };