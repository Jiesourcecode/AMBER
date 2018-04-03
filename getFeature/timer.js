setTimeout(measure(),5000);
    
function measure() {
	var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
	
	var tagInfo=countTag();
	
	var attrInfo=[];
	tagInfo.forEach(function(item,index,array){
		var tmp = countAttr(item[0],item[1]);
		tmp.forEach(function(item,index,array){
			if(item != 0)
				attrInfo.push(item);
		});
	});
	//html attributes
	var attrInfo2=[]
	for(var i=0;i<attrInfo.length;i++){
		var count = 1;
		for(var j = i+1;j< attrInfo.length;j ++){
			if(attrInfo[i]==attrInfo[j]){
				attrInfo.splice(j, 1);
				j--;
				count++;
				}
		}
		var tmp = [attrInfo[i],count.toString()];
		attrInfo2.push(tmp);
	}
	var domDepth = getMaxNestLevel();
	domNode=document.getElementsByTagName("*").length;
	
	//css info
	var styleSheets = document.styleSheets;
	totalStyleSheets = styleSheets.length;
	
	var selectorsCount = 0;
	var rulesCount = 0;
	
	var classSelector = 0;
	var idSelector = 0;
	var attrSelector = 0;
	var childSelector = 0;
	//Adjacent sibling selector
	var asSelector = 0;
	var pseudoSelector = 0;
	//descendant selector
	var desSelector = 0;
	var allSelector = 0;
	var elementSelector = 0;


	
	var cssProperties=[];

	for (var i = 0; i < document.styleSheets.length; i++) {
	    var sheet = document.styleSheets[i];
	  //loop the sheet
	    var selector=[];
	    var rules = sheet.cssRules||sheet.rules; //get one rules
	    if (sheet && rules) {
		//loop the rules for each sheet
		for (var j = 0, l = rules.length; j < l; j++) {
		    //the selectorText is null
		    if (!rules[j].selectorText) {
			var subRules = rules[j].cssRules||rules[j].rules;
			if (subRules) {
			  //If the SelectorText is null, then loop the subRules
			    for (var m = 0, n = subRules.length; m < n; m++) {
				if(subRules[m].selectorText) {
				    //get the selectorsCount
				    selectorsCount += subRules[m].selectorText.split(',').length;
				    selector = subRules[m].selectorText.split(',');
				    var sele2ele = 0;
				    //statistic different selectors pattern
				    selector.forEach(function(item,index,array){
					sele2ele += document.querySelectorAll(item).length;
					// get different kinds of selectors
					if(item[0].indexOf('.') >= 0)
						classSelector += sele2ele;
					else if(item[0].indexOf('#') >= 0)
						idSelector += sele2ele;
					else if(item[0].indexOf('[') >= 0)
						attrSelector += sele2ele;	
					else if(item[0].indexOf('>') >= 0)
						childSelector += sele2ele;		
					else if(item[0].indexOf('+') >= 0)
						asSelector += sele2ele;
					else if(item[0].indexOf(':') >= 0)
						pseudoSelector += sele2ele;
					else if(item[0].indexOf(' ') >= 0)
						desSelector += sele2ele;
					else if(item[0].indexOf('*') >= 0)
						allSelector += sele2ele;
					else
						elementSelector += sele2ele;
				    });
				    //loop the rules, and calculate the number of tags with each rule
				    for(var a = 0; a < subRules[m].style.length; a++){
					    if(sele2ele == 0)
					      continue;
					    var tmp = [subRules[m].style[a],sele2ele];
					    cssProperties.push(tmp);
				    }
				}
			    }
			}
		    }
		    else {
			//The selectorText is not empty//get the selectorsCount
			selectorsCount += rules[j].selectorText.split(',').length;
			selector = rules[j].selectorText.split(',');
			var sele2ele = 0;
			//statistic different selectors pattern
			selector.forEach(function(item,index,array){
			    sele2ele += document.querySelectorAll(item).length;
			    // get different kinds of selectors
			    if(item[0].indexOf('.') >= 0)
				    classSelector += sele2ele;
			    else if(item[0].indexOf('#') >= 0)
				    idSelector += sele2ele;
			    else if(item[0].indexOf('[') >= 0)
				    attrSelector += sele2ele;	
			    else if(item[0].indexOf('>') >= 0)
				    childSelector += sele2ele;		
			    else if(item[0].indexOf('+') >= 0)
				    asSelector += sele2ele;
			    else if(item[0].indexOf(':') >= 0)
				    pseudoSelector += sele2ele;
			    else if(item[0].indexOf(' ') >= 0)
				    desSelector += sele2ele;
			    else if(item[0].indexOf('*') >= 0)
				    allSelector += sele2ele;
			    else
				    elementSelector += sele2ele;
			   });
			  //loop the rules, and calculate the number of tags with each rule
			    for(var a = 0; a < rules[j].style.length; a++){
				    if(sele2ele == 0)
				      continue;
				    var tmp = [rules[j].style[a],sele2ele];
				    cssProperties.push(tmp);
			    }
		      }  
		}
		rulesCount += rules.length;
	      }	
	}

	var cssSelector=[];
	cssSelector.push(classSelector.toString());
	cssSelector.push(idSelector.toString());
	cssSelector.push(attrSelector.toString());
	cssSelector.push(childSelector.toString());
	cssSelector.push(asSelector.toString());
	cssSelector.push(pseudoSelector.toString());
	cssSelector.push(desSelector.toString());
	cssSelector.push(allSelector.toString());
	cssSelector.push(elementSelector.toString());
	cssSelector.push(selectorsCount.toString());
	cssSelector.push(rulesCount.toString());
	

	var cssProperties2=[]
	for(var i=0;i< cssProperties.length;i++){
		var count = cssProperties[i][1];
		for(var j = i+1;j< cssProperties.length;j ++){
			if(cssProperties[i][0] == cssProperties[j][0]){		
				count += cssProperties[j][1];
				cssProperties.splice(j,1);
				j--;
				}
		}
		var tmp = [cssProperties[i][0],count.toString()];
		cssProperties2.push(tmp);
	} 
	
	
	var htmlInfo=[];
	htmlInfo.push(domNode.toString());
	htmlInfo.push(domDepth.toString());
	htmlInfo.push(tagInfo);
	htmlInfo.push(attrInfo2);
	
	var cssInfo=[];
	cssInfo.push(selectorsCount.toString());
	cssInfo.push(rulesCount.toString());
	cssInfo.push(cssProperties2);
	cssInfo.push(cssSelector);
	
	chrome[roe].sendMessage({htmlInfo:htmlInfo,cssInfo: cssInfo, total: domNode.toString()});
}

function removeDup(a){
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
		//pro name as the index
		var item = a[i][0];
         if(seen[item] !== 1) {
               seen[item] = 1;
			   out[item] = a[i][1];
         }
		 else
			out[item] += a[i][1];
    }
    return out;
}

function countTag(tagClass){
    var domTree = document.getElementsByTagName("*");
    var tagInfo = [];
    for(var i = 0;i < domTree.length;i ++){
      var tmp = [domTree[i].nodeName,1];
      var tag = true;
      for(var j = 0;j < tagInfo.length; j++){
	if(tagInfo[j][0] == tmp[0]){
	  tag = false;
	  tagInfo[j][1] += 1;
	}
      }
      if(tag == true)
	tagInfo.push(tmp);
    }
    return tagInfo;
}

function countAttr(tag,num){
	var attr_count=[];
	if(document.getElementsByTagName(tag)[0]!=null&&document.getElementsByTagName(tag)[0].attributes.length!=0){
		for(var k = 0;k < num; k++){
			attr = document.getElementsByTagName(tag)[k].attributes;
			for(var j = 0;j < attr.length;j++){
				attr_count.push(attr[j].nodeName);
			}
		}
	}
	else
		attr_count.push(0);
	return attr_count;
}

//get the dom tree depth
function getMaxNestLevel() {
    var i = 1, sel = '* > *'; /* html > body is always present */
    while(document.querySelector(sel)) {
        sel += ' > *';
        i++;
    }
    return i;
}





