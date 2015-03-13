/**
 * Created by 轶卓 on 14-5-14.
 */
/*-----------返回 $_GET 对象, 仿PHP模式，自己人使用起来更习惯，哈哈-------*/
var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        if(u[1].indexOf('#') != -1) {
            u = u[1].split("#");
            u = u[0].split("&");
        } else {
            u = u[1].split("&");
        }
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();

/*
 * 根据设备和版本对当当数据字典加前缀
 * 返回值：url字符串
 * defversion为默认版本号，defclient为默认设备名，prefix为数据字典前缀，protocol为网络协议
 * Created by 杨骏 on 15-1-7
*/
//返回设备UA
//返回值{client:设备名称, version:设备版本}
function mobileInfo(){
	var ua = window.navigator.userAgent.toLowerCase(),
		client = "other",
		version = "0.0.0";
	if(!!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/)){
		//ios
		if(ua.indexOf("iphone") > -1){
			//iphone
			client = "iphone";
			version = ua.substr(ua.indexOf("iphone; cpu iphone os") + 22, 6).replace(/;| |[^0-9._]/g, "").replace(/_/g, ".");
		}else if(ua.indexOf("ipod") > -1){
			//ipod
			client =  "ipod";
		}else if(ua.indexOf("ipad") > -1){
			//ipad
			client = "ipad";
			version = ua.substr(ua.indexOf("ipad; cpu os") + 13, 6).replace(/;| |[^0-9._]/g, "").replace(/_/g, ".");
		}
	}else if(ua.indexOf("android") > -1 || ua.indexOf("linux") > -1){
		//android
		client = "android";
		version = ua.substr(ua.indexOf("android") + 8, 6).replace(/;| |[^0-9.]/g, "");
		if(version == ""){
			version = "4.4.0";
		}
	}else if(ua.indexOf("rim tablet os") > -1 ){
		//black bery
		client = "blackbery";
		version = ua.substr(ua.indexOf("rim tablet os") + 14, 6).replace(/;| |[^0-9.]/g, "");
	}else if(ua.indexOf("bb10") > -1 ){
		//black bery bb10
		client = "blackbery";
		version = "bb10";
	}else if(ua.indexOf("iemobile")){
		//windows phone
		client = "wp";console.log(ua);
		version = ua.substr(ua.indexOf("windows phone") + 14, 6).replace(/;| |[^0-9.]/g, "");
	}
	return {client:client, version:version};
}
//设备与版本判断
//符合返回true，否则返回false
//flag为true，则为系统版本比较，否则为当当版本比较
function judgeVersion(defv, defc, flag){
	var defarr = [],
		deflen = 0,
		len = 0,
		arr = [],
		version = $_GET["client_version"],
		client = $_GET["user_client"].toLowerCase();
	if(flag){
		var mobile = mobileInfo();
		if(mobile["client"] != "other"){
			version = mobile["version"];
			client = mobile["client"];
		}
	}
	defarr = defv.split(".");
	deflen = defarr.length;
	arr = version.split(".");
	len = arr.length;
	if(client != defc){
		return false;
	}
	if(len < deflen){
		for(var j = 0; j < Number(deflen - len); j++){
			arr.push("0");
		}
	}
	for(var i = 0; i < deflen; i++){
		if(Number(arr[i]) < Number(defarr[i])){
			return false;
		}else if(Number(arr[i]) > Number(defarr[i])){
			return true;
		}
		if(i == deflen - 1){
			return true;
		}
	}
}
function dictPrefix(url){
	var defversion = cfg.defversion,
		defclient = cfg.defclient,
		url_arr = url.split("://"),
		prefix = cfg.dictionary_prefix,
		protocol = ["http", "https", "ftp"];
	if(!url){
		//url为空或无
		return null;
	}
	if(url_arr.length == 1){
		//相对路径
		return url;
	}
	if(judgeVersion(defversion, defclient) && protocol.indexOf(url_arr[0].toLowerCase()) < 0){
		//设备版本相符，并且是数据字典
		return prefix + url;
	}else{
		return url;
	}
}
