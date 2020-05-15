console.log( "digest ready!" );
//
// MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//
// var observer = new MutationObserver(function(mutations, observer) {
//   var link = {
//     url: $('div.entryHeader a')[0] ? $('div.entryHeader a')[0].href : $('div.entryHeader a').href
//   };
//   chrome.extension.sendRequest(link, function(response) {
//     console.log(response);
//   });
// });
//
// $(function() {
//   console.log( "ready!" );
//   setTimeout(function() {
//     console.log("onload");
//     // define what element should be observed by the observer
//     // and what types of mutations trigger the callback
//     observer.observe(document.querySelector('#floatingEntry'), {
//       subtree: true,
//       attributes: false,
//       childList: true
//     });
//
//   }, 3000);
//
// });

const rowCLick = function (event) {
  chrome.runtime.sendMessage({
    from: 'php-digest',
    subject: 'addLink',
    linkObj: {
      url: this.parentElement.children[3].children[0].href,
      title: this.parentElement.children[3].children[0].text,
      description: ""
    }
  });

  event.stopPropagation();
};

function _setLink(linkObj) {
  if (undefined === storage[linkObj.url]) {
    storage[linkObj.url] = linkObj;
  }
  localStorage.digest = JSON.stringify(storage);
  console.log('ls: ', localStorage.digest);
}

function addButtons() {

  // Leftnav__dock LeftnavDock
  // <button class="LeftnavDock__button tertiary button-icon-only" type="button"></button>


  const save_button = document.createElement('button');
  save_button.setAttribute('title', "Save to digest");
  save_button.setAttribute('type', "button");
  save_button.setAttribute('class', "php-digest-add-button");
  // save_button.addEventListener('click', rowCLick);
  // document.querySelector('div.list-entries div.entry.unread').prepend(save_button);

  const linkRows = document.querySelectorAll('div.list-entries div.entry.unread');

  linkRows.forEach(function(linkRow) {
    let buttonClone = save_button.cloneNode(true);
    buttonClone.addEventListener('click', rowCLick);
    linkRow.prepend(buttonClone);
  });
}

(function() {
  'use strict';

  setTimeout(function(){
    run();
  }, 5000);

  function run() {
    const add_button = document.createElement('button');
    add_button.setAttribute('title', "Add buttons");
    add_button.setAttribute('type', "button");
    add_button.setAttribute('class', "");
    add_button.textContent = "+ digest buttons"
    add_button.addEventListener('click', function(){
      addButtons();
    });
    document.querySelector('#topHeaderBarFX div.container').append(add_button);
  }
})();
