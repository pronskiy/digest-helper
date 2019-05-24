function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Saves options to localStorage.
function save_options() {
    set(STORAGE_KEY, JSON.stringify({}));
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var storage;
    get(STORAGE_KEY, function(obj){
        storage = JSON.parse(obj);
        console.log(storage);

        var content = "";
        for (var k in storage.added) {
            console.log(storage.added[k]);
            var sp = '________________________________________________________________________________________';
            content +=
                '<tr>' +
                    '<td>' + storage.added[k].url + '</td>' +
                    '<td>' + storage.added[k].title + '</td>' +
                    '</tr>';
        }
        var table = document.getElementById("links1");
        table.innerHTML = content;

        var content = "";
        for (var k in storage.ignore) {
            console.log(storage.ignore[k]);
            var sp = '________________________________________________________________________________________';
            content +=
                '<tr>' +
                    '<td>' + storage.ignore[k].url + '</td>' +
                    '<td>' + storage.ignore[k].title + '</td>' +
                    '</tr>';
        }
        var table = document.getElementById("links2");
        table.innerHTML = content;
    });
}
document.addEventListener('DOMContentLoaded', restore_options, false);
document.querySelector('#clean').addEventListener('click', save_options);