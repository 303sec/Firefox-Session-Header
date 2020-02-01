
"use strict";

// Get all context identities 
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities
/*
function onGotContexts(contexts) {
  for (let context of contexts) {
    console.log(`Name: ${context.color}`);
  }
}

function onError(e) {
  console.error(e);
}

// browser.contextualIdentities.query({}).then(onGotContexts, onError);

var getContext = browser.contextualIdentities.get(cookieStoreId)
*/
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

function getTab(tab){
  return tab.cookieStoreId
  console.log(getted)
}

var gettingCurrent = browser.tabs.getCurrent();
gettingCurrent.then(onGot, onError);

var getContext = browser.contextualIdentities.get(cookieStoreId)


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
