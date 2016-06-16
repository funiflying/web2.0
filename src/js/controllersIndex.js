/**
 * Created by Administrator on 2016/2/18.
 */
angular.module('chetongxiang.controllers',[]).controller('LoginController',['$rootScope','$scope','$cookieStore','ResourceService','AuthService',function($rootScope,$scope,$cookieStore,ResourceService,AuthService){
    //本地用户名
    $scope.account={
        Account:$cookieStore.get('NAME')||null
    };
    //记住用户名
    $scope.remember=true;
    $scope.login=function(dialog){
        if($scope.loginForm.$valid){
            ResourceService.getFunServer('login',$scope.account,'post').then(function(data){
                if(data.status){
                    AuthService.Login(data.data);
                    $rootScope.USER=data.data;
                    if(dialog){
                        //弹出层登录
                        $scope.cancel();
                    }
                    else{
                        $rootScope.state.go('home.main');
                    }
                    //记住用户名
                    if($scope.remember){
                        CookieService.SetCookie('NAME',$scope.account.Account)
                    }
                    else{
                        CookieService.RemoveCookie('NAME');
                    }
                }
                else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    }
                }

            })
        }
    };
    //退出
    $scope.loginOff=function(){
        ResourceService.getFunServer('loginout',{}).then(function(data){
            AuthService.LoginOut();
        });
    };
    //接受短信验证码
    $scope.fetchTradekeyCode=function(){
        var params={
            phoneNum:$scope.phoneEditor.Contact
        };
        if($scope.phoneEditor.Contact==$scope.profile.Contact){
            $scope.phoneEditor.errorType='bind-red';
            $scope.phoneEditor.error='您输入的手机号已当前手机号码一致';
        }
        else{
            ResourceService.getFunServer('SendPhoneValCode',params).then(function(data){
                if(data.status==1){
                    $scope.timmer();
                    $scope.phoneEditor.errorType='text-info';
                    $scope.phoneEditor.error='验证码已发送至您'+$filter('ClipPhone')($scope.phoneEditor.Contact)+'的手机，请注意查收';
                }
            })
        }

    };

}]).controller('IndexController', ['$rootScope','$scope','$filter','$http','ResourceService','CarService','$resource','$compile','cfpLoadingBar', function ($rootScope,$scope,$filter,$http,ResourceService,CarService,$resource,$compile,cfpLoadingBar) {
    var tpl=$compile('<li class="car-item" ng-repeat="obj in list" city="{{obj.CityName}}" ng-show="list.length>00">'+
        '<div class="list-infoBox">'+
        '<a href="item.html?CarNo={{obj.CarNo}}" target="_blank">'+
        '<img ng-src="{{obj.HomePicID||DefaultCarIcon}}" />'+
        '</a>'+
        '<p class="infoBox">'+
        '<a href="item.html?CarNo={{obj.CarNo}}" class="info-title" title="{{obj.SpecName}}" ng-bind="obj.SpecName"></a>'+
        '</p>'+
        '<p class="fc-gray">'+
        '<span class="" ng-bind="obj.Buyyear|DateFormat:\'yyyy年MM月\'"></span>上牌'+
        '<em class="shuxian">|</em>'+
        '行驶<span ng-bind="obj.Mileage"></span>万公里'+
        '</p>'+
        '<p class="priType-s">'+
        '<span>'+
        '<i class="fc-org priType">'+
        '<span ng-bind-html="obj|CarPrice"></span>'+
        '</i>'+
        '</span>'+
        '</p>'+
        '</div>'+
        '<span class="ren-icon" ng-bind-html="obj|FormatIndexDetection"></span>'+
        '<span class="report-count"  ng-if="obj.BuyIntentionCount>0">已有<i ng-bind="obj.BuyIntentionCount"></i>人委托评估</span>'+
        '<span class="car-item-city" ng-bind="obj.CityName"></span>'+
        '<a class="trading" ng-if="obj.CarFlag==1" href="item.html?CarNo={{obj.CarNo}}" target="_blank"></a>'+
        '</li>')($scope);

    var peertpl=$compile('<li class="car-item" ng-repeat="obj in list" city="{{obj.CityName}}" ng-show="list.length>00">'+
        '<div class="list-infoBox">'+
        '<a href="item.html?CarNo={{obj.CarNo}}" target="_blank">'+
        '<img ng-src="{{obj.HomePicID||DefaultCarIcon}}" />'+
        '</a>'+
        '<p class="infoBox">'+
        '<a href="item.html?CarNo={{obj.CarNo}}" class="info-title" title="{{obj.SpecName}}" ng-bind="obj.SpecName"></a>'+
        '</p>'+
        '<p class="fc-gray">'+
        '<span class="" ng-bind="obj.Buyyear|DateFormat:\'yyyy年MM月\'"></span>上牌'+
        '<em class="shuxian">|</em>'+
        '行驶<span ng-bind="obj.Mileage"></span>万公里'+
        '</p>'+
        '<p class="priType-s">'+
        '<span>'+
        '<i class="fc-org priType">'+
        '<span ng-bind-html="obj|WholesalePrice"></span>'+
        '</i>'+
        '</span>'+
        '</p>'+
        '</div>'+
        '<span class="ren-icon" ng-bind-html="obj|FormatIndexDetection"></span>'+
        '<span class="report-count"  ng-if="obj.BuyIntentionCount>0">已有<i ng-bind="obj.BuyIntentionCount"></i>人委托评估</span>'+
        '<span class="car-item-city" ng-bind="obj.CityName"></span>'+
        '<a class="trading" ng-if="obj.CarFlag==1" href="item.html?CarNo={{obj.CarNo}}" target="_blank"></a>'+
        '</li>')($scope);

    if(window.location.href.indexOf('peer.html')>0&&(!$rootScope.USER||$rootScope.USER&&$rootScope.USER.IdentityTag==0)){
        $rootScope.toast('您没有访问权限',function(){
            window.location.href='index.html';
            return false
        })
    }

    $scope.currentPage=1;
    $scope.showMore=false;
    $scope.hideMore=true;
    $scope.showCityMore=false;
    $scope.hideCityMore=true;
    $scope.Test_ReportPic={
        CarPic:[],
        ProcudPic:[],
        FlawPic:[],
        ProofPic:[]
    };
    //获取直营公司城市
    $scope.getChain=function(){
        ResourceService.getFunServer('servicecity',{}).then(function(data){
            if(data.status==1){
                $scope.chain=data.data.rows;

                $scope.cityArr=data.data.rows;
                $scope.city=$scope.cityArr.slice(0,10).sort();
                $scope.cityArr.length>10?$scope.showCityMore=true:$scope.showCityMore=false;
            }
        })
    };
    //更多城市
    $scope.showCity=function(){
        $scope.city=$scope.cityArr;
        $scope.showCityMore=!$scope.showCityMore;
        $scope.hideCityMore=false;
    };
    $scope.hideCity=function(){
        $scope.showCityMore=!$scope.showCityMore;
        $scope.hideCityMore=true;
        $scope.city=$scope.cityArr.slice(0,10);
    };
    //筛选条件
    $scope.filter={
        PageNo:$scope.currentPage,
        PageNum:24,
        Brand: null,
        CarYearID:null,
        CityID: $rootScope.CITY.CityID||'',
        Color: null,
        Country: null,
        DischargeStandard: null,
        GearBox: null,
        IsUrgent: null,
        MileageID: null,
        OutputVolume: null,
        PriceEnd: null,
        PriceID:null,
        PriceStart: null,
        QuasiNewCar: null,
        SearchWord: null,
        Series: null,
        SevenSeat:null,
        Sort: null,
        Style: null,
        WomenCar:null,
        CarNo:null,
        IncludeFlag:null
    };
    $scope.QS=QueryString();
    delete  $scope.QS.q;
    for(var obj in $scope.QS){
        $scope.filter[obj]=$scope.QS[obj];
    }
    //首页车源
    $scope.getHomeCar=function(type){

        var params={
            CarType:type||0,
            City:$rootScope.CITY.CityID||''
        };
        ResourceService.getFunServer('RequestHomeData',params).then(function(data){
            if(data.status==1){
                $scope.list=data.data;
                $('.car-list').append(tpl);
            }else{
                $scope.list=[];
            }
        })
    };
    //车系列表
    $scope.series=
        [
            {"BrandID":48,"SeriesID":3,"SeriesName":"福克斯",BrandName:'福特'},
            {"BrandID":22,"SeriesID":1,"SeriesName":"凯越",BrandName:'别克'},
            {"BrandID":34,"SeriesID":16,"SeriesName":"宝来",BrandName:'大众'},
            {"BrandID":34,"SeriesID":4,"SeriesName":"朗逸",BrandName:'大众'},
            {"BrandID":152,"SeriesID":1,"SeriesName":"宏光",BrandName:'五菱汽车'},
            {"BrandID":34,"SeriesID":17,"SeriesName":"高尔夫",BrandName:'大众'},
            {"BrandID":45,"SeriesID":9,"SeriesName":"卡罗拉",BrandName:'丰田'},
            {"BrandID":34,"SeriesID":1,"SeriesName":"Polo",BrandName:'大众'},
            {"BrandID":45,"SeriesID":3,"SeriesName":"凯美瑞",BrandName:'丰田'},
            {"BrandID":8,"SeriesID":1,"SeriesName":"宝马5系",BrandName:'宝马'},
            {"BrandID":126,"SeriesID":7,"SeriesName":"天籁",BrandName:'日产'},
            {"BrandID":157,"SeriesID":2,"SeriesName":"世嘉",BrandName:'雪铁龙'},
            {"BrandID":107,"SeriesID":6,"SeriesName":"马自达3",BrandName:'马自达'},
            {"BrandID":22,"SeriesID":3,"SeriesName":"英朗",BrandName:'别克'},
            {"BrandID":156,"SeriesID":3,"SeriesName":"科鲁兹",BrandName:'雪佛兰'}
        ];
    //车源列表
    $scope.getList=function(){
        $scope.filter.IsUrgent=parseInt($scope.filter.IsUrgent);
        $scope.filter.QuasiNewCar=parseInt($scope.filter.QuasiNewCar);
        $scope.filter.WomenCar=parseInt($scope.filter.WomenCar);
        $scope.filter.SevenSeat=parseInt($scope.filter.SevenSeat);
        $scope.filter.Sort=parseInt($scope.filter.Sort);
        CarService.Searchcar($scope.filter).success(function(data){
            if(data.status==1){
                if(data.count){
                    angular.forEach(data.data,function(obj,index){
                        if(obj.name=='Carsource'){
                            $scope.list=obj.value;
                            $scope.pageTotal=data.count;
                            $('.car-list').append(tpl);
                        }
                    })
                }else{
                    $scope.list=[];
                    $scope.pageTotal=0;
                }
            }
        });
        /*ResourceService.getFunServer('CarList',$scope.filter).then(function(data){
            if(data.status==1){
                if(data.count){
                    angular.forEach(data.data,function(obj,index){
                        if(obj.name=='Carsource'){
                            $scope.list=obj.value;
                            $scope.pageTotal=data.count;
                            $('.car-list').append(tpl);
                        }
                    })
                }else{
                    $scope.list=[];
                    $scope.pageTotal=0;
                }
            }
        });*/
    };
    //车系列表
    $scope.getSeries=function(){
        if($scope.filter.Brand==null){
            return;
        }
        var params={
            BrandID:$scope.filter.Brand
        };

        $http.get('./data/brandlist-new.json').success(function(data){
            if(data.data){
                var s=[];
                angular.forEach(data.data,function(obj,index){
                    if(obj.brandID==$scope.filter.Brand){
                        s=obj.chexi
                    }
                });
                var d=[];
                angular.forEach(s,function(obj,index){
                    if(obj.SeriesID==$scope.filter.Series){
                        d.unshift(obj)
                        delete s[index];
                        s=d.concat(s);
                    }
                });
                $scope.seriesArr=s;
                $scope.series=$scope.seriesArr.slice(0,10);
                $scope.seriesArr.length>10?$scope.showMore=true:$scope.showMore=false;
            }
            else{
                $scope.series=
                    [
                        {"BrandID":48,"SeriesID":3,"SeriesName":"福克斯",BrandName:'福特'},
                        {"BrandID":22,"SeriesID":1,"SeriesName":"凯越",BrandName:'别克'},
                        {"BrandID":34,"SeriesID":16,"SeriesName":"宝来",BrandName:'大众'},
                        {"BrandID":34,"SeriesID":4,"SeriesName":"朗逸",BrandName:'大众'},
                        {"BrandID":152,"SeriesID":1,"SeriesName":"宏光",BrandName:'五菱汽车'},
                        {"BrandID":34,"SeriesID":17,"SeriesName":"高尔夫",BrandName:'大众'},
                        {"BrandID":45,"SeriesID":9,"SeriesName":"卡罗拉",BrandName:'丰田'},
                        {"BrandID":34,"SeriesID":1,"SeriesName":"Polo",BrandName:'大众'},
                        {"BrandID":45,"SeriesID":3,"SeriesName":"凯美瑞",BrandName:'丰田'},
                        {"BrandID":8,"SeriesID":1,"SeriesName":"宝马5系",BrandName:'宝马'},
                        {"BrandID":126,"SeriesID":7,"SeriesName":"天籁",BrandName:'日产'},
                        {"BrandID":157,"SeriesID":2,"SeriesName":"世嘉",BrandName:'雪铁龙'},
                        {"BrandID":107,"SeriesID":6,"SeriesName":"马自达3",BrandName:'马自达'},
                        {"BrandID":22,"SeriesID":3,"SeriesName":"英朗",BrandName:'别克'},
                        {"BrandID":156,"SeriesID":3,"SeriesName":"科鲁兹",BrandName:'雪佛兰'}
                    ];
            }

        });
    };
    //更多车系
    $scope.show=function(){
        $scope.series=$scope.seriesArr;
        $scope.showMore=!$scope.showMore;
        $scope.hideMore=false;
    };
    //更多车系
    $scope.hide=function(){
        $scope.showMore=!$scope.showMore;
        $scope.hideMore=true;
        $scope.series=$scope.seriesArr.slice(0,10);
    };
    //同行
    $scope.peerList=function(){
        ResourceService.getFunServer('CarList',$scope.filter).then(function(data){
            if(data.status==1){
                if(data.count){
                    angular.forEach(data.data,function(obj,index){
                        if(obj.name=='Carsource'){
                            $scope.list=obj.value;
                            $scope.pageTotal=data.count;
                            $('.car-list').append(peertpl);
                        }
                    })
                }else{
                    $scope.list=[];
                    $scope.pageTotal=0;
                }
            }
        });
    };
    //翻页
    $scope.changePager=function(){
        window.scrollTo(0,0);
        $scope.filter.PageNo=$scope.currentPage;
        var QS=QueryString();
        delete  QS.q;
        for(var obj in QS){
            $scope.filter[obj]=QS[obj];
        }
        $scope.getList();
    };

    //车辆详情
    $scope.getCar=function(){
        var params={
            CarNo:$scope.QS.CarNo
        };
        ResourceService.getFunServer('GetCardata',params).then(function(data){
            if(data.status==1){
                var val=data.data;
                var o=new Object();
                for(var i=0;i<val.length;i++){
                    var name=val[i].name;
                    switch (name){
                        case 'Car':
                            $scope.car=val[i].value[0];
                            $scope.cover=$scope.car.HomePicID;
                            break;
                        case 'CarPic':
                            $scope.CarPic=val[i].value;
                            $scope.p=0;
                            $scope.len=($scope.CarPic.length % 12 == 0 ? $scope.CarPic.length / 12 : Math.ceil($scope.CarPic.length /12));
                            if($scope.len==1){
                                $scope.Pic=$scope.CarPic;
                            }else{
                                $scope.Pic=$scope.CarPic.slice($scope.p,12)
                            }
                            break;
                        case "Test_Report":
                            $scope.report = val[i].value[0];
                            break;
                        case "Test_ReportDetail":
                            $scope.report.ReportDetail = val[i].value;
                            break;
                        case "Test_ReportCarSurfaceCase":
                            $scope.report.SurfaceCase = val[i].value;
                            break;
                        case "Test_ReportPic":
                            $scope.report.Test_ReportPic = val[i].value;
                            break;
                        case "Test_ReportCarInfo":
                            $scope.report.Car = val[i].value[0];
                            $scope.report.Car.OutputVolumeDetail=$scope.car.OutputVolumeDetail;
                            break;
                        default:

                            break;
                    }
                }
                if($scope.report&&$scope.report.Car==null){
                    $scope.report.Car=$scope.car
                }
                viewReport()
            }
        })
    };
    //排序
    var sortByFlag=function(a,b){
        return Number(a.SerialNO)< Number(b.SerialNO);
    };
    var viewReport=function(){
        if(!$scope.report){
            return ;
        }
        $scope.score={
            'background-image':'url("../images/detection/'+$scope.report.CarRate+'.png")'
        };
        var accident=0;
        var hs_ps=0;
        var repair=0;
        var replace=0;
        var nei=0;
        var gcpz=0;
        var aq=0;
        var fdj=0;
        var dz=0;
        var meiy=0;
        angular.forEach($scope.report.ReportDetail,function(obj,index){
            if(obj.AbnormalColumn==0){
                return;
            }
            if(obj.Flag==1&&obj.Param1==null){
                //电动反光镜，电动车窗
                if(obj.AbnormalColumn==144||obj.AbnormalColumn==140){
                    angular.element('#'+obj.AbnormalColumn).find('i[data-name='+obj.DeviceType+']').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                }
                else if(obj.DeviceType>0){
                    angular.element('span[data-name='+obj.AbnormalColumn+']').text(obj.Description)
                }
                angular.element('i#'+obj.AbnormalColumn).removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                angular.element('.detect-accident-'+obj.AbnormalColumn).addClass('active')
                if((obj.AbnormalColumn<18||obj.AbnormalColumn==123||obj.AbnormalColumn==124)){
                    accident++;
                    angular.element('#shigu .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#shigu').find('span').text(accident+'项');
                }
                else if(obj.AbnormalColumn>114&&obj.AbnormalColumn<122||obj.AbnormalColumn>157&&obj.AbnormalColumn<162){
                    fdj++;
                    angular.element('#fdj .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#fdj').find('span').text(fdj+'项');
                    $('#fdj_TJ').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ').text(fdj+'项异常')
                }
                else if(obj.AbnormalColumn>129&&obj.AbnormalColumn<138){
                    aq++;
                    angular.element('#aq .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#aq').find('span').text(aq+'项');
                }
                else if(obj.AbnormalColumn>18&&obj.AbnormalColumn<32){
                    hs_ps++;
                    angular.element('#hs_ps .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#hs_ps').find('span').text(hs_ps+'项');
                }else{
                    dz++;
                    angular.element('#dz .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#dz').find('span').text(dz+'项');
                    $('#dz_TJ').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ').text(dz+'项异常')
                }
            }
            if(obj.Flag==1&&obj.Param1==1){
                //修复
                angular.element('#'+obj.AbnormalColumn).addClass('carAIblue_'+obj.AbnormalColumn);
                repair++;
                angular.element('#repair .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                angular.element('#repair').find('span').text(repair+'项');
            }
            if(obj.Flag==1&&obj.Param1==2){
                //更换
                angular.element('#'+obj.AbnormalColumn).addClass('carAIGH_'+obj.AbnormalColumn);

                if(obj.AbnormalColumn<65){
                    replace++;
                    angular.element('#replace .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#replace').find('span').text(replace+'项');
                }
                else if(obj.AbnormalColumn>64&&obj.AbnormalColumn<88){
                    nei++;
                    angular.element('#nei .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#nei').find('span').text(nei+'项');
                }
            }
            if(obj.Flag==1&&obj.Param1==3){
                //色差
                angular.element('#'+obj.AbnormalColumn).addClass('carAISC_'+obj.AbnormalColumn)
            }
            if(obj.Flag==0){
                angular.element('#'+obj.AbnormalColumn).remove();
                angular.element('span[data-name='+obj.AbnormalColumn+']').text('无');
                meiy++;
            }
            else{
                if(obj.DeviceType>0){
                    angular.element('span[data-name='+obj.AbnormalColumn+']').text(obj.Description)
                }
            }

        });
        angular.forEach($scope.report.SurfaceCase,function(obj,index){
            if(obj.ProblemFlag==1){
                //刮擦
                var flag=$('<i class="e_guacha"  style="left: '+obj.X+'px; top: '+obj.Y+'px;"></i>');
                $('#GC_PZ').append(flag)
            }
            if(obj.ProblemFlag==2){
                //碰撞
                flag=$('<i class="e_pengzhuang"  style="left: '+obj.X+'px; top: '+obj.Y+'px;"></i>');
                $('#GC_PZ').append(flag)
            }
            gcpz++;
            angular.element('#gcpz .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
            angular.element('#gcpz').find('span').text(gcpz+'项');
        });
        angular.forEach($scope.report.Test_ReportPic,function(obj,index){
            if(obj.PictureFlag==0){
                $scope.Test_ReportPic.CarPic.push(obj);
            }
            if(obj.PictureFlag==1){
                $scope.Test_ReportPic.ProcudPic.push(obj);
            }
            if(obj.PictureFlag==2){
                $scope.Test_ReportPic.FlawPic.push(obj);
            }
            if(obj.PictureFlag==3){
                $scope.Test_ReportPic.ProofPic.push(obj);
            }
        });
        $scope.Test_ReportPic.CarPic.sort(sortByFlag);
        $scope.Test_ReportPic.ProcudPic.sort(sortByFlag);
        $scope.Test_ReportPic.FlawPic.sort(sortByFlag);
        $scope.Test_ReportPic.ProofPic.sort(sortByFlag);

    };
    //查看大图
    $scope.changeCover=function(src){
        $scope.cover=src;
    };
    //切换缩略图
    $scope.next=function(){
        $scope.p++;
        if($scope.p<$scope.len){
            $scope.Pic=$scope.CarPic.slice(12* $scope.p,12*($scope.p+1));
        }else{
            $scope.p=$scope.p-1;
        }
    };
    $scope.previous=function(){
        if($scope.p==0){
            $scope.Pic=$scope.CarPic.slice(0,12);
        }
        else{
            $scope.p--;
            $scope.Pic=$scope.CarPic.slice(12* $scope.p,12*($scope.p+1));
        }
    };
    //提交订单

    $scope.orderDialog=function(car){
        $scope.configorder=car;
        
        $scope.city = $("#city").val();
        $scope.CityID = $("#city").attr("city");
        if(!$scope.CityID&&$scope.city!='请选择收车城市'){
            $scope.alert={
                type:'alert-warning',
                msg:'请选择收车城市'
            };
        }
        
        if(!$rootScope.USER){
            $scope.alert={
                type:'alert-warning',
                msg:'您还未登录，请登录'
            };
            $rootScope.dialog('logindialog.html','LoginController',$scope,function(){
                if($rootScope.USER){
                    $scope.alert={
                        type:'',
                        msg:''
                    };
                    $scope.orderDialog(car);
                }
            });
            return false;
        }
        $rootScope.dialog('./admin/configorder.html','IndexController',$scope);

    };

    $scope.orderSubmit=function(){

        //if(!angular.element('#city').attr('city')){
        if(!$scope.CityID){
            $scope.alert={
                type:'alert-warning',
                msg:'请选择收车城市'
            };
        }
        else{
            var params={
                CityID:$scope.CityID,//angular.element('#city').attr('city'),
                CarNo:$scope.QS.CarNo
            };
            ResourceService.getFunServer('submitorder',params).then(function(data){
                if(data.status==1){
                    window.location.href='admin.html#/success?TAG=ORDER'
                }else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    };
                }
            })
        }
    };
    //卖车
    $scope.getsellcount = function() {
        CarService.carsellcount().success(function(data){
            if(!isNaN(data)){
                $scope.sellcount = data;
            }
        })
    };
    $scope.getCity=function(){
        ResourceService.getFunServer('city',{}).then(function(data){
            if(data.status==1){
                $scope.AreaDataList = data.data[0].children;
            }
        })
    };
    $scope.sell=function(){
        var params={
            EventFlag:0,
            CityID:$scope.xuanchengshi.CityID,
            CityName:$scope.xuanchengshi.Name,
            ContactPhone:$scope.ContactPhone,
            Contact:$scope.Contact

        };
        ResourceService.getFunServer('sellcar',params).then(function(data){
            if(data.status==1){
                $rootScope.toast('您已提交申请,客服人员会与您电话联系,请耐心等待',function(){
                    window.location.reload();
                })
            }else{
                $rootScope.toast(data.message)
            }
        })
    };
    //入驻
    $scope.getjoincount = function(flag) {
        CarService.joinCount(flag).success(function(data) {
            if(!isNaN(data)){
                $scope.joincount = data;
            }
        })
    };
    $scope.join=function(){
        var params={
            EventFlag:1,
            CityID:$scope.xuanchengshi.CityID,
            CityName:$scope.xuanchengshi.Name,
            ContactPhone:$scope.ContactPhone,
            Contact:$scope.Contact
        };
        ResourceService.getFunServer('sellcar',params).then(function(data){
            if(data.status==1){
                $rootScope.toast('您已提交申请,客服人员会与您电话联系,请耐心等待',function(){
                    window.location.reload();
                })
            }else{
                $rootScope.toast(data.message)
            }
        })
    };
    var atap=$compile('<li class="expert-list-item" ng-repeat="obj in list">'+
        '<div class="title">'+
        '<span>【<i ng-bind="obj.CityName"></i>】</span>&nbsp;&nbsp;<span ng-bind="obj.UserName"></span>&nbsp;<span ng-bind="obj.Contact"></span>'+
    '</div>'+
    '<div class="expert-list-item-container">'+
        '<div class="icon">'+
        '<img ng-src="{{obj.HeadImage||DefaultUserIcon}}" alt=""/>'+
        '</div>'+
        '<div class="describe">'+
        '<p>编号：<span ng-bind="obj.AppraiserCode">6030711043736</span></p>'+
    '<p  class="skill-repeat">擅长品牌：<span ng-repeat="skill in obj.Skill" ng-bind="skill.BrandName"></span></p>'+
    '<p>评估次数：<span class="text-orange" ng-bind="obj.EntrustTestCount||0">0</span>次'+
        '<span style="margin-left: 10px">好评率：<span class="text-orange" ng-bind="obj.EntrustGoodPerson||100">100</span>%</span>'+
    '</p>'+
    '<p>地址：<span ng-bind="obj.Address||\'暂无地址信息\'"></span></p>'+
    '</div>'+
    '</div>'+
    '</li>')($scope);
    //专家库
    $scope.expert_filter={
        CityID:0,
        PageNo:$scope.currentPage,
        PageNum:10,
        SeriesID:0,
        BrandID:0
    };
    delete  $scope.QS.BrandName;
    for(var obj in $scope.QS){
        if(obj=='Brand'){
            $scope.expert_filter['BrandID']=$scope.QS['Brand'];
        }
        else{
            $scope.expert_filter[obj]=$scope.QS[obj];
        }
    };

    $scope.getExpert=function(){
        $scope.expert_filter.CityID=$rootScope.CITY.CityID||0;
        ResourceService.getFunServer('expert',$scope.expert_filter).then(function(data){
            if(data.status==1){
                $scope.list=$filter('AppraiserSkill')(data.data.rows['Appraiser'],data.data.rows['AppraiserSkill']);
                $scope.pageTotal=data.data.total;
                $('.expert-list').append(atap);
            }
            else{
                $scope.list=[];
                $scope.pageTotal=0;
            }
        })
    };
    $scope.getAppraise=function(){
        $scope.expert_filter.CityID=$rootScope.CITY.CityID||0;
        ResourceService.getFunServer('expert',$scope.expert_filter).then(function(data){
            if(data.status==1){
                $scope.list=$filter('AppraiserSkill')(data.data.rows['Appraiser'],data.data.rows['AppraiserSkill']);
                $scope.pageTotal=data.data.total;
            }
            else{
                $scope.list=[];
                $scope.pageTotal=0;
            }
        })
    };
    //翻页
    $scope.changeCityPager=function(){
        window.scrollTo(0,0);
        $scope.expert_filter.PageNo=$scope.currentPage;
        var QS=QueryString();
        delete  QS.q;
        for(var obj in QS){
            $scope.expert_filter['BrandID']=obj['Brand']
            $scope.expert_filter[obj]=QS[obj];
        }
        $scope.getExpert();
    };
    //翻页
    $scope.changeAppPager=function(){
        window.scrollTo(0,0);
        $scope.expert_filter.PageNo=$scope.currentPage;
        var QS=QueryString();
        delete  QS.q;
        for(var obj in QS){
            $scope.expert_filter['BrandID']=QS['Brand']||0;
            $scope.expert_filter[obj]=QS[obj];
        }
        $scope.getAppraise();
    };
    //委托车同享安排评估师下单
    $scope.toctx = function() {

        if(!$rootScope.USER){
            $scope.alert={
                type:'alert-warning',
                msg:'您还未登录，请登录'
            };
            $rootScope.dialog('logindialog.html','LoginController',$scope);
            return false;
        }

        var params = {
            CarNo: $scope.QS.CarNo
        };
        ResourceService.getFunServer('CarEvalutionRequest',params).then(function(data){
            if(data.status==1){
                window.location.href='admin.html#/success?TAG=APPRSISER'

            }else{
                $rootScope.toast(data.message)
            }
        });
    };
    //提交评估请求
    $scope.requestDialog=function(obj){
        $scope.appraiser_req=obj;
        if(!$rootScope.USER){
            $scope.alert={
                type:'alert-warning',
                msg:'您还未登录，请登录'
            };
            $rootScope.dialog('logindialog.html','LoginController',$scope,function(){
                if($rootScope.USER){
                    $scope.alert={
                        type:'',
                        msg:null
                    };
                    $rootScope.dialog('./admin/request.html','LoginController',$scope);
                }


            },$scope);
            return false;
        }else{
            $rootScope.dialog('./admin/request.html','LoginController',$scope);
        }
    };
    $scope.request=function(){
        var params = {
            CarNo:$scope.QS.CarNo ,
            AppraiserFee:angular.element('#fees').val(),
            OrderDescription: "",
            OrderFlag: 1,
            AppraiserCode:$scope.appraiser_req.AppraiserCode
        };
        ResourceService.getFunServer('TestEntrust',params).then(function(data){
            if(data.data){
                $scope.alert={
                    type:'alert-success',
                    msg:'您的委托请求提交成功,正为你转向支付页面......'
                };
                setTimeout(function(){
                    window.location.href='admin.html#/pay?OrderCode='+data.data+'&Amount='+params.AppraiserFee;
                },1500)
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                };
            }
        })
    };
    
    //急售
    $scope.getUrgent=function(){
       var params={
           CarFlag: 255,
           CheckFlag: 2,
           pageNo: $scope.currentPage,
           pageNum: 20
       };
       ResourceService.getFunServer('worrylist',params).then(function(data){
           if(data.rows){
              $scope.list=data.rows;
              $scope.pageTotal=data.total;
           }else{
               $scope.pageTotal=0;
           }
       })

    };
    //翻页
    $scope.changeUrgentPager=function(){
        window.scrollTo(0,0);
        $scope.getUrgent();
    };
    //急售详情
    $scope.urgentDialog=function(obj){
        $scope.urgent=obj;
        $rootScope.dialog('./admin/urgent.html','IndexController',$scope);

    };

}]).controller('ViewDetectionController',['$rootScope','$scope','ResourceService','$filter','CarService',function ($rootScope,$scope,ResourceService,$filter,CarService){
    var CarNo=QueryString().CarNo;

    var viewReport=function(){
        if(!$scope.report){
            return ;
        }
        $scope.score={
            'background-image':'url("../images/detection/'+$scope.report.CarRate+'.png")'
        };
        var accident=0;
        var hs_ps=0;
        var repair=0;
        var replace=0;
        var nei=0;
        var gcpz=0;
        var aq=0;
        var fdj=0;
        var dz=0;
        var meiy=0;
        angular.forEach($scope.report.ReportDetail,function(obj,index){
            if(obj.AbnormalColumn==0){
                return;
            }
            if(obj.Flag==1&&obj.Param1==null){
                //电动反光镜，电动车窗
                if(obj.AbnormalColumn==144||obj.AbnormalColumn==140){
                    angular.element('#'+obj.AbnormalColumn).find('i[data-name='+obj.DeviceType+']').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                }
                else if(obj.DeviceType>0){
                    angular.element('span[data-name='+obj.AbnormalColumn+']').text(obj.Description)
                }
                angular.element('i#'+obj.AbnormalColumn).removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                angular.element('.detect-accident-'+obj.AbnormalColumn).addClass('active');
                if((obj.AbnormalColumn<18||obj.AbnormalColumn==123||obj.AbnormalColumn==124)){
                    accident++;
                    angular.element('#shigu .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#shigu').find('span').text(accident+'项');

                }

                else if(obj.AbnormalColumn>114&&obj.AbnormalColumn<122||obj.AbnormalColumn>157&&obj.AbnormalColumn<162){
                    fdj++;
                    angular.element('#fdj .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#fdj').find('span').text(fdj+'项');
                    $('#fdj_TJ').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ').text(fdj+'项异常')
                }
                else if(obj.AbnormalColumn>129&&obj.AbnormalColumn<138){
                    aq++;
                    angular.element('#aq .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#aq').find('span').text(aq+'项');
                }
                else if(obj.AbnormalColumn>18&&obj.AbnormalColumn<32){
                    hs_ps++;
                    angular.element('#hs_ps .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#hs_ps').find('span').text(hs_ps+'项');
                }else{
                    dz++;
                    angular.element('#dz .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#dz').find('span').text(dz+'项');
                    $('#dz_TJ').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ').text(dz+'项异常')
                }
            }
            if(obj.Flag==1&&obj.Param1==1){
                //修复
                angular.element('#'+obj.AbnormalColumn).addClass('carAIblue_'+obj.AbnormalColumn);
                repair++;
                angular.element('#repair .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                angular.element('#repair').find('span').text(repair+'项');
            }
            if(obj.Flag==1&&obj.Param1==2){
                //更换
                angular.element('#'+obj.AbnormalColumn).addClass('carAIGH_'+obj.AbnormalColumn);

                if(obj.AbnormalColumn<65){
                    replace++;
                    angular.element('#replace .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#replace').find('span').text(replace+'项');
                }
                else if(obj.AbnormalColumn>64&&obj.AbnormalColumn<88){
                    nei++;
                    angular.element('#nei .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                    angular.element('#nei').find('span').text(nei+'项');
                }
            }
            if(obj.Flag==1&&obj.Param1==3){
                //色差
                angular.element('#'+obj.AbnormalColumn).addClass('carAISC_'+obj.AbnormalColumn)
            }
            if(obj.Flag==0){
                angular.element('#'+obj.AbnormalColumn).remove();
                angular.element('span[data-name='+obj.AbnormalColumn+']').text('无');
                meiy++;
            }
            else{
               if(obj.DeviceType>0){
                    angular.element('span[data-name='+obj.AbnormalColumn+']').text(obj.Description)
                }
            }

        });
        angular.forEach($scope.report.SurfaceCase,function(obj,index){
            if(obj.ProblemFlag==1){
                //刮擦
                var flag=$('<i class="e_guacha"  style="left: '+obj.X+'px; top: '+obj.Y+'px;"></i>');
                $('#GC_PZ').append(flag)
            }
            if(obj.ProblemFlag==2){
                //碰撞
                flag=$('<i class="e_pengzhuang"  style="left: '+obj.X+'px; top: '+obj.Y+'px;"></i>');
                $('#GC_PZ').append(flag)
            }
            gcpz++;
            angular.element('#gcpz .glyphicon').removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
            angular.element('#gcpz').find('span').text(gcpz+'项');
        });
        angular.forEach($scope.report.Test_ReportPic,function(obj,index){
            if(obj.PictureFlag==0){
                $scope.Test_ReportPic.CarPic.push(obj);
            }
            if(obj.PictureFlag==1){
                $scope.Test_ReportPic.ProcudPic.push(obj);
            }
            if(obj.PictureFlag==2){
                $scope.Test_ReportPic.FlawPic.push(obj);
            }
            if(obj.PictureFlag==3){
                $scope.Test_ReportPic.ProofPic.push(obj);
            }
        });
        if($scope.Test_ReportPic.CarPic.length==0){
            $scope.Test_ReportPic.CarPic=$scope.CarPic;
        }
        $scope.Test_ReportPic.CarPic&&$scope.Test_ReportPic.CarPic.sort(sortByFlag);
        $scope.Test_ReportPic.ProcudPic&&$scope.Test_ReportPic.ProcudPic.sort(sortByFlag);
        $scope.Test_ReportPic.FlawPic&&$scope.Test_ReportPic.FlawPic.sort(sortByFlag);
        $scope.Test_ReportPic.ProofPic&&$scope.Test_ReportPic.ProofPic.sort(sortByFlag);

    };
    //车辆详情
    $scope.getCar=function(){
        var params={
            CarNo:$scope.QS.CarNo
        };
        ResourceService.getFunServer('GetCardata',params).then(function(data){
            if(data.status==1){
                var val=data.data;
                var o=new Object();
                for(var i=0;i<val.length;i++){
                    var name=val[i].name;
                    switch (name){
                        case 'Car':
                            $scope.car=val[i].value[0];
                            $scope.cover=$scope.car.HomePicID;
                            break;
                        case 'CarPic':
                            $scope.CarPic=val[i].value;

                            break;
                        case "Test_Report":
                            $scope.report = val[i].value[0];
                            break;
                        case "Test_ReportDetail":
                            $scope.report.ReportDetail = val[i].value;
                            break;
                        case "Test_ReportCarSurfaceCase":
                            $scope.report.SurfaceCase = val[i].value;
                            break;
                        case "Test_ReportPic":
                            $scope.report.Test_ReportPic = val[i].value;
                            break;
                        case "Test_ReportCarInfo":
                            $scope.report.Car = val[i].value[0];
                            $scope.report.Car.OutputVolumeDetail=$scope.car.OutputVolumeDetail;
                            break;
                        default:

                            break;
                    }
                }
                if($scope.report&&$scope.report.Car==null){
                    $scope.report.Car=$scope.car
                }
                viewReport();
            }
        })
    };
    //排序
    var sortByFlag=function(a,b){
        return Number(a.SerialNO)< Number(b.SerialNO);
    };

}]).controller('ShopController',['$rootScope','$scope','ResourceService','$filter','$compile','CarService',function ($rootScope,$scope,ResourceService,$filter,$compile,CarService){
    $scope.QS=QueryString();
    $scope.pageTotal=0;
    $scope.currentPage=1;
    $scope.filter={
        AllianceCode:$scope.QS.AllianceCode,
        Sort:null,
        PageNo:$scope.currentPage,
        PageNum:24
     };
    for(var obj in $scope.QS){
        $scope.filter[obj]=$scope.QS[obj];
    }
    //诚信数据
    $scope.getCredit=function(){
        if($scope.QS.AllianceCode){
            ResourceService.getFunServer('GetCarCreditInfoByCode',{AllianceCode:$scope.QS.AllianceCode}).then(function(data){
                if (data.status == 1 && data.data&&data.data[0] != null) {
                    $scope.carcreditinfo = data.data[0]
                }
            })
        }else if($scope.QS.CarNo){
            ResourceService.getFunServer('GetCarCreditInfoByCarNo',{CarNo:$scope.QS.CarNo}).then(function(data){
                if (data.status == 1 && data.data&&data.data[0] != null) {
                    $scope.carcreditinfo = data.data[0]
                }
            })
        }

    };
    var tpl=$compile('<li class="car-item" ng-repeat="obj in list" city="{{obj.CityName}}" ng-show="list.length>00">'+
        '<div class="list-infoBox">'+
        '<a href="item.html?CarNo={{obj.CarNo}}" target="_blank">'+
        '<img ng-src="{{obj.HomePicID||DefaultCarIcon}}" />'+
        '</a>'+
        '<p class="infoBox">'+
        '<a href="item.html?CarNo={{obj.CarNo}}" class="info-title" title="{{obj.SpecName}}" ng-bind="obj.SpecName"></a>'+
        '</p>'+
        '<p class="fc-gray">'+
        '<span class="" ng-bind="obj.Buyyear|DateFormat:\'yyyy年MM月\'"></span>上牌'+
        '<em class="shuxian">|</em>'+
        '行驶<span ng-bind="obj.Mileage"></span>万公里'+
        '</p>'+
        '<p class="priType-s">'+
        '<span>'+
        '<i class="fc-org priType">'+
        '<span ng-bind-html="obj|CarPrice"></span>'+
        '</i>'+
        '</span>'+
        '</p>'+
        '</div>'+
        '<span class="ren-icon" ng-bind-html="obj|FormatIndexDetection"></span>'+
        '<span class="report-count"  ng-if="obj.BuyIntentionCount>0">已有<i ng-bind="obj.BuyIntentionCount"></i>人委托评估</span>'+
        '<span class="car-item-city" ng-bind="obj.CityName"></span>'+
        '<a class="trading" ng-if="obj.CarFlag==1" href="item.html?CarNo={{obj.CarNo}}" target="_blank"></a>'+
        '</li>')($scope);
    //
    $scope.getList=function(){

        ResourceService.getFunServer('shopcarlist',$scope.filter).then(function(data){
            if(data.status==1){
                if(data.data.total){
                    $scope.list=data.data.rows;
                    $scope.pageTotal=data.data.total;
                    $('.car-list').append(tpl);
                }else{
                    $scope.list=[];
                    $scope.pageTotal=0;
                }
            }
        });
    };

    //翻页
    $scope.changePager=function(){
        window.scrollTo(0,0);
        $scope.filter.PageNo=$scope.currentPage;
        delete  $scope.QS.q;
        for(var obj in $scope.QS){
            $scope.filter[obj]=$scope.QS[obj];
        }
        $scope.getList();
    };

}]).controller('SearchController',['$scope',function($scope){
    $scope.keyword=QueryString().keyword
    $scope.code=$scope.keyword;

}]);
