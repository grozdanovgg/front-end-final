import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';

const homeController = {
    get() {
        Normalizer.home();
    }
};

export { homeController };