(function(){var a={},c={personalisation:"ckps_.+|X-AB-iplayer-.+|ACTVTYMKR|BBC_EXAMPLE_COOKIE|BBCIplayer|BBCiPlayerM|BBCIplayerSession|BBCMediaselector|BBCPostcoder|bbctravel|CGISESSID|ed|food-view|forceDesktop|h4|IMRID|locserv|MyLang|myloc|NTABS|ttduserPrefs|V5|WEATHER|BBCScienceDiscoveryPlaylist_.+|bitratePref|correctAnswerCount|genreCookie|highestQuestionScore|incorrectAnswerCount|longestStreak|MSCSProfile|programmes-oap-expanded|quickestAnswer|score|servicePanel|slowestAnswer|totalTimeForAllFormatted|v|BBCwords|score|correctAnswerCount|highestQuestionScore|hploc|BGUID|BBCWEACITY|mstouch|myway|BBCNewsCustomisation|cbbc_anim|cbeebies_snd|bbcsr_usersx|cbeebies_rd|BBC-Latest_Blogs|zh-enc|pref_loc|m|bbcEmp.+|recs-.+|_lvd2|_lvs2|tick|_fcap_CAM1|_rcc2",performance:"ckpf_.+|BBCLiveStatsClick|id|_em_.+|cookies_enabled|mbox|mbox-admin|mc_.+|omniture_unique|s_.+|sc_.+|adpolicyAdDisplayFrequency|s1|ns_session|ns_cookietest|ns_ux|NO-SA|tr_pr1|gvsurvey|bbcsurvey|si_v|sa_labels|obuid|mm_.+|mmid|mmcore.+|mmpa.+",ads:"ckad_.+|rsi_segs|c",necessary:"ckns_.+|BBC-UID|blq\\.dPref|SSO2-UID|BBC-H2-User|rmRpDetectReal|bbcComSurvey|IDENTITY_ENV|IDENTITY|IDENTITY-HTTPS|IDENTITY_SESSION|BBCCOMMENTSMODULESESSID|bbcBump.+|IVOTE_VOTE_HISTORY|pulse|BBCPG|BBCPGstat|ecos\\.dt"};function e(){var k=document.cookie.replace(/; +/g,";").split(";"),g,h=[];for(var j=0,f=k.length;j<f;j++){g=k[j];h.push(bbccookies._getCookieName(g))}return h}function b(i){var h=JSON.stringify(i);if(typeof(a[h])!=="undefined"){return a[h]}var g="";for(var f in i){if(i.hasOwnProperty(f)&&c[f]){if(i[f]===true){g+=(g?"|":"")+c[f]}}}a[h]=new RegExp("^("+(g?g:".*")+")$","i");return a[h]}bbccookies.getPolicyExpiryDateTime=function(){return bbccookies.POLICY_EXPIRY_COOKIENAME};bbccookies.purge=function(){var g=bbccookies.readPolicy(),j=e(),k;for(var h=0,f=j.length;h<f;h++){if(!bbccookies.isAllowed(j[h],g)){k=new Date();k.setTime(0);k=k.toUTCString();bbccookies._setEverywhere(j[h],"deleted",k)}}};function d(){bbccookies.purge();contentLoaded(window,bbccookies.purge);if(window.addEventListener){window.addEventListener("beforeunload",bbccookies.purge,false)}else{if(window.attachEvent){window.attachEvent("onbeforeunload",bbccookies.purge)}else{window.onbeforeunload=bbccookies.purge}}}bbccookies.set=function(g,f){var h=bbccookies._getCookieName(g);if(f||bbccookies.isAllowed(h)){return document.cookie=g}return null};bbccookies.get=function(){return document.cookie};bbccookies.isAllowed=function(i){var h,f,g=false;h=bbccookies.readPolicy();f=b(h);g=f.test(i);return g};d()})();
/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */
function contentLoaded(d,i){var c=false,h=true,k=d.document,j=k.documentElement,a=k.addEventListener,n=a?"addEventListener":"attachEvent",l=a?"removeEventListener":"detachEvent",b=a?"":"on",m=function(o){if(o.type==="readystatechange"&&k.readyState!="complete"){return}(o.type==="load"?d:k)[l](b+o.type,m,false);if(!c&&(c=true)){i.call(d,o.type||o)}},g=function(){try{j.doScroll("left")}catch(o){setTimeout(g,50);return}m("poll")};if(k.readyState==="complete"){i.call(d,"lazy")}else{if(!a&&j.doScroll){try{h=!d.frameElement}catch(f){}if(h){g()}}k[n](b+"DOMContentLoaded",m,false);k[n](b+"readystatechange",m,false);d[n](b+"load",m,false)}};