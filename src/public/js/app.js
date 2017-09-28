import Navigo from 'navigo';
import { homeController } from 'homeController';
// import { usersController } from 'usersController';

var root = null;
var useHash = true;
var hash = '#!';

var router = new Navigo(root, useHash, hash);

router.on({
    '/': () => { router.navigate('home'); },
    '/#': () => { router.navigate('home'); },
    'home': homeController.get,
    // 'signup': usersController.get,
}).notFound(query => {
    // called when there is path specified but
    // there is no route matching
    toastr.info(`Router couldn't find the path: ${query}`);
}).resolve();