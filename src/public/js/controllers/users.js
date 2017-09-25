import $ from 'jquery';
import { Data } from 'data';
import { SideBar } from '../data/sidebarClass.js';
import { Database } from '../data/database.js';
import { templater } from '../utils/templater.js';
import { hashHistory } from '../utils/hasher.js';
import 'toastr';

toastr.options = {
    "positionClass": "toast-bottom-center",
}

// Listens for changes in logged in user
// Sets sign in/out buttons appropriately
Database.app.auth()
    .onAuthStateChanged(user => {
        usersController.toggleButtons(user)
            // if (!user.isAnonymous) {
            //     let side = new SideBar();
            //     Database.getFavorites().then((favs) => {
            //         const indices = [];
            //         console.log(favs);
            //         favs.forEach(x => indices.push(Data.getIndex(x)));
            //         console.log(indices)
            //         side.callFavorites(indices);
            //     })
            // }
    });

class User {
    constructor(email, displayName, uid, token) {
        this.email = email;
        this.displayName = displayName;
        this.uid = uid;
        this.token = token;
        this.favorites = {};
    }
}

const usersController = {
    get(params) {
        //console.log(`${params.id} is id and ${params.action} is action`);

        templater.get('user').then(template => {
                const user = Database.app.auth().currentUser;
                $('#contents').html(template(user));
                $('#get-favs').on('click', () => {
                    Database.getFavorites()
                        .then(
                            response => {
                                const strRes = response;
                                console.log(strRes);
                                $('#favs').html(strRes);
                            });
                });
                $('#savebutton').on('click', () => {
                    const properties = {
                        displayName: $('#nameinput').val(),
                        email: $('#emailnput').val(),
                        password: $('#passwordinput').val()
                    }
                    console.log(properties);
                    const authUser = Database.app.auth().currentUser;
                    authUser.updateProfile(properties)
                        .then(() => toastr.success('User updated'));

                });
                $('#deletebutton').on('click', () => {
                    usersController.deleteUser();
                });

                // $('#load-companies').on('click', () => Database.loadCompanies());
                // $('#load-symbols').on('click', () => Database.loadSymbols());

                Database.watchFavorites();
                Database.getFavorites()
                    .then(
                        response => {
                            const strRes = response;
                            //console.log(strRes);
                            $('#favs').html(strRes);
                        });
            })
            .catch(error => toastr.error(error.message));
    },


    signup() {
        templater.get('register').then(template => {
            $('#popup').html(template);
            $('#register').on('click', (event) => {
                event.stopPropagation();
                usersController.register();
            });

            usersController.clickOutOfForm();
        });
    },

    signin() {
        templater.get('login').then(template => {
            $('#popup').html(template);
            $('#login').on('click', (event) => {
                event.stopPropagation();
                usersController.login();
            });
            usersController.clickOutOfForm();
        });
    },
    login() {
        const $email = $("#input-email").val();
        const $password = $("#input-password").val();
        Database.app.auth().signInWithEmailAndPassword($email, $password)
            .then(response => {
                // Check if we need local storage for users at all
                Data.setLocalStorage(response);
                toastr.success(`User ${response.email} logged in successfully!`);
                usersController.closeForm();
            })
            .catch(error => {
                toastr.error(error.message);
                location.href = '/#!auth';
            });
    },

    logout() {
        Database.app.auth().signOut()
            .then(() => {
                // Check if we need local storage for users at all
                localStorage.clear();
                toastr.success('Good bye!');
                location.href = '/#!home';
            })
            .catch(error => toastr.error(error.message));
    },

    register() {
        const $email = $("#input-email").val();
        const $password = $("#input-password").val();
        let $displayName = $('#input-displayname').val();
        if (!$displayName) {
            $displayName = utils.parseDisplayName($email);
        }

        Database.app.auth().createUserWithEmailAndPassword($email, $password)
            .then(authUser => {
                // Check if we need local storage for users at all
                // Check if we need to save token in database
                // Check: Were to save display name? Auth or DB?

                const user = new User(authUser.email, $displayName, authUser.uid, authUser.Yd);

                Database.addNewUser(user);
                usersController.updateUser(authUser, { displayName: $displayName });
                Data.setLocalStorage(user);

                toastr.success(`User ${user.email} created successfully!`);
                usersController.closeForm();
            })
            .catch(error => {
                toastr.error(error.message);
            });
    },

    deleteUser() {
        const authUser = Database.app.auth().currentUser;
        const uid = authUser.uid;
        authUser.delete();
        Database.removeUser(uid)
            .then(() => {
                toastr.warning('User deleted. Redirecting.');
                location.href = '/#!home';
            });
    },

    updateUser(user, properties) {
        user.updateProfile(properties);
    },

    toggleButtons(user) {
        if (user) {
            $('#signup').addClass('hidden');
            $('#signin').addClass('hidden');
            $('#user').removeClass('hidden').html(user.displayName);
            $('#logout').removeClass('hidden');
            $('#account').removeClass('hidden');

            templater.get('account-menu')
                .then(template => {
                    $('#account-menu').html(template(localStorage));
                });

            toastr.success(`Hi, ${user.displayName}!`);
        } else {
            $('#signup').removeClass('hidden');
            $('#signin').removeClass('hidden');
            $('#user').addClass('hidden');
            $('#logout').addClass('hidden');
            $('#account').addClass('hidden');
            toastr.success("Add and track your favourite currencies", "Register, it's cool");
        }
    },

    clickOutOfForm() {
        // TODO Make form close on click in top bar?
        $('#popup').click(function(event) {
            const id = $(event.target).attr('id');
            const cls = $(event.target).attr('class');

            if (id === 'login-form' || cls === 'close') {
                usersController.closeForm();
            }
        });
    },

    closeForm() {
        $('#login-form').addClass('hidden');
        // Fix for: get page where we came from
        const back = hashHistory
            .slice().reverse()
            .find(hash => hash !== '!auth' && hash !== '!create' && hash !== '!register' && hash !== '!login')
        if (!back) {
            location.href = '#';
        } else {
            location.href = '#' + back;
        }
    }
}

const utils = {
    parseDisplayName(email) {
        const parsed = email.substring(0, email.indexOf('@'));
        return parsed;
    },
}

export { usersController }