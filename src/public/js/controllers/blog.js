import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from '../data/database.js';
import { Data } from 'data';
import { stringToHref } from '../utils/stringToHref.js';
import { dateFormatter } from '../utils/helper-date-formatter.js';
import { stringTrim } from '../utils/helper-string-trim.js';
import { lengthOfObject } from '../utils/helper-length-of-object.js';

const blogController = {
    get(params) {
        const user = Database.app.auth().currentUser;
        if (params) { // Common
            const data = Promise.all([
                Database.getAllPosts(params.category),
                Database.getCategory(params.category),
            ]);
            if (params.category && params.post) { // Post
                data.then((data) => {
                    const posts = data[0];
                    const category = data[1];

                    const currentPost = posts[params.post];
                    console.log(posts);
                    console.log(params.post);
                    console.log(currentPost);

                    Database.getAllComments(currentPost)
                        .then(comments => {
                            console.log(comments);
                            // Call helper to be avalable in template
                            dateFormatter.do();
                            stringTrim.do();
                            lengthOfObject.do();
                            Normalizer.standard('blog/post', { user, comments, currentPost, category })
                                .then(() => {
                                    const authUser = Database.app.auth().currentUser;
                                    $('#add-comment-button').on('click', () => {
                                        const date = Date.now();
                                        console.log('DATE: ' + date);
                                        const commentObj = {
                                            text: $('#post-text').val(),
                                            href: date,
                                            author: authUser.displayName,
                                            date: date,
                                            post: currentPost
                                        };
                                        console.log(commentObj);
                                        Database.addComment(commentObj, currentPost);
                                    });
                                });
                        })
                });
            } else { // Category
                data.then((data) => {
                    const posts = data[0];
                    const category = data[1];

                    console.log(posts);
                    console.log(category);
                    // Call helper to be avalable in template
                    dateFormatter.do();
                    stringTrim.do();
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