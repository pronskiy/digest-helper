var STORAGE_KEY = 'digestPackages';
function set(key, value) {
    chrome.extension.sendRequest({storage: key, value: value});
}


function get(key, callback) {
    chrome.extension.sendRequest({storage: key}, function(response) {
        callback(response.storage);
    });
}