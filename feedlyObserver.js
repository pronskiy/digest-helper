
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
  var link = {
    url: $('div.entryHeader a')[0] ? $('div.entryHeader a')[0].href : $('div.entryHeader a').href
  };
  chrome.extension.sendRequest(link, function(response) {
    console.log(response);
  });
});

$(function() {
  console.log( "ready!" );
  setTimeout(function() {
    console.log("onload");
    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document.querySelector('#floatingEntry'), {
      subtree: true,
      attributes: false,
      childList: true
    });

  }, 3000);

});