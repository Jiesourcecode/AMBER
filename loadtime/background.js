// Setting a toolbar badge text  .background is the center
		
var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
chrome[roe].onMessage.addListener(
    function(request, sender, sendResponse) {
        // This cache stores page load time for each tab, so they don't interfere
        chrome.storage.local.get('cachse', function(data) { //cache time data from timer timeing is the exact time ,time is the total time
            if (!data.cache) data.cache = {};
            data.cache['tab' + sender.tab.id] = request.timing;
            chrome.storage.local.set(data);		
        });	
		chrome.browserAction.setBadgeText({text: request.duration, tabId: sender.tab.id});	
		
		length = window.localStorage.length + 1;
		window.localStorage.setItem(length,request.startTime+'-'+request.endTime+'-'+request.duration); 	
		//window.localStorage.clear() //clear all the data, reload it
    }
);

// cache eviction
chrome.tabs.onRemoved.addListener(function(tabId) {
    chrome.storage.local.get('cache', function(data) {
        if (data.cache) delete data.cache['tab' + tabId];
        chrome.storage.local.set(data);
    });
});
