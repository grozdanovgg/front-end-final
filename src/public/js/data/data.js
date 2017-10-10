import $ from 'jquery';

export let Data = (function Data() {

    const LOCALSTORAGE_USERNAME_KEY = "email";
    const LOCALSTORAGE_USERID_KEY = "uid";
    const LOCALSTORAGE_USERTOKEN_KEY = "token";
    const LOCALSTORAGE_DISPLAYNAME_KEY = "displayName";

    var dataObj = {
        setLocalStorage: function (user) {
            localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, user.email);
            localStorage.setItem(LOCALSTORAGE_USERID_KEY, user.uid);
            localStorage.setItem(LOCALSTORAGE_USERTOKEN_KEY, user.Yd);
            localStorage.setItem(LOCALSTORAGE_DISPLAYNAME_KEY, user.displayName);
        }
    };


    return dataObj;
})();