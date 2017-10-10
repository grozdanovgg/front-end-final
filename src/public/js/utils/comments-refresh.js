import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from '../data/database.js';

export function refreshComments(user, category, currentPost) {
    Database.getAllComments(currentPost)
        .then(comments => {
            Normalizer.standard('blog/post/post', { user, comments, currentPost, category })
                .then(() => {
                    $('#add-comment-button').on('click', () => {
                        const authUser = Database.app.auth().currentUser;
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
                        refreshComments(user, category, currentPost);
                    });
                });
        });
}