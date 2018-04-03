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
		chrome.browserAction.setBadgeText({text: request.total, tabId: sender.tab.id});	

		var htmlInfo = request.htmlInfo;
		var domNode = htmlInfo[0];
		var domDepth =htmlInfo[1];
		var htmlTag = htmlInfo[2];
		var htmlAttr = htmlInfo[3];
		
 		var cssInfo = request.cssInfo;
		var cssPropertities = cssInfo[2];
		var cssSelector = cssInfo[3];
		
		window.localStorage.clear();
		
		//summary info
		window.localStorage.setItem("0-domDepth",domDepth);
		window.localStorage.setItem("0-domNodesCount",domNode);
		window.localStorage.setItem("0-cssSelectorsCount",cssInfo[0]);
		window.localStorage.setItem("0-cssRulesCount",cssInfo[1]); 

	    for(var j=0;j<htmlTag.length;j++){
			window.localStorage.setItem("1-htmlTag-"+htmlTag[j][0],htmlTag[j][1]);
			}
		//window.localStorage.setItem("HTML_ATTR","HTML_ATTR");	
		for(var i=0;i<htmlAttr.length;i++){
			window.localStorage.setItem("2-htmlAttr-"+htmlAttr[i][0],htmlAttr[i][1]);
			}
 		for(var k=0;k<cssPropertities.length;k++){
			window.localStorage.setItem("3-cssPropperties-"+cssPropertities[k][0],cssPropertities[k][1]);
			} 
			
 		window.localStorage.setItem("4-selectorPattern-class",cssSelector[0]);
		window.localStorage.setItem("4-selectorPattern-id",cssSelector[1]);
		window.localStorage.setItem("4-selectorPattern-attributes",cssSelector[2]);
		window.localStorage.setItem("4-selectorPattern-children",cssSelector[3]);
		window.localStorage.setItem("4-selectorPattern-adjacentSibling",cssSelector[4]);
		window.localStorage.setItem("4-selectorPattern-pseudo",cssSelector[5]);
		window.localStorage.setItem("4-selectorPattern-descendant",cssSelector[6]);
		window.localStorage.setItem("4-selectorPattern-all",cssSelector[7]);
		window.localStorage.setItem("4-selectorPattern-element",cssSelector[8]);

		var normalized;
		for(i in 1:length(htmlInfo)){
		  normalized[i] = (htmlInfo[,i]-min(htmlInfo[,i]))/(max(htmlInfo[,i])-min(htmlInfo[,i]))
		}
		j=i;
		for(i in 1:length(cssPropertities)){
		  normalized[j+i] = (cssPropertities[,i]-min(cssPropertities[,i]))/(max(cssPropertities[,i])-min(cssPropertities[,i]))
		}
		j=j+i;
		for(i in 1:length(cssSelector)){
		  normalized[j+i] = (cssSelector[,i]-min(cssSelector[,i]))/(max(cssSelector[,i])-min(cssSelector[,i]))
		}
    }
);

// cache eviction
chrome.tabs.onRemoved.addListener(function(tabId) {
    chrome.storage.local.get('cache', function(data) {
        if (data.cache) delete data.cache['tab' + tabId];
        chrome.storage.local.set(data);
    });
});
