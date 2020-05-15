if (undefined === localStorage.digest) {
  localStorage.digest = JSON.stringify({});
}

let getLinks = () => new Promise((resolve, reject) => {
  try {
    $.get(
      'https://raw.githubusercontent.com/pronskiy/php-digest/gh-pages/links.json',
      resp => resolve(resp.reduce((acc, el, idx) => {
        let matchs = el.link.match(/href="([^"]+)"/g)
        if (!matchs || !matchs.length) {
          console.info(`Can't get link from in ${idx} item:`, el)
          return acc
        }
        matchs = matchs.map(match => match.substr(6, match.length - (match.slice(-2) === '/"' ?
          8 : 7)).split("://")[1])

        for (let match of matchs) {
          let url = match,
            num = parseInt(el.issueNumber),
            issue = {
              num: num,
              url: el.issueUrl
            }
          if (!acc[url]) {
            acc[url] = {
              issues: [issue],
              last_num: num
            }
          } else {
            if (acc[url].last_num < num) acc[url].last_num = num
            acc[url].issues.push(issue)
          }
        }
        return acc
      }, {})), "json"
    )
  } catch (e) {
    reject(e)
  }
})

var setIcon = function(type) {
  var icons = {
    accepted: "images/table_accept.png",
    add: "images/table_add.png"
  };

  chrome.browserAction.setIcon({
    path: icons[type]
  });

}

chrome.tabs.onUpdated.addListener(async function(tabId) {
  storage = JSON.parse(localStorage.digest);
  let links = localStorage.links ? JSON.parse(localStorage.links) : false;
  if (!links) {
    links = await getLinks()
    localStorage.links = JSON.stringify(links);
  }

  chrome.tabs.get(tabId, function(tab) {
    //console.log(storage);
    if (!storage[tab.url]) {
      setIcon('add');
    } else {
      setIcon('accepted');
    }
    let clear_tab_url = (tab.url.slice(-1) === '/' ? tab.url.substr(0, tab.url.length - 1) : tab.url).split('://')[1]
    if (links[clear_tab_url]) {
      chrome.browserAction.setBadgeBackgroundColor({
        color: [100, 100, 100, 100]
      });
      chrome.browserAction.setBadgeText({
        text: links[clear_tab_url].last_num.toString()
      });
    } else {
      chrome.browserAction.setBadgeText({
        text: ''
      });
    }
  });
});

chrome.tabs.onActivated.addListener(async function(activeInfo) {
  storage = JSON.parse(localStorage.digest);
  let links = localStorage.links ? JSON.parse(localStorage.links) : false;
  if (!links) {
    links = await getLinks()
    localStorage.links = JSON.stringify(links);
  }

  chrome.tabs.get(activeInfo.tabId, function(tab) {
    //console.log(storage);
    if (!storage[tab.url]) {
      setIcon('add');
    } else {
      setIcon('accepted');
    }
    let clear_tab_url = (tab.url.slice(-1) === '/' ? tab.url.substr(0, tab.url.length - 1) : tab.url).split('://')[1]
    if (links[clear_tab_url]) {
      chrome.browserAction.setBadgeBackgroundColor({
        color: [100, 100, 100, 100]
      });
      chrome.browserAction.setBadgeText({
        text: links[clear_tab_url].last_num.toString()
      });
    } else {
      chrome.browserAction.setBadgeText({
        text: ''
      });
    }
  });
});

// chrome.browserAction.onClicked.addListener(setLink);

let setLink = (tab) => {
  let linkObj = {
    title: tab.title,
    url: tab.url,
    description: ""
  };
  if (linkObj.url.indexOf("phpdeveloper.org") !== -1 ||
    linkObj.url.indexOf("feedly.com") !== -1) {
    chrome.tabs.executeScript(tab.tabId, {
      file: 'injected.js'
    }, function(result) {
      linkObj = result[0];
      _setLink(linkObj);
    });
  } else {
    _setLink(linkObj);
  }
}

function _setLink(linkObj) {
  if (undefined === storage[linkObj.url]) {
    storage[linkObj.url] = linkObj;
    setIcon('accepted');
  }
  localStorage.digest = JSON.stringify(storage);
  console.log('ls: ', localStorage.digest);
}

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  if (command != "save-link") return
  chrome.tabs.query({
    active: true
  }, tabs => {
    setLink(tabs[0])
  });
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.storage) {
    if (typeof request.value != 'undefined') {
      localStorage[request.storage] = request.value;
    }
    sendResponse({
      storage: localStorage[request.storage]
    });
  } else if (request.url) {
    if (storage.hasOwnProperty(request.url)) {
      setIcon('accepted');
    } else {
      setIcon('add');
    }
    sendResponse("OK");
  } else {
    sendResponse(request);
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'php-digest') && (msg.subject === 'addLink')) {
    console.log(msg);
    _setLink(msg.linkObj)
  }
});
