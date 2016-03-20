angular.module('chetongxiang.filters', []).
    filter('OrderStatus', function() {
        return function(status) {
            //订单状态
            status = status + "";
            var descr = "";
            switch (status) {
                case "0":
                    descr = "支付预付款";
                    break;
                case "1":
                    descr = "预付款审核";
                    break;
                case "2":
                    descr = "评估检测";
                    break;
                case "3":
                    descr = "确定物流费";
                    break;
                case "4":
                    descr = "支付购车款";
                    break;
                case "5":
                    descr = "购车款审核";
                    break;
                case "6":
                    descr = "物流发车";
                    break;
                case "7":
                    descr = "确认到车";
                    break;
                case "8":
                    descr = "评估检测";
                    break;
                case "9":
                    descr = "客户提车";
                    break;
                case "10":
                    descr = "已完成(未评价)";
                    break;
                case "256":
                    descr = "已完成(买家已评)";
                    break;
                case "257":
                    descr = "已完成(车主已评)";
                    break;
                case "255":
                    descr = "已完成(双方已评)";
                    break;
                default:
                    descr = "";
                    break;

            }
            return descr;
        }
    }).filter('CarStatus', function() {
        //车辆状态
        return function(status) {
            status = status + ""
            var descr = "";
            switch (status) {
                case "0":
                    descr = "显示中";
                    break;
                case "1":
                    descr = "交易中";
                    break;
                case "254":
                    descr = "已下架";
                    break;
                case "255":
                    descr = "交易完成";
                    break;
                default:
                    descr = "未知：" + status;
                    break;

            }
            return descr;
        }
    }).filter('CarCheckStatus', function() {
        //车辆审核状态
        return function(status) {
            status = status + ""
            var descr = "";
            switch (status) {
                case "0":
                    descr = "未审核";
                    break;
                case "1":
                    descr = "初审不通过";
                    break;
                case "2":
                    descr = "已初审";
                    break;
                case "3":
                    descr = "终审不通过";
                    break;
                case "4":
                    descr = "终审通过";
                    break;
                default:
                    descr = "未知：" + status;
                    break;

            }
            return descr;
        }
    }).filter('DateFormat',function(){
        //格式化时间日期
        return function (date,format){
            if(date){
                date=date.replace(/-/gi,'/');
                var d=new Date(date);
                return d.Format(format);
            }
            return "未知"
        }
    }).filter('ClipPhone', function () {
       //格式化电话号码
        return function (phone) {
            if (phone) {
                return phone.substr(0, 3) + '****' + phone.substr(7, phone.length);
            }
        }

    }).filter('OrderRevoke', function () {
        //撤单状态
        return function (status) {
            status = status + "";
            var descr = "";
            switch (status) {
                case "1":
                    descr = "(买方撤单申请)";
                    break;
                case "2":
                    descr = "(已撤单)";
                    break;
                case "3":
                    descr = "(撤单不通过)";
                    break;
                case "11":
                    descr = "(车主撤单)";
                    break;
                case "12":
                    descr = "(已撤单)";
                    break;
                case "13":
                    descr = "(撤单不通过)";
                    break;
                default:
                    descr = "正常交易中";
                    break;

            }
            return descr;
        }

    }).filter('Role', function() {
        //用户角色
        return function(status) {
            var flag = "";
            status = status + "";
            switch (status) {
                case "0":
                    flag = "普通会员";
                    break;
                case "1":
                    flag = "普通员工";
                    break;
                case "2":
                    flag = "评估师";
                    break;
                case "3":
                    flag = "法人代表";
                    break;
                case "11":
                    flag = "普通员工";
                    break;
                case "12":
                    flag = "评估师";
                    break;
                case "13":
                    flag = "法人代表";
                    break;
                case "14":
                    flag = "股东";
                    break;
                case "101":
                    flag = "总部客服";
                    break;
                case "102":
                    flag = "总部财务";
                    break;
                case "103":
                    flag = "总部评估师";
                    break;
                case "202":
                    flag = "评估师";
                    break;
                default:
                    flag = "";
                    break;
            }
            return flag;
        }
    }).filter('SeriesName', function() {
        //过滤车系名称
        return function(data,filterName,SeriesID) {
            var series=[];
            angular.forEach(data,function(obj,index){
                var i=obj.SeriesName.indexOf('进口');
                if(i==-1){
                    obj.SeriesName=obj.SeriesName.substring(obj.SeriesName.lastIndexOf('-')+1,obj.SeriesName.length);
                }
                else if(i>-1){
                    obj.SeriesName=obj.SeriesName.substring(obj.SeriesName.lastIndexOf('-')+1,obj.SeriesName.length);
                    if(obj.SeriesName.indexOf('进口')==-1){
                        obj.SeriesName=obj.SeriesName+'(进口)'
                    }
                }
                obj.SeriesName=obj.SeriesName.replace(filterName,'');
                if(obj.SeriesID==SeriesID){
                    series[0]=obj;
                }else
                {
                    series.push(obj)
                }
            });
            return series
        }
    }).filter('CarPrice',['$filter','$sce',function($filter,$sce){
        //格式化车辆价格
        return function(car){
            if(!car){
                return null
            }
            if(car.CarFlag==1){
                return $sce.trustAsHtml('<small style="color: #999;">交易中...</small>');
            }
            else{
                return  $sce.trustAsHtml($filter('currency')(car.Price/10000,'￥')+'<small style="font-size: 14px"> 万</small>');
            }
        }
    }]).filter('WholesalePrice',['$filter','$sce',function($filter,$sce){
        //格式化同行价格
        return function(car){
            if(!car){
                return null
            }
            if(car.CarFlag==1){
                return $sce.trustAsHtml('<span><i class="fc-org priType"><span><small style="color: #999;">交易中...</small></span></i></span>');
            }
            else{
                if(car.WholesalePrice==0){
                    var elem='<span><i class="fc-org priType"><small>面议</small></i></span><small class="reference">零售价:'+$filter('currency')(car.Price/10000,'￥')+'<small style="font-size: 14px"> 万</small></small>';
                    return  $sce.trustAsHtml(elem);
                }
                 elem='<span><i class="fc-org priType">'+$filter('currency')(car.WholesalePrice/10000,'￥')+'<small style="font-size: 14px"> 万</small></i></span><small class="reference">零售价:'+$filter('currency')(car.Price/10000,'￥')+'<small style="font-size: 14px"> 万</small></small>';
                return  $sce.trustAsHtml(elem);
            }
        }
    }]).filter('NewCarPrice',['$filter','$sce',function($filter,$sce){
        //格式化新车价
        return function(NewCarPrice){
            if(NewCarPrice>0){
                return $sce.trustAsHtml('新车价 '+$filter('currency')(NewCarPrice/10000,'￥')+'<small style="font-size: 12px"> 万</small>');
            }
            else{
                return  $sce.trustAsHtml('');
            }
        }
    }]).filter('LargeIcon',function(){
        //大图
        return function(src){
            var strdata;
            var ret;
            if (src == undefined || src == null) {
                return '';
            } else {
                var pos = src.lastIndexOf(".");
                var iurl = src.substring(0,pos);
                var lastname = src.substring(pos,src.length);
                ret = iurl+"_Big"+lastname;
                return ret;
            }
        }
    }).filter('FormatCarNo',function(){
        //格式化车源号
        return function(data) {
            if (!data) {
                return '';
            }
            var str = new String;
            var sl = 0;
            str = data;
            sl = str.length;
            var rd = str.substring(0,1)+" "+str.substring(1,5)+" "+str.substring(5,9)+" "+str.substring(9,sl);
            return rd;
        }
    }).filter('FormatOwner',['$filter','$sce',function($filter,$sce){
        //格式化车主信息
        return function(car){
            if(!car){
                return null;
            }
            if(car.CarFlag==1){
                var elem= '<div class="item-contact-owner">'+
                    '<p class="contact"> <i class="glyphicon glyphicon-phone-alt"></i> ***********</p>'+
                '<p class="text-orange">友情提示：联系时请说明在"<strong>车同享</strong>"看到该车辆信息</p></div>'+
                '<div class="item-contact-link">'+
                   ' <a href="" style="opacity: 0.6" ></a></div>'
                return $sce.trustAsHtml(elem);
            }
            else{
                var user='';
                if(isNaN(car.UserName))
                {
                    user=car.UserName
                }
                else{
                    user='';
                }
                var elem= '<div class="item-contact-owner">'+
                    '<p class="contact"> <i class="glyphicon glyphicon-phone-alt"> </i> '+user+' '+car.Contact+'</p>'+
                    '<p class="text-orange">友情提示：联系时请说明在"<strong>车同享</strong>"看到该车辆信息</p></div>'+
                    '<div class="item-contact-link">'+
                    ' <a href="credit.html?CarNo='+car.CarNo+'" ></a></div>'
                return $sce.trustAsHtml(elem);
            }
        }
    }]).filter('FormatBuyBtn',['$filter','$sce',function($filter,$sce){
        //格式化购车按钮
        return function(car){
            if(!car){
                return null;
            }
            if(car.CarFlag==1){
                var elem= ' <button type="button" class="item-buy-btn buy-not" disabled><i class="glyphicon glyphicon-shopping-cart"></i>交易中...</button>'+
                    '<button type="button" class="item-evaluation-btn buy-not" disabled><img src="images/Trust-evaluation-w-icon.png" alt=""/>交易中...</button>';
                return $sce.trustAsHtml(elem);
            }
            else{
                var elem= ' <a class="item-buy-btn" href="order.html?CarNo='+car.CarNo+'"><i class="glyphicon glyphicon-shopping-cart"></i> 立即购买</a>'+
                    '<a class="item-evaluation-btn" href="appraiser.html?CarNo='+car.CarNo+'&Brand='+car.Brand+'&CityID='+car.CityID+'"><img src="images/Trust-evaluation-icon.png" alt=""/>委托评估</a>';

                return $sce.trustAsHtml(elem);
            }
        }
    }]).filter('FormatDetection',['$filter','$sce',function($filter,$sce){
        //格式化认证
        return function(car){
            if(!car){
                return null;
            }
            if(car.AppraiserFlag==0){
                var elem= '<div class="item-detection">'+
                    '<ul class="list-inline">'+
                    '<li>'+
                    '<img src="images/ctx-renzheng-1.png" alt=""/>'+
                    '<p>车同享承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/zy-renzheng-1.png" alt=""/>'+
                    '<p>评估师承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/sj-renzheng-1.png" alt=""/>'+
                    '<p>商家承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '</ul>'+
                    '</div>';
                return $sce.trustAsHtml(elem);
            }
            else if(car.AppraiserFlag==1){
                var elem= '<div class="item-detection">'+
                    '<ul class="list-inline">'+
                    '<li>'+
                    '<img src="images/ctx-renzheng-1.png" alt=""/>'+
                    '<p>车同享承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/zy-renzheng-1.png" alt=""/>'+
                    '<p>评估师承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/sj-renzheng.png" alt=""/>'+
                    '<p>商家承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '</ul>'+
                    '</div>';

                return $sce.trustAsHtml(elem);
            }
            else if(car.AppraiserFlag==2){
                var elem= '<div class="item-detection">'+
                    '<ul class="list-inline">'+
                    '<li>'+
                    '<img src="images/ctx-renzheng-1.png" alt=""/>'+
                    '<p>车同享承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/zy-renzheng.png" alt=""/>'+
                    '<p>评估师承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/sj-renzheng-1.png" alt=""/>'+
                    '<p>商家承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '</ul>'+
                    '</div>';

                return $sce.trustAsHtml(elem);
            }
            else if(car.AppraiserFlag==3){
                var elem= '<div class="item-detection">'+
                    '<ul class="list-inline">'+
                    '<li>'+
                    '<img src="images/ctx-renzheng.png" alt=""/>'+
                    '<p>车同享承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/zy-renzheng-1.png" alt=""/>'+
                    '<p>评估师承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '<li>'+
                    '<img src="images/sj-renzheng-1.png" alt=""/>'+
                    '<p>商家承诺检测结果<br>真实精准</p>'+
                    '</li>'+
                    '</ul>'+
                    '</div>';

                return $sce.trustAsHtml(elem);
            }
        }
    }]).filter('FormatIndexDetection',['$filter','$sce',function($filter,$sce){
        //格式化购车按钮
        return function(car){
            if(!car){
                return null;
            }
            if(car.AppraiserFlag==1){
                var elem= '<img src="./images/sj-renzheng.png" />';
                return $sce.trustAsHtml(elem);
            }
            if(car.AppraiserFlag==2){
                var elem= '<img src="./images/zy-renzheng.png" />';
                return $sce.trustAsHtml(elem);
            }
            if(car.AppraiserFlag==3){
                var elem= '<img src="./images/ctx-renzheng.png" />';
                return $sce.trustAsHtml(elem);
            }
        }
    }]).filter('Corlor',function(){
        //车辆颜色
        return function(status) {
            var flag = "";
            status=status+"";
            switch (status) {
                case "0":
                    flag = "未知";
                    break;
                case "1":
                    flag = "黑色";
                    break;
                case "2":
                    flag = "白色";
                    break;
                case "3":
                    flag = "银灰色";
                    break;
                case "4":
                    flag = "深灰色";
                    break;
                case "5":
                    flag = "红色";
                    break;
                case "6":
                    flag = "橙色";
                    break;
                case "7":
                    flag = "多彩色";
                    break;
                case "8":
                    flag = "绿色";
                    break;
                case "9":
                    flag = "蓝色";
                    break;
                case "10":
                    flag = "咖啡色";
                    break;
                case "11":
                    flag = "紫色";
                    break;
                case "12":
                    flag = "香槟色";
                    break;
                case "13":
                    flag = "黄色";
                    break;
                case "14":
                    flag = "其它";
                    break;
                default:
                    break;
                    flag = "未知";
            }
            return flag;
        }

    }).filter('Country', function() {
        //车辆国别
        return function(status) {
            var flag = "";
            status=status+"";
            switch (status) {
                case "0":
                    flag = "未知";
                    break;
                case "1":
                    flag = "德系";
                    break;
                case "2":
                    flag = "日系";
                    break;
                case "3":
                    flag = "美系";
                    break;
                case "4":
                    flag = "法系";
                    break;
                case "5":
                    flag = "韩系";
                    break;
                case "6":
                    flag = "自主";
                    break;
                case "7":
                    flag = "其他";
                    break;
                default:
                    break;
                    flag = "未知";
            }
            return flag;
        }
    }).filter('CarStyle', function() {
        //车类型
        return function(status) {
            var flag = "";
            if (status > "8") {
                return '未知';
            }
            switch (parseInt(status)) {
                case 0:
                    flag = "未知";
                    break;
                case 1:
                    flag = "轿车";
                    break;
                case 2:
                    flag = "SUV";
                    break;
                case 3:
                    flag = "MPV";
                    break;
                case 4:
                    flag = "跑车";
                    break;
                case 5:
                    flag = "其他";
                    break;
                default:
                    break;
                    flag = "其他";
            }
            return flag;
        }
    }).filter('GearBox', function() {
        //车辆变速箱
        return function(status) {
            var flag = "";
            status=status+"";
            if (status > "8") {
                return '未知';
            }
            switch (status) {
                case "0":
                    flag = "未知";
                    break;
                case "1":
                    flag = "手动";
                    break;
                case "2":
                    flag = "自动";
                    break;
                default:
                    break;
                    flag = "未知";
            }
            return flag;
        }
    }).filter('OutputVolume', function() {
        //车辆排量
        return function(status) {
            var flag = "";
            switch (status) {
                case "0":
                    flag = "未知";
                    break;
                case "1":
                    flag = "1.0L以下";
                    break;
                case "2":
                    flag = "1.0-1.6L";
                    break;
                case "3":
                    flag = "1.6-2.0L";
                    break;
                case "4":
                    flag = "2.0-3.0L";
                    break;
                case "5":
                    flag = "3.0L以上";
                    break;
                default:
                    break;
                    flag = "未知";
            }
            return flag;
        }
    }).filter('PinYing',function(){
        //开通城市首字母
        return function(array) {
            if(!array){
                return null;
            }
            var arr=[];
            angular.forEach(array,function(obj,index){
                var py=PingYin(obj.CityName);
                if(py){
                    obj.PinYing=py[0];
                    arr.push(obj);
                }

            });
            var map = {},
                dest = [];
            for(var i = 0; i < arr.length; i++){
                var ai = arr[i];
                if(!map[ai.PinYing]){
                    dest.push({
                        PinYing: ai.PinYing,
                        City: [ai]
                    });
                    map[ai.PinYing] = ai;
                }else{
                    for(var j = 0; j < dest.length; j++){
                        var dj = dest[j];
                        if(dj.PinYing == ai.PinYing){
                            dj.City.push(ai);
                            break;
                        }
                    }
                }
            }
            function sortByPinYing(a,b){
                return a.PinYing>b.PinYing
            }
            dest.sort(sortByPinYing);
            return dest;


        }

    }).filter('AppraiserSkill',function(){
        //评估师技能
        return function(appr,skill) {
            if(!appr){
                return null;
            }
            var map = {},
                dest = [];
            if(skill){
                var map = {},
                    dest = [];
                for(var i = 0; i < skill.length; i++){
                    var ai = skill[i];
                    if(!map[ai.AppraiserCode]){
                        dest.push({
                            AppraiserCode: ai.AppraiserCode,
                            AppraiserSkill: [ai]
                        });
                        map[ai.AppraiserCode] = ai;
                    }else{
                        for(var j = 0; j < dest.length; j++){
                            var dj = dest[j];
                            if(dj.AppraiserCode == ai.AppraiserCode){
                                dj.AppraiserSkill.push(ai);
                                break;
                            }
                        }
                    }
                }
            }
            var map1 = {},
                dest1 = [];
            for(var m=0;m<appr.length;m++){
                var a=appr[m];
                a.Skill=[];
                for(var n=0;n<dest.length;n++){

                    var p=dest[n];
                    if(a.AppraiserCode==p.AppraiserCode){
                        a.Skill=p.AppraiserSkill;
                        dest1.push(a);
                        break;
                    }
                }
            }
            return appr;
        }
    }).filter('ApprOrderStatus', function() {
        //评估检测状态
        return function(status) {
            status = status + "";
            var descr = "";
            switch (status) {
                case "0":
                    descr = "未付款";
                    break;
                case "1":
                    descr = "已付款待接单";
                    break;
                case "2":
                    descr = "待评估";
                    break;
                case "3":
                    descr = "评估师评价";
                    break;
                case "4":
                    descr = "用户评价";
                    break;
                case "5":
                    descr = "客户已评价";
                    break;
                case "6":
                    descr = "订单完成";
                    break;
                case "255":
                    descr = "订单完成";
                    break;
                default:
                    descr = "未知：" + status;
                    break;

            }
            return descr;
        }
    }).filter('UserInfo',['$filter','$sce',function($filter,$sce){
        //格式化个人中心名称
        return function(data){
               if(data.Business){
                  var elemt='<span class="white" >'+data.Business.CompanyName+'</span><small style="margin-left: 20px"><span class="label label-info">商家</span></small>';
                  return   $sce.trustAsHtml(elemt)
               }
               else{
                   var elemt='<span class="white" >'+(data.User.UserName||data.User.Account)+'</span> <small style="margin-left: 20px"><span class="label label-info">个人用户</span></small>';
                   return   $sce.trustAsHtml(elemt)
               }
        }
    }]).filter('Cash',['$filter','$sce',function($filter,$sce){
        //格式化余额显示
        return function(data){
            if(data.User.IdentityTag==3&&data.Business){
                var elemt=' <h3 class="highlighted-sum" >'+$filter('currency')(data.Business.Balance,"￥")+'</h3><div><a class="btn btn-outline-primary btn-embossed" ui-sref=".deposit" href="#/home/deposit">提现</a></div>';
                return   $sce.trustAsHtml(elemt)
            }
            else{
                var elemt=' <h3 class="highlighted-sum" >'+$filter('currency')(data.User.Balance,"￥")+'</h3><div><a class="btn btn-outline-primary btn-embossed" ui-sref=".deposit" href="#/home/deposit">提现</a></div>';
                return   $sce.trustAsHtml(elemt)
            }
        }
    }]).filter('EntrustOrder',function(){
        //评估师技能
        return function(order,car) {
            if(!order){
                return null;
            }
            var map1 = {},
                dest1 = [];
            for(var m=0;m<order.length;m++){
                var a=order[m];
                a.Car=[];
                for(var n=0;n<car.length;n++){
                    var p=car[n];
                    if(a.CarNo==p.CarNo){
                        a.Car=p;
                        break;
                    }
                }
            }
            return order;
        }
    });
