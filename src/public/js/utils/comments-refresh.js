import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from '../data/database.js';
import { sortByObjKey } from '../utils/sort-obj-by-key.js';
export function refreshComments(user, category, currentPost, recentPosts, archivePosts, recentComments) {
    const data = Promise.all([
        Database.getAllComments(currentPost),
        Database.getRecentPosts(),
        Database.getArchivePosts(),
        Database.getRecentComments()
    ])
        .then(data => {
            const comments = data[0];
            const recentPostsObj = data[1];
            const recentPosts = sortByObjKey(recentPostsObj, 'date', 'descending').slice(0, 5);
            const archivePostsObj = data[2];
            const archivePosts = sortByObjKey(archivePostsObj, 'date', 'descending').slice(5, 11);
            const recentCommentsObj = data[3];
            const recentComments = sortByObjKey(recentCommentsObj, 'date', 'descending').slice(0, 5);
            Normalizer.standard('blog/post/post', { user, category, currentPost, recentPosts, archivePosts, recentComments })
                .then(() => {
                    $('#add-comment-button').on('click', () => {
                        const authUser = Database.app.auth().currentUser;
                        if (authUser) {
                            const date = Date.now();
                            const commentObj = {
                                text: $('#post-text').val(),
                                href: date,
                                author: authUser.displayName,
                                date: date,
                                postHref: currentPost.href
                            };
                            Database.addComment(commentObj, currentPost);
                            refreshComments(user, category, currentPost, recentPosts, archivePosts, recentComments);
                        } else {
                            toastr.error('You have to be Logged in to post a comment');
                        }
                    });
                });
        });
}