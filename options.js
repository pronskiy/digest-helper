function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Saves options to localStorage.
function save_options() {
    localStorage["digest"] = JSON.stringify({});
    document.getElementById("links").innerHTML = "";
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var digest = JSON.parse(localStorage["digest"]);
    var content = "";
    for (var k in digest) {
        console.log(digest[k]);
        var sp = '________________________________________________________________________________________';
        content +=
            '<tr>' +
                '<td>' + digest[k].url + '</td>' +
                '<td>' + digest[k].title + '</td>' +
                '<td>' + htmlEntities(digest[k].description).replace(/&lt;blockquote&gt;/g, sp).replace(/&lt;\/blockquote&gt;/g, sp) + '</td>' +
            '</tr>';
    }
    var table = document.getElementById("links");
    console.log("digest", digest);
    table.innerHTML = content;
}
document.addEventListener('DOMContentLoaded', restore_options, false);
document.querySelector('#clean').addEventListener('click', save_options);