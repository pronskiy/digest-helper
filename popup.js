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
});
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
    }, function (result) {
      linkObj = result[0];
      _setLink(linkObj);
    });
  } else {
    _setLink(linkObj);
  }
}

let _setLink = (linkObj) => {
  if (undefined === storage[linkObj.url]) {
    storage[linkObj.url] = linkObj;
    setIcon('accepted');
  }
  localStorage.digest = JSON.stringify(storage);
  $('#btn-li').text('Данный сайт загружен в локальное хранилище.')
  console.log('popup ls: ', localStorage.digest);
}
var setIcon = function (type) {
  var icons = {
    accepted: "images/table_accept.png",
    add: "images/table_add.png"
  };

  chrome.browserAction.setIcon({
    path: icons[type]
  });

}
let storage, links;
(async () => {
  storage = JSON.parse(localStorage.digest);
  links = localStorage.links ? JSON.parse(localStorage.links) : null;
  if (!links) {
    links = await getLinks()
    localStorage.links = JSON.stringify(links);
  }
  console.log("links", links)
  let ul = $('ul')
  let query_callback = async tabs => {
    ul.text('')
    let tab = tabs[0]
    let clear_tab_url = (tab.url.slice(-1) === '/' ? tab.url.substr(0, tab.url.length - 1) : tab.url)
      .split('://')[1]
    console.log("clear_tab_url", clear_tab_url)
    if (links[clear_tab_url]) {
      for (let issue of links[clear_tab_url].issues) {
        ul.append(`<li><a href="${issue.url}">${issue.num}. ${issue.url}</a></li>`)
      }
    } else {
      ul.append(`<li>Данного сайта нет среди загруженных</li>`)
    }
    if (!storage[tab.url]) {
      let li = $(`<li id="btn-li"><button>Сохранить ссылку</button></li>`)
      li.find('button').click(() => {
        setLink(tab)
      })
      ul.append(li)
    } else {
      ul.append(`<li>Данный сайт загружен в локальное хранилище.</li>`)
    }
    let li_get_remote = $(`<li id="btn-li-update"><button>Обновить ссылки</button></li>`)
    li_get_remote.find('button').click(async () => {
      links = await getLinks()
      localStorage.links = JSON.stringify(links);
      query_callback(tabs)
    })
    ul.append(li_get_remote)
  }
  chrome.tabs.query({
    active: true
  }, query_callback)
})();