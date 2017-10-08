import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from 'database';
import { Data } from 'data';
import { stringToHref } from '../utils/stringToHref.js';

const blogController = {
    get(params) {
        const user = Database.app.auth().currentUser;
        if (params) { // Post
            if (params.category && params.post) {
            } else { // Category
                Database.getCategory(params.category)
                    .then(categoryHref => {
                        const data = Database.getAllPosts(categoryHref)
                            .then((posts) => {
                                console.log(posts);
                            });


                        Normalizer.standard('blog/category', { user, data });
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