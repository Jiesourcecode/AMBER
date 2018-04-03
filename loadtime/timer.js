(function() {
    if (document.readyState == "complete") {
        measure();
    }else {
        window.addEventListener("load", measure);
    } 
    
    function measure() {
        setTimeout(function() {
            var t = performance.timing;
            var start = t.redirectStart == 0 ? t.fetchStart : t.redirectStart;
            if (t.loadEventEnd > 0) {
                // we have only 4 chars in our disposal including decimal point
				var sTime = new Date(start);
				startTime = formateTime(sTime);
				
				var eTime = new Date(t.loadEventEnd);				
				endTime = formateTime(eTime);// now.getHours()+'.'+now.getMinutes()+'.'+now.getSeconds()+'.'+now.getMilliseconds();
				
				//var duration = getDuration(sTime,eTime);//getDuration(start,now);
				var duration = String(((t.loadEventEnd-start) / 1000).toPrecision(3)).substring(0, 4);
				
                var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
                // since Chrome 43 JSON.stringify() doesn't work for PerformanceTiming
                // https://code.google.com/p/chromium/issues/detail?id=467366
                // need to manually copy properties via for .. in loop
                var timing = {};
                for (var p in t) {
                    if (typeof(t[p]) !== "function") {
                        timing[p] = t[p];//store time for popup
                    }
                }
				
                chrome[roe].sendMessage({startTime: startTime, endTime: endTime, duration: duration});
            }
        }, 0);
    }
/* 	function getDuration(startTime,endTime){
		var shh = startTime.getHours();            //时
		var smm = startTime.getMinutes();          //分
		var sss = startTime.getSeconds();           //秒
		var ssss = startTime.getMilliseconds()     //millisecond
	
		var ehh = endTime.getHours();            //时
		var emm = endTime.getMinutes();          //分
		var ess = endTime.getSeconds();           //秒
		var esss = endTime.getMilliseconds()     //millisecond
		
		//time = String(((hh*3600*1000 + mm*60*1000 + ss*1000 +sss - startTime) / 1000).toPrecision(3)).substring(0, 4); 
		time = String(((ehh*3600*1000 + emm*60*1000 + ess*1000 +esss - (shh*3600*1000 + smm*60*1000 + sss*1000 +ssss))/ 1000).toPrecision(3)).substring(0, 4); 
		
		return time;
	} */
	
	function formateTime(now){
		var hh = now.getHours();            //时
		var mm = now.getMinutes();          //分
		var ss = now.getSeconds();           //秒
		var sss = now.getMilliseconds()     //millisecond
		
		var clock = "";

		if(hh < 10) clock += "0";
		clock += hh + ".";
		
		if (mm < 10) clock += '0'; 
		clock += mm + "."; 
		 
		if (ss < 10) clock += '0'; 
		clock += ss + "."; 
		
		var milliseconds="";					//To simplify, I save first bit of millisecond
		if(sss < 100&& sss > 9){
			milliseconds += '0';
			milliseconds += sss;}
		else if(sss < 10){
			milliseconds += '00';
			milliseconds += sss;}
		else
			milliseconds += sss;
		clock += String(milliseconds).substring(0, 1)
		
		return(clock); 
	}
})();

