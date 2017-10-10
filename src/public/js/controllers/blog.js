import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from '../data/database.js';
import { Data } from 'data';
import { stringToHref } from '../utils/stringToHref.js';
import { dateFormatter } from '../utils/helper-date-formatter.js';
import { stringTrim } from '../utils/helper-string-trim.js';
import { lengthOfObject } from '../utils/helper-length-of-object.js';
import { findObjByHref } from '../utils/find-obj-by-href.js';
import { refreshComments } from '../utils/comments-refresh.js';
import { sortByObjKey } from '../utils/sort-obj-by-key.js';


const blogController = {
    get(params) {
        const user = Database.app.auth().currentUser;
        if (params) { // Common
            const data = Promise.all([
                Database.getAllPosts(params.category),
                Database.getCategory(params.category),
                Database.getRecentPosts(),
                Database.getArchivePosts(),
                Database.getRecentComments()
            ]);

            // Call helper to be avalable in template
            dateFormatter.do();
            stringTrim.do();
            lengthOfObject.do();
            if (params.category && params.post) { // Post
                data.then((data) => {
                    const postsObj = data[0];
                    const posts = sortByObjKey(postsObj, 'date', 'descending');
                    const category = data[1];
                    const recentPostsObj = data[2];
                    const recentPosts = sortByObjKey(recentPostsObj, 'date', 'descending').slice(0, 5);
                    const archivePostsObj = data[3];
                    const archivePosts = sortByObjKey(archivePostsObj, 'date', 'descending').slice(5, 11);
                    const recentCommentsObj = data[4];
                    const recentComments = sortByObjKey(recentCommentsObj, 'date', 'descending').slice(0, 5);
                    // const currentPost = findObjByHref(params.post, posts);
                    const currentPost = postsObj[params.post];
                    console.log(recentComments);
                    refreshComments(user, category, currentPost, recentPosts, archivePosts, recentComments);
                });
            } else { // Category
                data.then((data) => {
                    console.log(data);
                    const postsObj = data[0];
                    const posts = sortByObjKey(postsObj, 'date', 'descending');
                    const category = data[1];
                    const recentPostsObj = data[2];
                    const recentPosts = sortByObjKey(recentPostsObj, 'date', 'descending').slice(0, 5);
                    const archivePostsObj = data[3];
                    const archivePosts = sortByObjKey(archivePostsObj, 'date', 'descending').slice(5, 11);
                    const recentCommentsObj = data[4];
                    const recentComments = sortByObjKey(recentCommentsObj, 'date', 'descending').slice(0, 5);
                    console.log(recentComments);
                    Normalizer.standard('blog/category', { user, posts, category, recentPosts, archivePosts, recentComments });
                });
            }
        }
        else { // All Categories
            Promise.all([
                Database.getAllCategories(),
                Database.getRecentPosts()
            ])
                .then((data) => {
                    const categories = data[0];
                    const recentPosts = data[1];
                    Normalizer.standard('blog/blog', { user, categories, recentPosts });
                });
        }
    }
};

export { blogController };