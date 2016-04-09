// JavaScript Document
$(function(){
	$(".tc_pic").height($("body").height());
	$(".pic_sf h3 span").click(function(){
		$(".pic_sf").hide();
		$(".tc_pic").hide();
		
	});
	$(".help_pic li").each(function(x){
		$(this).mousemove(function(){
			$(".help_pic li").removeClass("help_hover");
			$(this).addClass("help_hover");
			$(".help_right").hide();
			$(".help_right:eq("+x+")").show();
		});
	});
	//微信关闭按钮
	$('#close').click(function(){
		$('#pic_wxspan').hide();
	});
	//地区判断显示或者隐藏
	var area = $('#area').val();
	if(area != ''){
		$('#qg').hide();
		$('#qgr').hide();
		$('#'+area).show();
		$('#'+area+'r').show();
	}
	
	
})
//地区切换广告
	function areaClick(diqu){
		if(diqu != ''){
			
			//请求index存储地区
			$.ajax({
				type : "get",
				//url : "http://localhost/2015/new3/index.php?changarea=1",
				url : "http://pic.offcn.com/index.php?changarea=1",
				data: "area="+diqu,
				//dataType : "jsonp",
				//jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
				success : function(data){
					$('.pic_sf').hide();
					$(".tc_pic").hide();
					location.href="index.php";
				}
			});
			$('.pic_sf').hide();
			$(".tc_pic").hide();
		}
	}