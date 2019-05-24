function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Saves options to localStorage.
function save_options() {
    localStorage["digest"] = JSON.stringify({});
    document.getElementById("links").innerHTML = "";
}

function process_link_obj(link_obj)
{
    const hostname = extractHostname(link_obj.url);
    let title = link_obj.title;
    let description = link_obj.description;
    title = title.replace(' - ' + hostname, '');
    const fullTitle = title;

    switch (hostname) {
        case 'github.com':
            const colonPos = title.indexOf(":");
            title = fullTitle.slice(0, colonPos);
            description = fullTitle.slice(colonPos + 1);
            break;
    }

    return {"url": link_obj.url, title, description};
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var digest = JSON.parse(localStorage["digest"]);
    var content = "";
    for (var k in digest) {
        console.log(digest[k]);
        const link_obj = process_link_obj(digest[k]);
        var sp = '________________________________________________________________________________________';
        content +=
            '<tr>' +
                '<td>' + link_obj.url + '</td>' +
                '<td>' + link_obj.title + '</td>' +
                '<td>' + htmlEntities(link_obj.description).replace(/&lt;blockquote&gt;/g, sp).replace(/&lt;\/blockquote&gt;/g, sp) + '</td>' +
            '</tr>';
    }
    var table = document.getElementById("links");
    console.log("digest", digest);
    table.innerHTML = content;
}
document.addEventListener('DOMContentLoaded', restore_options, false);
document.querySelector('#clean').addEventListener('click', save_options);


function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}
