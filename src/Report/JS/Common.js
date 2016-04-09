
//给字符串添加 截取字符串长度的方法
function SubString(oldstr,n)
{

  if(typeof(oldstr)=="undefined"||oldstr==null)return oldstr;
  var r = /[^\x00-\xff]/g;
  if(oldstr.replace(r, "mm").length <= n) return oldstr;
  n = n - 3;
  var m = Math.floor(n/2);
  for(var i=m; i<oldstr.length; i++)
  {
    if(oldstr.substr(0, i).replace(r, "mm").length>=n)
    {
      return oldstr.substr(0, i) ;
    }
  }
  return oldstr;
};

function $(id)
{
    return document.getElementById(id);
}
String.prototype.trim = function() 
{ 
    return this.replace(/(^\s*)|(\s*$)/g, ""); 
} 
String.prototype.lTrim = function() 
{ 
    return this.replace(/(^\s*)/g, ""); 
} 
String.prototype.rTrim = function() 
{ 
    return this.replace(/(\s*$)/g, ""); 
} 
function checkEmail(email)
{
    var re = new RegExp("^[\\w-]+(\\.[\\w-]+)*@[\\w-]+(\\.[\\w-]+)+$", "ig");
    return re.test(email)
}
function checkWebSiteUrl(url)
{
    var re = new RegExp("^http(s)?://([\w-]+\.)*", "ig");
    return re.test(url);
}
function getXmlHttp()
{
	var http_request;
	if(window.XMLHttpRequest) { 
		http_request = new XMLHttpRequest();
//		if (http_request.overrideMimeType) {
//			http_request.overrideMimeType("text/xml");
//		}
	}
	else if (window.ActiveXObject) { 
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!http_request) { 
		window.alert("can't create XMLHttpRequest object.");
		return null;
	}	
	return http_request;
}

function getElementPositionX(elemID)
{
   var offsetTrail = document.getElementById(elemID);
   var offsetLeft = 0;
   
   while(offsetTrail)
   {
      offsetLeft += offsetTrail.offsetLeft;
      offsetTrail = offsetTrail.offsetParent;
   }
   
    if (navigator.userAgent.indexOf("Mac") != -1 && 
        typeof(document.body.leftMargin) != "undefined") {
        offsetLeft += document.body.leftMargin;
    }
    
    return offsetLeft;
}
function getElementPositionY(elemID)
{
   var offsetTrail = document.getElementById(elemID);
   var offsetTop = 0;
   
   while(offsetTrail)
   {
      offsetTop += offsetTrail.offsetTop;
      offsetTrail = offsetTrail.offsetParent;
   }
   
    if (navigator.userAgent.indexOf("Mac") != -1 && 
        typeof(document.body.leftMargin) != "undefined") {
        offsetTop += document.body.topMargin;
    }
    return offsetTop;
}
function dataToUrlParam(datas)
{
    var tmpArray = [];
    var tmpName = "";
    var tmpValue = "";
    var returnStr = "";
    for ( var data in datas )
    {
        tmpName = data.trim();
        tmpValue = datas[data].trim();
        if (tmpValue != "")
        {
            tmpArray.push(encodeURIComponent(tmpName) + "=" + encodeURIComponent(tmpValue));
        }
    }
    returnStr = tmpArray.join("&");
    return returnStr;
}
function goPageWidthData(url, datas)
{
    var paramStr = dataToUrlParam(datas).trim();
    var joinSymbol = (url.indexOf("?") > -1) ? "&" : "?";
    if (paramStr == "") joinSymbol = "";
    window.location.href = url + joinSymbol + paramStr;
}
function controlImgSize(tartgetImgObj, width, height)
{
//    var width = tartgetImgObj.width;
//    var height = tartgetImgObj.height;
    if (width == 0) width = tartgetImgObj.style.width;
    if (height == 0) width = tartgetImgObj.style.height;
    var tmpImage = new Image();
    tmpImage.src = tartgetImgObj.src;
    var resultWidth;
    var resultHeight;
//    alert("Source:" + width + "|" + height);
    // Limit the width
    if ((tmpImage.width/tmpImage.height) >= (width/height))
    {
        if (tmpImage.width > width)
        {
            resultWidth = width;
            resultHeight = width*(tmpImage.height/tmpImage.width);
        }
        else
        {
            resultWidth = tmpImage.width
            resultHeight = tmpImage.height
        }
    }
    else
    {
        if (tmpImage.height > height)
        {
            resultWidth = height*(tmpImage.width/tmpImage.height);
            resultHeight = height;
        }
        else
        {
            resultWidth = tmpImage.width
            resultHeight = tmpImage.height
        }
    }
//    alert("Result:" + resultWidth + "|" + resultHeight);
    tartgetImgObj.style.width = resultWidth + "px";
    tartgetImgObj.style.height = resultHeight + "px";
//    tartgetImgObj.width = resultWidth;
//    tartgetImgObj.height = resultHeight;
}
function buildUrlWithData(url, datas)
{
    var paramStr = dataToUrlParam(datas).trim();
    var joinSymbol = (url.indexOf("?") > -1) ? "&" : "?";
    if (paramStr == "") joinSymbol = "";
    return url + joinSymbol + paramStr;
}
function buildNoCacheUrl(strUrl)
{
    var joinSymbol = (strUrl.indexOf("?") > -1) ? "&" : "?";
    var randomTimeTag = (new Date).getTime();
    return strUrl + joinSymbol + "randomTimeTag=" + randomTimeTag;
}