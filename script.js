if (undefined === localStorage.digest) {
    localStorage.digest = JSON.stringify({});
}

var setIcon = function(type) {
    var icons = {
        accepted: "images/table_accept.png",
        add: "images/table_add.png"
    };

    chrome.browserAction.setIcon({
        path: icons[type]
    });

}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    storage = JSON.parse(localStorage.digest);
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        //console.log(storage);
        if (!storage[tab.url]) {
            setIcon('add');
        } else {
            setIcon('accepted');
        }
    });
});

chrome.browserAction.onClicked.addListener(function(tab) {
    var linkObj ={
        title: tab.title,
        url: tab.url,
        description: ""
    };

    if (linkObj.url.indexOf("phpdeveloper.org") !== -1
        ||
       linkObj.url.indexOf("feedly.com") !== -1) {
        chrome.tabs.executeScript(tab.tabId, {
            file: 'injected.js'
        }, function(result) {
            linkObj = result[0];
            setLink(linkObj);
        });
    } else {
        setLink(linkObj);
    }
});

function setLink(linkObj) {
    if (undefined === storage[linkObj.url]) {
        storage[linkObj.url] = linkObj;
        setIcon('accepted');
    }

    localStorage.digest = JSON.stringify(storage);

    console.log('ls: ', localStorage.digest);
}

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
});



chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.storage) {
        if (typeof request.value != 'undefined') {
            localStorage[request.storage] = request.value;
        }
        sendResponse({storage: localStorage[request.storage]});
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