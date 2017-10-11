export function findObjByHref(href, myArray) {
    console.log(href);
    console.log(myArray);
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].href === href) {
            return myArray[i];
        }
    }
}