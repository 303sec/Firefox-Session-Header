/*
// This function is an entry point for the header extension
loadFromBrowserStorage(['config', 'started'], function (result) {

  // if old storage method
  if (result.config === undefined) loadConfigurationFromLocalStorage();
  else {
    started = result.started;
    config = JSON.parse(result.config);
  }

  if (started === 'on') {
    addListener();
    chrome.browserAction.setIcon({ path: 'icons/modify-green-32.png' });
  }
  else if (started !== 'off') {
    started = 'off';
    storeInBrowserStorage({ started: 'off' });
  }
  // listen for change in configuration or start/stop
  chrome.runtime.onMessage.addListener(notify);
});


/*
* Rewrite the request header (add , modify or delete)
*/
/*
function rewriteRequestHeader(e) {
  if (config.debug_mode) log("Start modify request headers for url " + e.url);
  for (let to_modify of config.headers) {
    if ((to_modify.status === "on") && (to_modify.apply_on === "req") && (!config.use_url_contains || (config.use_url_contains && e.url.includes(to_modify.url_contains)))) {
      if (to_modify.action === "add") {
        // This is the important bit! But what is e?
        // e comes from the browser method
        let new_header = { "name": to_modify.header_name, "value": to_modify.header_value };
        e.requestHeaders.push(new_header);
        if (config.debug_mode) log("Add request header : name=" + to_modify.header_name +
          ",value=" + to_modify.header_value + " for url " + e.url);
      }
      else if (to_modify.action === "modify") {
        for (let header of e.requestHeaders) {
          if (header.name.toLowerCase() === to_modify.header_name.toLowerCase()) {
            if (config.debug_mode) log("Modify request header :  name= " + to_modify.header_name +
              ",old value=" + header.value + ",new value=" + to_modify.header_value +
              " for url " + e.url);
            header.value = to_modify.header_value;
          }
        }
      }
      else if (to_modify.action === "delete") {
        let index = -1;
        for (let i = 0; i < e.requestHeaders.length; i++) {
          if (e.requestHeaders[i].name.toLowerCase() === to_modify.header_name.toLowerCase()) index = i;
        }
        if (index !== -1) {
          e.requestHeaders.splice(index, 1);
          if (config.debug_mode) log("Delete request header :  name=" + to_modify.header_name.toLowerCase() +
            " for url " + e.url);
        }
      }
    }
  }
  if (config.debug_mode) log("End modify request headers for url " + e.url);
  return { requestHeaders: e.requestHeaders };
}


function addListener() {
  let target = config.target_page;
  if ((target === "*") || (target === "") || (target === " ")) target = "<all_urls>";

  // need to had "extraHeaders" option for chrome https://developer.chrome.com/extensions/webRequest#life_cycle_footnote
  if (isChrome) {
    chrome.webRequest.onBeforeSendHeaders.addListener(rewriteRequestHeader,
      { urls: target.split(";") },
      ["blocking", "requestHeaders", "extraHeaders"]);

    chrome.webRequest.onHeadersReceived.addListener(rewriteResponseHeader,
      { urls: target.split(";") },
      ["blocking", "responseHeaders", "extraHeaders"]);
  }
/*
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension
Firefox also supports the chrome.* namespace for APIs that are compatible with Chrome, primarily to assist with porting. However, using the browser.* namespace is preferred.  In addition to being the proposed standard, browser.* uses promises—a modern and convenient mechanism for handling asynchronous events.
*/
/*
  else {
    chrome.webRequest.onBeforeSendHeaders.addListener(rewriteRequestHeader,
      { urls: target.split(";") },
      ["blocking", "requestHeaders"]);
    chrome.webRequest.onHeadersReceived.addListener(rewriteResponseHeader,
      { urls: target.split(";") },
      ["blocking", "responseHeaders"]);
  }

}

*/
/****************************************************/
// Get all context identities 
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities

function onGot(contexts) {
  for (let context of contexts) {
    console.log(`Name: ${context.color}`);
  }
}

function onError(e) {
  console.error(e);
}

browser.contextualIdentities.query({}).then(onGot, onError);

/*
contextualIdentities.ContextualIdentity

cookieStoreId
color
colorCode
icon
name

The browser request should include the header:

x-context-session-details: ${color}-${name}

And Burp should remove this header 

*/

function() rewriteResponseHeader(){
    let new_header = { "name": "X-CONTEXT-SESSION", "value": current_session_identifier };
    e.requestHeaders.push(new_header);
}

// Adds a listener, callback function is rewriteResponseHeader.
target = "<all_urls>"
chrome.webRequest.onHeadersReceived.addListener(rewriteResponseHeader,
{ urls: target.split(";") },
  ["blocking", "responseHeaders", "extraHeaders"]);


// Get information about the current tab - including the cookieStoreId, which can be used to cross reference the contextual identity.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/getCurrent

function onError(error) {
console.log(`Error: ${error}`);
}

var gettingCurrent = browser.tabs.getCurrent();
gettingCurrent.then(onGot, onError);

/* 
To Do
1. Turn the above into a real plugin
2. Test to see if the onHeadersReceived callback function actually works with the browsers.tab.getCurrent. Maybe webRequest has it's own cookieStoreId?
3. Test to see if any of this actually works or if I'm just grasping at straws. I think it should at least be able to get the relevant data!
4. Test to see if it is possible to create an x-context-session header effectively.
...
1. Look into the basics of Creating a Burp plugin with Java
2. Burp Plugin needs to:
    a. Highlight requests matching specific colour
    b. Remove the x-context-session header
    c. If possible, colour tabs in intruder & repeater.
