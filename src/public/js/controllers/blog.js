import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from '../data/database.js';
import { Data } from 'data';
import { stringToHref } from '../utils/stringToHref.js';
import { dateFormatter } from '../utils/helper-date-formatter.js';

const blogController = {
    get(params) {
        const user = Database.app.auth().currentUser;
        if (params) { // Post
            if (params.category && params.post) {
            } else { // Category
                Promise.all([
                    Database.getAllPosts(params.category),
                    Database.getCategory(params.category),
                ])
                    .then((data) => {
                        const posts = data[0];
                        const category = data[1];
                        // Call helper to be avalable in template
                        dateFormatter.do();
                        Normalizer.standard('blog/category', { user, posts, category });
                    });
            }
        }
        else { // All Categories
            Database.getAllCategories()
                .then((categories) => {
                    Normalizer.standard('blog/blog', { user, categories });
                });
        }
    }
};

export { blogController };