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

    // function addNewCompany(companyObj) {
    //     if (!companyObj.Symbol) {
    //         toastr.error('No company symbol passed!');
    //         return Promise.reject('No company symbol passed!');
    //     } else {
    //         return dbRef.ref('companies/' + companyObj.Symbol)
    //             .set(companyObj)
    //             //.then(success => toastr.success(`Company ${companyObj.Symbol} added/updated`))
    //             .catch(error => toastr.error(error.message));
    //     }
    // }

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
            return dbRef.ref(`categories/${categoryHref}/posts/${postObj.href}`)
                .set(postObj)
                .then(success => toastr.success(`Post ${postObj.href} added/updated`))
                .catch(error => toastr.error(error.message));
        }
    }

    // function removePost(postObj) {
    //     return dbRef.ref('categories/' + category.title)
    //         .remove();
    // }

    function getAllPosts(categoryHref) {
        return dbRef.ref(`categories/${categoryHref}`).child('posts')
            .once('value')
            .then(response => {
                if (!response.val()) {
                    return [{ title: 'Post1', text: 'Post text 1' }, { title: 'Post2', text: 'Post text 2' }];
                }
                console.log(response.val());
                return response.val();
            });
    }


    // function addNewSymbol(symbol) {
    //     return dbRef.ref('symbols/' + symbol)
    //         .set(true)
    //         //.then(success => toastr.success(`Symbol ${symbol} added/updated`))
    //         .catch(error => toastr.error(error.message));
    // }

    // Use to add favorites in bulk
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

    // // Use to edit property
    // // Use to edit property
    // function addFavorite(symbol) {
    //     const user = app.auth().currentUser;
    //     if (!user) {
    //         console.log('No user logged in, yet');
    //         return;
    //     }
    //     return dbRef.ref('users/' + user.uid + '/favorites/' + symbol)
    //         .set(symbol);
    // }

    // function removeFavorite(symbol) {
    //     const user = app.auth().currentUser;
    //     if (!user) {
    //         console.log('No user logged in, yet');
    //         return;
    //     }
    //     return dbRef.ref('users/' + user.uid + '/favorites/' + symbol)
    //         .remove();
    // }

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

    // function getCompany(symbol) {
    //     return dbRef.ref('companies/' + symbol)
    //         .once('value');
    // }

    // function getSymbol(symbol) {
    //     return dbRef.ref('symbols/' + symbol)
    //         .once('value');
    // }

    // function getAllCompanies() {
    //     return dbRef.ref('companies/')
    //         .once('value');
    // }

    // function getAllSymbols() {
    //     return dbRef.ref('symbols/')
    //         .once('value');
    // }

    let db = {
        addNewUser: addNewUser,
        // addNewCompany: addNewCompany,
        // addNewSymbol: addNewSymbol,
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
        // getFavorites: getFavorites,
        // getCompany: getCompany,
        // getSymbol: getSymbol,
        // getAllCompanies: getAllCompanies,
        // getAllSymbols: getAllSymbols,
        // loadCompanies: loadCompanies,
        // loadSymbols: loadSymbols,
        app: app
    };
    return db;
})();