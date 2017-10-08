import $ from 'jquery';
import { Data } from 'data';
// import { SideBar } from '../data/sidebarClass.js';
import { Database } from '../data/database.js';
import { templater } from '../utils/templater.js';
// import { hashHistory } from '../utils/hasher.js';
import 'toastr';
import { Normalizer } from '../utils/template-normalizer.js';
import { stringToHref } from '../utils/stringToHref.js';

toastr.options = {
    "positionClass": "toast-bottom-center",
};

// Listens for changes in logged in user
// Sets sign in/out buttons appropriately
Database.app.auth()
    .onAuthStateChanged(user => {
        toggleButtons(user);
    });

class User {
    constructor(email, displayName, uid, token) {
        this.email = email;
        this.displayName = displayName;
        this.uid = uid;
        this.token = token;
    }
}

function register() {
    const $email = $("#input-email").val();
    const $password = $("#input-password").val();
    let $displayName = $('#input-displayname').val();
    if (!$displayName) {
        $displayName = utils.parseDisplayName($email);
    }

    Database.app.auth().createUserWithEmailAndPassword($email, $password)
        .then(authUser => {
            const user = new User(authUser.email, $displayName, authUser.uid, authUser.Yd);
            Database.addNewUser(user);
            usersController.updateUser(authUser, { displayName: $displayName });
            Data.setLocalStorage(user);

            toastr.success(`User ${user.email} created successfully!`);
            // usersController.closeForm();
        })
        .catch(error => {
            toastr.error(error.message);
        });
}

function login() {
    const $email = $("#input-email").val();
    const $password = $("#input-password").val();
    Database.app.auth().signInWithEmailAndPassword($email, $password)
        .then(response => {
            // Check if we need local storage for users at all
            Data.setLocalStorage(response);
            toastr.success(`User ${response.email} logged in successfully!`);
            // usersController.closeForm();
            location.href = '';
        })
        .catch(error => {
            toastr.error(error.message);
            location.href = '/#!login';
        });
}

function toggleButtons(user) {
    if (user) {
        let displayName = user.displayName;
        if (displayName) {
            if (displayName.length > 13) {
                displayName = user.displayName.substr(0, 10) + '...';
            }
        }
        $('#nav-account').addClass('hidden');
        $('#nav-user').removeClass('hidden').html(`<a class="nav-link" href="#!user">${displayName}</a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li class="dropdown-item">
                <a href="#!logout">Logout</a>
            </li>
        </ul>`);

        toastr.success(`Hi, ${user.displayName}!`);
    } else {
        // $('#signup').removeClass('hidden');
        // $('#signin').removeClass('hidden');
        // $('#user').addClass('hidden');
        // $('#logout').addClass('hidden');
        // $('#account').addClass('hidden');
        toastr.success("Add and track your favourite currencies", "Register, it's cool");
    }
}

function deleteUser() {
    const authUser = Database.app.auth().currentUser;
    const uid = authUser.uid;
    authUser.delete();
    Database.removeUser(uid)
        .then(() => {
            toastr.warning('User deleted. Redirecting.');
            location.href = '/#!home';
        });
}


const usersController = {
    get() {
        const user = Database.app.auth().currentUser;

        Database.getAllCategories()
            .then((categories) => {
                console.log(categories);
            });

        Normalizer.standard('user/user', { user })
            .then(() => {
                $('#savebutton').on('click', () => {
                    const properties = {
                        displayName: $('#nameinput').val(),
                        email: $('#emailnput').val(),
                        password: $('#passwordinput').val()
                    }
                    const authUser = Database.app.auth().currentUser;
                    authUser.updateProfile(properties)
                        .then(() => toastr.success('User updated'));
                });

                $('#deletebutton').on('click', () => {
                    deleteUser();
                });
            })
            .then(() => {
                const adminEmail = 'admin@admin.admin';
                const userEmail = localStorage.getItem('email');
                if (userEmail === adminEmail) {
                    templater.get('user/admin-console')
                        .then(template => {

                            Database.getAllCategories()
                                .then((categoriesObj) => {
                                    const categoriesNames = Object.keys(categoriesObj);
                                    $('#admin-console').html(template({ categoriesNames }));
                                });
                        })
                        .then(() => {
                            $('#add-category-button').on('click', () => {
                                const categoryObj = {
                                    title: $('#category-name').val(),
                                    description: $('#category-description').val(),
                                    href: stringToHref($('#category-name').val())
                                };
                                Database.addCategory(categoryObj);
                            });
                            $('#delete-category-button').on('click', () => {
                                const categoryHref = stringToHref($('#category-name').val());
                                Database.removeCategory(categoryHref);
                            });
                        });
                }
            })
            .catch(error => toastr.error(error.message));
    },

    signup() {
        Normalizer.standard('user/register')
            .then(template => {
                $('#main-root').html(template);
                $('#register').on('click', (event) => {
                    event.stopPropagation();
                    register();
                });
            });
    },

    signin() {
        Normalizer.standard('user/login')
            .then(template => {
                $('#main-root').html(template);
                $('#login').on('click', (event) => {
                    event.stopPropagation();
                    login();
                });
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

};

const utils = {
    parseDisplayName(email) {
        const parsed = email.substring(0, email.indexOf('@'));
        return parsed;
    },
};

export { usersController };