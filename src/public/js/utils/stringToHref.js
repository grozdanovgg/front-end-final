export function stringToHref(string) {
    return string.replace(/\s/g, "-").toLowerCase();
}