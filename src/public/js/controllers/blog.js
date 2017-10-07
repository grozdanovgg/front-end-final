import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from 'database';
import { Data } from 'data';

const blogController = {
    get() {
        Normalizer.standard('blog/blog')
    }
};

export { blogController };