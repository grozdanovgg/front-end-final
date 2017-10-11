export function stringToHref(string) {
    let href = string
        .replace(/\s/g, "-")
        .replace(/\./g, "-")
        .split(',').join('')
        .split('!').join('')
        .split('?').join('')
        .toLowerCase();
    return href;
}