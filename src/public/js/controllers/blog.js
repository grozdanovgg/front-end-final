import $ from 'jquery';
import dt from 'datatables';
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
        console.log(user);
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
                    const categoryObj = data[1];
                    const recentPostsObj = data[2];
                    const archivePostsObj = data[3];
                    const recentCommentsObj = data[4];
                    const posts = sortByObjKey(postsObj, 'date', 'descending');
                    const recentPosts = sortByObjKey(recentPostsObj, 'date', 'descending').slice(0, 5);
                    const archivePosts = sortByObjKey(archivePostsObj, 'date', 'descending').slice(5, 11);
                    const recentComments = sortByObjKey(recentCommentsObj, 'date', 'descending').slice(0, 5);
                    // const currentPost = findObjByHref(params.post, posts);
                    const currentPost = postsObj[params.post];

                    refreshComments(user, categoryObj, currentPost, recentPosts, archivePosts, recentComments);
                });
            } else { // Category
                data.then((data) => {
                    const postsObj = data[0];
                    const categoryObj = data[1];
                    const recentPostsObj = data[2];
                    const archivePostsObj = data[3];
                    const recentCommentsObj = data[4];
                    const posts = sortByObjKey(postsObj, 'date', 'descending');
                    const recentPosts = sortByObjKey(recentPostsObj, 'date', 'descending').slice(0, 5);
                    const archivePosts = sortByObjKey(archivePostsObj, 'date', 'descending').slice(5, 11);
                    const recentComments = sortByObjKey(recentCommentsObj, 'date', 'descending').slice(0, 5);

                    Normalizer.standard('blog/category', { user, posts, categoryObj, recentPosts, archivePosts, recentComments })
                        .then(() => {
                            console.log($('#posts-table'));
                            $('#posts-table').DataTable({
                                searching: false,
                                ordering: false,
                                responsive: true,
                                lengthChange: false,
                                pageLength: 2,
                                pagingType: 'numbers',
                                language: { info: 'Page _PAGE_ of _PAGES_' },
                            });
                        });
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
                    Normalizer.standard('blog/blog', { user, categories });
                });
        }
    }
};

export { blogController };