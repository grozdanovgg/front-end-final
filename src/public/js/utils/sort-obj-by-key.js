export function sortByObjKey(obj, key, direction) {
    let arr = [];

    const objKeys = Object.keys(obj);
    objKeys.forEach(key => {
        arr.push(obj[key]);
    });
    arr.sort((a, b) => {
        if (direction !== 'descending') {
            return a.date - b.date;
        }
        return b.date - a.date;
    });
    return arr;
}