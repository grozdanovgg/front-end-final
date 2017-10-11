import Navigo from 'navigo';
import { homeController } from 'homeController';
import { blogController } from 'blogController';
import { usersController } from 'usersController';

var root = null;
var useHash = true;
var hash = '#!';

var router = new Navigo(root, useHash, hash);

router.on({
    '/': () => { router.navigate('home'); },
    '/#': () => { router.navigate('home'); },
    'home': homeController.get,
    'blog': blogController.get,
    'blog/:category': (params) => blogController.get(params),
    'blog/:category/:post': (params) => blogController.get(params),
    'register': usersController.signup,
    'login': usersController.signin,
    'logout': usersController.logout,
    'user': usersController.get
}).notFound(query => {
    // called when there is path specified but
    // there is no route matching
    toastr.info(`Router couldn't find the path: ${query}`);
}).resolve();

