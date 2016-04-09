<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DealImage.aspx.cs" Inherits="CTXProject.Web.Report.DealImage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

<title>照片编辑器</title>

<meta name="keywords" content="照片编辑器"/> 

<meta name="description" content="照片编辑"/>

<link href="chuli_files/style.css" rel="stylesheet" type="text/css"/>


<script type="text/javascript" src="chuli_files/jquery_002.js"></script>

<script type="text/javascript" src="chuli_files/java.js"></script>

<script type="text/javascript" src="chuli_files/jquery.js"></script>

<script type="text/javascript" src="chuli_files/ajaxfileupload.js"></script>





<style>html #hm_t_undefined .hm-t-go-top {position:fixed;right:2px;bottom:2px;z-index:99998;cursor:pointer;width:40px;height:37px!important;text-align:center;white-space:normal;font-size:14px;line-height:17px;padding-top:3px;color:#fff;background:#404040;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAAAXCAYAAABH92JbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMjgwMTE3NDA3MjA2ODExODA4M0UyNDA4ODdDRTZBQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQjc5RkRFNkI5ODMxMUUzQkZGNDhENEJFQjM2OTcyRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQjc5RkRFNUI5ODMxMUUzQkZGNDhENEJFQjM2OTcyRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTgwODNFMjQwODg3Q0U2QUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDI4MDExNzQwNzIwNjgxMTgwODNFMjQwODg3Q0U2QUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5HPYM5AAACC0lEQVR42uyZTSgEYRjH90NoqaVcpDblvKW2XOSkNh8H5Yac9sBBDqQokiJKSMpNTi5OPo6Ktsgu67JcUHIXWfK1u3b8Xx6Zxuzu+64dM83uv34zNfu8b8/8Z+d5P8YqSZLFJNLsRmyWvIRMKgVD4AhEwA3YAV0pzGwEqyAEwmAddIICHe7FqhnsdQM14FxKLj+ooFiGE2ykiD8GVbJ4I1ELAnTmasMODnAhpVcIFIMicMgRH6Z4IxnUAh4pP3Zu5TVpUOLXDJgWiB8wkEF9IK7IL07X05oUFLjpZ4JXQQOYYwfzafJcoDjVPqw43KE4lWtUTF+AQ8eBqQSsgTaO2E0apJ7URrdCDZOM62hQJfBzGmShOD+1+2XSiYaJ7utkkBsEgEewnYfauZUmzWmU6DuY0sEgLzgArgzbu6i992cu/1WclqXsa1iHIt0DYlnKP0b9fRZu5pWdZs7dWXqa7B80+s//oF5aMSjflGqBPq5BQnFtVv4UmGHjIPEH96PAZ6C5kVMwf6daPzbFKnqCqvx9Bk/yFjSBFTMvcL+1DerAmUA/p9Rm1+y7AHJdgnqwx9EHm1s0gKtc2CpR6gE00/ZHMm3RKxbJlf0kNb2BDrCk8hsbDdvBay5tuiUTGxL7waTs2iLw0YTR9BLZQRwDUVqwjuTS9q3VRB8C1OQUnM6UqdXX/IcADn0IMADs2AqDOPSutQAAAABJRU5ErkJggg==) no-repeat -42px center #666;*background-image:url(http://ecma.bdimg.com/holmes/t-popup-icons-png8.png);_position:absolute;_top:expression(eval(document.documentElement.scrollTop+(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight-2));}</style></head>



<body>                                   

  <script type="text/javascript">
        /*
         * www.byzuo.com
         * ok!: MSIE 6, 7, 8, Firefox 3.6, chrome 4, Safari 4, Opera 10
         * o 旋转图片ID;
         * p 选择旋转方向，固定值为'left'或'right';
         */
        function rotate(o,p){
            var img = document.getElementById(o);
            if(!img || !p) return false;
            var n = img.getAttribute('step');
            if(n== null) n=0;
            if(p=='right'){
                (n==3)? n=0:n++;
            }else if(p=='left'){
                (n==0)? n=3:n--;
            }
            img.setAttribute('step',n);
			$('#ste').val(n);
            //MSIE
            if(document.all) {
                img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ n +')';
                //HACK FOR MSIE 8
                switch(n){
                    case 0:
                        imgimg.parentNode.style.height = img.height;
                        break;
                    case 1:
                        imgimg.parentNode.style.height = img.width;
                        break;
                    case 2:
                        imgimg.parentNode.style.height = img.height;
                        break;
                    case 3:
                        imgimg.parentNode.style.height = img.width;
                        break;
                }
                //DOM
            }else{
                var c = document.getElementById('canvas_'+o);
                if(c== null){
                    img.style.visibility = 'hidden';
                    img.style.position = 'absolute';
                    c = document.createElement('canvas');
                    c.setAttribute("id",'canvas_'+o);
                    img.parentNode.appendChild(c);
                }
                var canvasContext = c.getContext('2d');
                switch(n) {
                    default :
                    case 0 :
                        c.setAttribute('width', img.width);
                        c.setAttribute('height', img.height);
                        canvasContext.rotate(0 * Math.PI / 180);
                        canvasContext.drawImage(img, 0, 0);
                        break;
                    case 1 :
                        c.setAttribute('width', img.height);
                        c.setAttribute('height', img.width);
                        canvasContext.rotate(90 * Math.PI / 180);
                        canvasContext.drawImage(img, 0, -img.height);
                        break;
                    case 2 :
                        c.setAttribute('width', img.width);
                        c.setAttribute('height', img.height);
                        canvasContext.rotate(180 * Math.PI / 180);
                        canvasContext.drawImage(img, -img.width, -img.height);
                        break;
                    case 3 :
                        c.setAttribute('width', img.height);
                        c.setAttribute('height', img.width);
                        canvasContext.rotate(270 * Math.PI / 180);
                        canvasContext.drawImage(img, -img.width, 0);
                        break;
                }
            }
        }
    </script>



<div class="mian">

        	<div> <input type="button" value="逆时针" onclick="rotate('thumbnail','left')">
            <input type="button" value="顺时针" onclick="rotate('thumbnail','right')"></div><br />

     
        	<p  style="background:#FFFFFF"><img  src="/Files/CarImg/fded04f4dd984d93a630ddf41ae00fd9_Big.jpg" alt="" step="0"  id="thumbnail"  ></p>
   

		<form name="thumbnail" runat="server" id="form1"  method="post" enctype="multipart/form-data">
			<input name="x1" value="" id="x1" type="hidden"/>
			<input name="y1" value="" id="y1" type="hidden"/>
			<input name="x2" value="" id="x2" type="hidden"/>
			<input name="y2" value="" id="y2" type="hidden"/>
			<input name="w" value="" id="w" type="hidden"/>
			<input name="h" value="" id="h" type="hidden"/>
			<input name="im" value="" id="im" type="hidden"/>
			<input name="ste" value="" id="ste" type="hidden"/>

			<p class="pic_set_jq">截取大小&nbsp;&nbsp;宽：<input class="pic_set2_text" name="jie_width" id="jie_width" disabled="disabled" size="8" type="text">高：<input name="jie_height" id="jie_height" disabled="disabled" size="8" class="pic_set2_text" type="text"> <button onclick="made_set(1)" type="button">标准裁剪</button></p>
          <p class="pic_f_save"><input value="" class="pic_btn_pub"   name="upload_thumbnail"   id="save_thumb" type="submit">
            <a href="http://192.168.0.1/index.html" class="quxiao"><img src="chuli_files/pic_cq_12.jpg" alt="" height="40" width="100" /></a></p>
		</form>
		<input name="area" id="area" value="fj" type="hidden">
    </div>
<p class="sms">&nbsp;</p>






</div>





<script type="text/javascript">
var date = (new Date().getTime());
var width= 634;
var height=415;
var jie_width= 1280;
var jie_height = 854;
var cimg = document.getElementById('thumbnail');
cimg.src = cimg.src + "?" + date;

console.log(cimg.src);

$(document).ready(function () { 

	$('#save_thumb').click(function() {
		var x1 = $('#x1').val();
		var y1 = $('#y1').val();
		var x2 = $('#x2').val();
		var y2 = $('#y2').val();
		var w = $('#w').val();
		var h = $('#h').val();
		if(x1=="" || y1=="" || x2=="" || y2=="" || w=="" || h==""){
			alert("请先选择上传图片");
			return false;
		}else{
			return true;
		}
	});
	huidiao(jie_width,jie_height);
	$('#thumbnail').imgAreaSelect({x1: 0, y1: 0, x2:  + jie_width , y2: + jie_height ,keys: { arrows: 15, shift: 'resize' }, aspectRatio: '634:415', onSelectChange: preview }); 


        

	
}); 

function preview(img, selection) {
	var scaleX = width  / selection.width; 
	var scaleY = height / selection.height; 
	$('#ab').css({ 
		width: Math.round(scaleX * 341) + 'px', 
		height: Math.round(scaleY * 251) + 'px',
		marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px', 
		marginTop: '-' + Math.round(scaleY * selection.y1) + 'px' 
	});

	$('#x1').val(selection.x1);
	$('#y1').val(selection.y1);
	$('#x2').val(selection.x2);
	$('#y2').val(selection.y2);
	$('#w').val(selection.width);
	$('#h').val(selection.height);
	$('#jie_width').val(selection.width);
	$('#jie_height').val(selection.height);
		     var cimg = document.getElementById('thumbnail');
	$('#im').val(cimg.src);
	var n = img.getAttribute('step');
		$('#ste').val(n);
	

	$('#xiaotu').css({ 
		width: width  +'px', 
		height:height +'px',
		border:'1px solid #ccc',
		overflow:'hidden',
		position:'relative',
		display:''
	});
} 
function huidiao(new_width,new_height){
	if(new_width >341 || new_height > 251  ){
		new_width=new_width/2;
		new_height=new_height/2;
		huidiao(new_width,new_height);
	}else{
		jie_width=new_width;
		jie_height=new_height;
	}
}


function  get_val(){

if(isNaN($('#width').val())){
	alert('您输入的宽不是数字类型');
	 $('#width').val(100);
}else if(isNaN($('#height').val())){
	alert('您输入的高不是数字类型');
	 $('#height').val(100);
}else if( $('#width').val()> 1280 || $('#height').val() > 854 ){
	alert('新图的宽高不能超过500*500');
	      $('#width').val(1280);
		  $('#height').val(854);
}

	width=  $('#width').val();
	height= $('#height').val();

	$('#xiaotu').css({ 
		width: width  +'px', 
		height:height +'px',
		border:'1px solid #ccc',
		overflow:'hidden',
		position:'relative',
		display:''
	});

	huidiao(width,height);

	var bili= width+':'+height;
	$('#thumbnail').imgAreaSelect({x1: 0, y1: 0, x2:  + width , y2: + height ,keys: { arrows: 15, shift: 'resize' }, aspectRatio: bili, onSelectChange: preview }); 



}


function made_set(size){

	if(size=='1'){
		 width=634;
		 height=415;
	}else if(size=='2'){
		 width=125;
		 height=125;
	}else if(size=='3'){
		 width=185;
		 height=185;
	}
	 $('#made_width').val( width);
	 $('#made_height').val( height);
	




	var bili= width+':'+height;
	huidiao(jie_width,jie_height);
	$('#thumbnail').imgAreaSelect({x1: 0, y1: 0, x2:  + width , y2: + height ,keys: { arrows: 15, shift: 'resize' }, aspectRatio: bili, onSelectChange: preview }); 
	$('#x1').val(0);
	$('#y1').val(0);
	$('#x2').val(width);
	$('#y2').val(height);
	$('#w').val(width);
	$('#h').val(height);
		     var cimg = document.getElementById('thumbnail');
	$('#im').val(cimg.src);
		var n = img.getAttribute('step');
		$('#ste').val(n);
	
}


</script>
                                                                                                 
      
         
      
  </div></body></html>
