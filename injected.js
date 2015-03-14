var result = {
    url: document.querySelector('span.comment_count a').getAttribute("href"),
    title: document.querySelector('div.news_item a.title').textContent,
    description: document.querySelector('div.news_item div.story').innerHTML.trim()
};
result;