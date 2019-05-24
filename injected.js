var result = {};
if (document.location.href.search("feedly.com/i/subscription/feed") >= 0) {
    result = {
        url: document.querySelector('div.entryHeader a').getAttribute("href"),
        title: document.querySelector('div.entryHeader a.title').textContent,
        description: ""
    };

    if (document.location.href.search("phpdeveloper.org") >= 0) {
        result.description = document.querySelector('div.entryBody div.content').innerHTML.trim();
        var url = result.description.substring(result.description.lastIndexOf("Link: ") + 6);
        if (url.indexOf('http') >= 0) {
            result.url = url;
        }
    }

} else if (document.location.href.search("phpdeveloper.org") >= 0) {
    result = {
        url: document.querySelector('span.comment_count a').getAttribute("href"),
        title: document.querySelector('div.news_item a.title').textContent,
        description: document.querySelector('div.news_item div.story').innerHTML.trim()
    };
}
result;