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
if (document.location.href.search("phpdeveloper.org") >= 0) {
    linkObj = {
        url: document.querySelector('span.comment_count a').getAttribute("href"),
        title: document.querySelector('div.news_item a.title').textContent,
        description: document.querySelector('div.news_item div.story').innerHTML.trim()
    };
}

copyToClip('<table><tr><td>' + linkObj.url + "</td>\t<td>" + linkObj.title + '</td></tr></table>');

linkObj;