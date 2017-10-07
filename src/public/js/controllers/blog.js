import $ from 'jquery';
import { templater } from '../utils/templater.js';

const blogController = {
    get() {
        Promise.all([
            templater.get('blog/blog'),
            templater.get('blog/blog-header'),
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
                $('#secondary-root').html('');
                const body = $('body').removeClass('background-home');
                body.addClass('background-standard');
                const header = $('header').removeClass('header-home');
                header.addClass('header-standard');
            }
            );
    }
};

export { blogController };