function request(method, url, options) {
    const headers = options.headers || {};
    const body = options.body || {};

    const promise = new Promise((resolve, reject) => $.ajax({
        url,
        method,
        // Interferes with yahoo query 
        //contentType: 'application/json',
        headers: headers,
        data: JSON.stringify(body),
        success: resolve,
        error: reject
    }));
    return promise;
}

export function get(url, options = {}) {
    return request('GET', url, options);
}

export function post(url, options) {
    return request('POST', url, options);
}

export function put(url, options) {
    return request('PUT', url, options);
}