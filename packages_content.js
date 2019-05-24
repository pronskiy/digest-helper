var storage;

$(function(){
    if ($('div.news_item a.title').text().search("Packagist Latest Releases") >= 0) {

        get(STORAGE_KEY, function(obj){
            storage = JSON.parse(obj) || {};
            //storage = {};
            if (storage.added == undefined) {
                storage.added = {};
            }
            if (storage.ignore == undefined) {
                storage.ignore = {};
            }

            $('div.news_item .story li').each(function(){
                var $this = $(this);
                var $a = $this.find('a')
                var url = $a.attr('href');
                var title = $a.text();
                var description = $(this).text();

                if (storage.added[url] !== undefined) {
                    // Already added
                    $a.before('&#x2714;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    $this.css({'opacity': 0.5});
                } else if (storage.ignore[url] !== undefined) {
                    // grey out
                    $a.before('&nbsp;&nbsp;&nbsp;&#10007;&nbsp;&nbsp;');
                    $this.css({'opacity': 0.5});
                }
                else {
                    $a.addClass('digest-add-link')
                        .attr({
                            'data-url': url,
                            'data-title': title
                        })
                        .before(
                        '<a class="digest-add-link" href="javascript:void()" data-url="'+url+'" data-title="'+title+'">&#x2714;</a>&nbsp;' +
                        '<a class="digest-remove-link" href="javascript:void()" data-url="'+url+'" data-title="'+title+'">&#10008;</a>&nbsp;&nbsp;');
                }
            });
        });
    }
});

function saveStorage(storage){
    set(STORAGE_KEY, JSON.stringify(storage));

}

$( "div.news_item .story" ).on( "click", ".digest-remove-link", function() {
    var $this = $(this);
    toStorage.call($this, 'ignore');
    $this.parent().css({'opacity': 0.5}).find('.digest-add-link:first').replaceWith('&nbsp;&nbsp;');
    return false;
});


$( "div.news_item .story" ).on( "click", ".digest-add-link", function() {
    var $this = $(this);
    toStorage.call($this, 'added');
    $this.parent().css({'opacity': 0.5}).find('.digest-remove-link').replaceWith('&nbsp;&nbsp;');
    if ($this.attr('href') == "javascript:void()")
        return false;
});

function toStorage(type) {
    var $this = this;
    storage[type][$this.attr('data-url')] = {
        url: $this.attr('data-url'),
        title: $this.attr('data-title')
    };
    saveStorage(storage);
}