var linkObj = {
    title: document.title,
    url: document.location.href,
    description: ""
};

function copyToClip(str) {
    function listener(e) {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}

if (document.location.href.search("wiki.php.net/rfc") >= 0) {
    linkObj.title = document.querySelector('h1.sectionedit1').innerHTML
        .trim()
        .replace('PHP RFC:', '[RFC]');

} else
if (document.location.href.search("github.com/") >= 0) {
    const colonPos = document.title.indexOf(":");
    title = document.title.slice(0, colonPos);
    description = document.title.slice(colonPos + 2);

    linkObj.title = title;
    linkObj.description = description;

} else
if (document.location.href.search("laravel-news.com") >= 0) {
    linkObj.title = linkObj.title.replace(' | Laravel News', '');
} else
if (document.location.href.search("habr.com") >= 0) {
    linkObj.title = document.title.slice(0, document.title.indexOf("/"));
} else
if (document.location.href.search("symfony.com/blog/a-week-of-symfony") >= 0) {
    linkObj.title = document.title
        .replace('(Symfony Blog)', '')
        .replace('A Week of', 'Неделя')
        .replace('April', 'апреля')
        .replace('May', 'мая')
        .replace('June', 'июня')
        .replace('July', 'июля')
        .trim()
    ;
} else
if (document.location.href.search("phpdeveloper.org") >= 0) {
    linkObj = {
        url: document.querySelector('span.comment_count a').getAttribute("href"),
        title: document.querySelector('div.news_item a.title').textContent,
        description: document.querySelector('div.news_item div.story').innerHTML.trim()
    };
}

// copyToClip('<table><tr>' +
//     '<td>' + linkObj.url + "</td>\t" +
//     "<td>" + linkObj.title + "</td>\t" +
//     "<td>" + linkObj.description + '</td>' +
//     '</tr></table>');

copyToClip(
    '<li><a href="' + linkObj.url + '">'+ linkObj.title + '</a> — '+ linkObj.description + '</li>'
);

linkObj;
