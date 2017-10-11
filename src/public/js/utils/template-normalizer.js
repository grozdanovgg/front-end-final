
import $ from 'jquery';
import { templater } from '../utils/templater.js';

const Normalizer = {
    home(data) {
        Promise.all([
            templater.get('home/home'),
            templater.get('home/home-carousel'),
            templater.get('home/home-bubble'),
            templater.get('shared/footer-recent'),
            templater.get('shared/footer-archived')
        ])
            .then(templates => {
                $('.active').removeClass('active');
                $('#nav-home').addClass('active');

                $('#main-root').html(templates[0]());
                $('#carousel-container').html(templates[1]());
                $('#secondary-root').html(templates[2]());
                $('#footer-recent').html(templates[3](data));
                $('#footer-archived').html(templates[4](data));
            })
            .then(() => {
                const body = $('body').removeClass('background-standard');
                body.addClass('background-home');
                const header = $('header').removeClass('header-standard');
                header.addClass('header-home');
            });
    },
    standard(templatePath, data) {
        console.log(templatePath);
        const pathArray = templatePath.split('/');
        const headerName = pathArray[pathArray.length - 2];
        let mainRoot = '';

        for (let i = 0; i < pathArray.length - 1; i += 1) {
            mainRoot += `${pathArray[i]}/`;
        }
        const templateName = pathArray[pathArray.length - 1];
        return Promise.all([
            templater.get(templatePath),
            templater.get(`${mainRoot}${headerName}-header`),
            templater.get('shared/footer-recent'),
            templater.get('shared/footer-archived')
        ])
            .then(templates => {
                $('.active').removeClass('active');
                $(`#nav-${templateName}`).addClass('active');



                $('#main-root').html(templates[0](data));
                $('#carousel-container').html(templates[1](data));
                $('#footer-recent').html(templates[2](data));
                $('#footer-archived').html(templates[3](data));
            })
            .then(() => {
                $('#secondary-root').html('');
                const body = $('body').removeClass('background-home');
                body.addClass('background-standard');
                const header = $('header').removeClass('header-home');
                header.addClass('header-standard');
            });
    }
};

export { Normalizer };