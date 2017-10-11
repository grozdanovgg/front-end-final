import $ from 'jquery';
import { templater } from '../utils/templater.js';
import { Normalizer } from '../utils/template-normalizer.js';
import { Database } from '../data/database.js';
import { sortByObjKey } from '../utils/sort-obj-by-key.js';


const homeController = {
    get() {
        Promise.all([
            Database.getRecentPosts(),
            Database.getArchivePosts(),
            Database.getRecentComments()
        ])
            .then((data) => {
                const recentPostsObj = data[0];
                const recentPosts = sortByObjKey(recentPostsObj, 'date', 'descending').slice(0, 5);
                const archivePostsObj = data[1];
                const archivePosts = sortByObjKey(archivePostsObj, 'date', 'descending').slice(5, 11);
                const recentCommentsObj = data[2];
                const recentComments = sortByObjKey(recentCommentsObj, 'date', 'descending').slice(0, 5);
                Normalizer.home({ recentPosts, archivePosts, recentComments });
            });
    }
};

export { homeController };