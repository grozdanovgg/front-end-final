import * as firebase from 'firebaseApp';
import 'firebaseAuth';
import 'firebaseDb';
export let Database = (function () {
    const config = {
        apiKey: "AIzaSyBLuZZrWSV6mrJOtQ-itrI0pcZgmZ1Rk7k",
        authDomain: "front-end-final.firebaseapp.com",
        databaseURL: "https://front-end-final.firebaseio.com",
        projectId: "front-end-final",
        storageBucket: "front-end-final.appspot.com",
        messagingSenderId: "35565995374"
    };

    let app = firebase.initializeApp(config);

    const dbRef = app.database();
    const auth = app.auth();

    function addNewUser(userObj) {
        if (!userObj.uid) {
            toastr.error('No user id passed!');
            return Promise.reject('No user id passed!');
        } else {
            return dbRef.ref('users/' + userObj.uid)
                .set(userObj)
                .then(success => toastr.success(`User ${userObj.email} added/updated`))
                .catch(error => toastr.error(error.message));
        }
    }

    function addCategory(categoryObj) {
        console.log(categoryObj);
        if (!categoryObj.href) {
            toastr.error('No category name passed!');
            return Promise.reject('No category name passed!');
        } else {
            return dbRef.ref('categories/' + categoryObj.href)
                .set(categoryObj)
                .then(success => toastr.success(`Category ${categoryObj.href} added/updated`))
                .catch(error => toastr.error(error.message));
        }
    }

    function removeCategory(categoryHref) {

        console.log(categoryHref);
        return dbRef.ref(`categories/${categoryHref}`)
            .remove();
    }

    function getCategory(categoryHref) {
        return dbRef.ref(`categories/${categoryHref}`)
            .once('value')
            .then(response => {
                return response.val();
            });
    }

    function getAllCategories() {
        return dbRef.ref('categories/')
            .once('value')
            .then(response => {
                if (!response.val()) {
                    return [];
                }
                console.log(response.val());
                return response.val();
            });
    }

    function addPost(postObj, categoryHref) {
        console.log(postObj);
        if (!postObj.href) {
            toastr.error('No post title passed!');
            return Promise.reject('No post title passed!');
        } else {
            dbRef.ref(`recent-posts/${postObj.href}`)
                .set(postObj);
            return dbRef.ref(`categories/${categoryHref}/posts/${postObj.href}`)
                .set(postObj)
                .then(success => toastr.success(`Post ${postObj.href} added/updated`))
                .catch(error => toastr.error(error.message));
        }
    }
    function getAllPosts(categoryHref) {
        return dbRef.ref(`categories/${categoryHref}/posts`)
            .once('value')
            .then(response => {
                return response.val();
            });
    }

    function getRecentPosts() {
        return dbRef.ref('recent-posts')
            .once('value')
            .then(response => {
                return response.val();
            });
    }

    function addComment(commentObj, postObj) {
        console.log(commentObj);
        console.log(postObj);

        return dbRef.ref(`categories/${postObj.categoryHref}/posts/${postObj.href}/comments/${commentObj.href}`)
            .set(commentObj)
            .then(success => toastr.success(`Comment ${postObj.href} added`))
            .catch(error => toastr.error(error.message));
    }
    function getAllComments(post) {
        console.log(post);
        return dbRef.ref(`categories/${post.categoryHref}/posts/${post.href}/comments`)
            .once('value')
            .then(response => {
                if (response) {
                    return response.val();
                }
                return [];
            });
    }
    function addUserProperty(property, value) {
        const user = app.auth().currentUser;

        if (!user) {
            console.log('No user logged in, yet');
            return;
        }
        dbRef.ref('users/' + user.uid + '/' + property)
            .set(value)
            .then(success => toastr.success(`${property} set`))
            .catch(error => toastr.error(error.message));
    }

    function removeUser(uid) {
        console.log(uid);
        return dbRef.ref('users/' + uid)
            .set(null);
    }

    function getUser() {
        const user = app.auth().currentUser;
        if (!user) {
            console.log('No user logged in, yet');
            return;
        }
        return dbRef.ref('users/' + user.uid);
    }

    function getProperty(property) {
        const user = app.auth().currentUser;
        if (!user) {
            console.log('No user logged in, yet');
            return;
        }
        return dbRef.ref('users/' + user.uid)
            .once('value')
            .then(response => response.val().property);
    }


    let db = {
        addNewUser: addNewUser,
        addUserProperty: addUserProperty,
        removeUser: removeUser,
        getUser: getUser,
        getProperty: getProperty,
        addCategory: addCategory,
        removeCategory: removeCategory,
        getCategory: getCategory,
        getAllCategories: getAllCategories,
        addPost: addPost,
        getAllPosts: getAllPosts,
        addComment: addComment,
        getAllComments: getAllComments,
        app: app
    };
    return db;
})();