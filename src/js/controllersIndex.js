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
                    if(dialog){
                        //弹出层登录
                        $scope.cancel();
                    }
                    else{
                        $rootScope.state.go('home.main');
                    }
                    //记住用户名
                    if($scope.remember){
                        $cookieStore.put('NAME',$scope.account.Account)
                    }
                    else{
                        $cookieStore.remove('NAME');
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
            if(data.status==1){
                AuthService.LoginOut();
            }
        });
    }
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
}]).controller('IndexController', ['$rootScope','$scope','$filter','ResourceService','CarService', function ($rootScope,$scope,$filter,ResourceService,CarService) {
    if(window.location.href.indexOf('peer.html')>0&&(!$rootScope.USER||$rootScope.USER&&$rootScope.USER.IdentityTag==0)){
        $rootScope.toast('您没有访问权限',function(){
            window.location.href='index.html';
            return false
        })
    }
    $scope.code='';
    $scope.currentPage=1;
    $scope.showMore=false;
    $scope.hideMore=true;
    $scope.showCityMore=false;
    $scope.hideCityMore=true;
    //获取直营公司城市
    $scope.getChain=function(){
        ResourceService.getFunServer('servicecity',{}).then(function(data){
            if(data.status==1){
                $scope.chain=$filter('PinYing')(data.data.rows);
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
        CarYear:null,
        CityID: $rootScope.CITY.CityID,
        Color: null,
        Country: null,
        DischargeStandard: null,
        GearBox: null,
        IsUrgent: null,
        Mileage: null,
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
            City:$rootScope.CITY.CityID
        };
        ResourceService.getFunServer('RequestHomeData',params).then(function(data){
            if(data.status==1){
                $scope.list=data.data;
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
        ResourceService.getFunServer('CarList',$scope.filter).then(function(data){
            if(data.status==1){
                if(data.count){
                    angular.forEach(data.data,function(obj,index){
                        if(obj.name=='Carsource'){
                            $scope.list=obj.value;
                            $scope.pageTotal=data.count;
                        }
                    })
                }else{
                    $scope.list=[];
                    $scope.pageTotal=0;
                }
            }
        });
    };
    //车系列表
    $scope.getSeries=function(){
        if($scope.filter.Brand==null){
            return;
        }
        var params={
            BrandID:$scope.filter.Brand
        };
        ResourceService.getFunServer('Series',params).then(function(data){
            if(data.status==1){
                if(data.data.length>0){
                    $scope.seriesArr=$filter('SeriesName')(data.data,$scope.filter.BrandName,$scope.filter.Series);
                    $scope.series=$scope.seriesArr.slice(0,10);
                    $scope.seriesArr.length>10?$scope.showMore=true:$scope.showMore=false;
                }
                else{
                    $scope.series=[];
                }
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
        })
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
        ResourceService.getFunServer('CarPeerList',$scope.filter).then(function(data){
            if(data.status==1){
                if(data.count){
                    angular.forEach(data.data,function(obj,index){
                        if(obj.name=='Carsource'){
                            $scope.list=obj.value;
                            $scope.pageTotal=data.count;
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
        $scope.filter.PageNo=$scope.currentPage;
        var QS=QueryString();
        delete  QS.q;
        for(var obj in QS){
            $scope.filter[obj]=QS[obj];
        }
        $scope.getList();
    };
    //搜索
    $scope.search=function(){
        var QS=QueryString();
        if(!$scope.code){
            return;
        }
        if(!isNaN($scope.code)&&$scope.code.length==13){
            QS.CarNo=$scope.code;
        }
        else{
            QS.CarNo=null;
            QS.SearchWord=$scope.code;
        }

        var href='?q=0';
        delete  QS.q;
        for(var obj in QS){
            href+='&'+obj+'='+QS[obj];
        }
        window.location.href=window.location.href.replace(location.search,'')+href;
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
                        default:
                            obj=val[i].value[0];
                            break;
                    }
                }
                viewReport();
            }
        })
    };
    var viewReport=function(){
        $scope.score={
            'background-image':'url("../images/detection/'+$scope.report.CarRate+'.png")'
        };
        angular.forEach($scope.report.ReportDetail,function(obj,index){
            if(obj.Flag==1&&obj.Param1==null){
                angular.element('#'+obj.AbnormalColumn).removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                angular.element('.detect-accident-'+obj.AbnormalColumn).addClass('active')
            }
            if(obj.Flag==1&&obj.Param1==1){
                //修复
                angular.element('#'+obj.AbnormalColumn).addClass('carAIblue_'+obj.AbnormalColumn)
            }
            if(obj.Flag==1&&obj.Param1==2){
                //更换
                angular.element('#'+obj.AbnormalColumn).addClass('carAIGH_'+obj.AbnormalColumn)
            }
            if(obj.Flag==1&&obj.Param1==3){
                //修复
                angular.element('#'+obj.AbnormalColumn).addClass('carAISC_'+obj.AbnormalColumn)
            }
            if(obj.Flag==0){
                angular.element('#'+obj.AbnormalColumn).removeClass('glyphicon-ok-sign').text('无')
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
        })

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
    $scope.orderSubmit=function(){
        if(!$rootScope.USER){
            $scope.alert={
                type:'alert-warning',
                msg:'您还未登录，请登录'
            };
            $rootScope.dialog('logindialog.html','LoginController',$scope);
            return false;
        }
        if(!angular.element('#city').attr('city')){
            $rootScope.toast('请输入收车城市')
        }
        else{
            var params={
                CityID:angular.element('#city').attr('city'),
                CarNo:$scope.QS.CarNo
            };
            ResourceService.getFunServer('submitorder',params).then(function(data){
                if(data.status==1){
                    window.location.href='admin.html#/success?TAG='+'ORDER';

                }else{
                    $rootScope.toast(data.message)
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
            ContactPhone:$scope.ContactPhone

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
    }
    $scope.join=function(){
        var params={
            EventFlag:1,
            CityID:$scope.xuanchengshi.CityID,
            CityName:$scope.xuanchengshi.Name,
            ContactPhone:$scope.ContactPhone
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
    if($scope.expert_filter.CityID.length>4){
        $scope.expert_filter.CityID= $scope.expert_filter.CityID.substring(0,4);
    }
    $scope.getExpert=function(){
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
        $scope.expert_filter.PageNo=$scope.currentPage;
        var QS=QueryString();
        delete  QS.q;
        for(var obj in QS){
            $scope.expert_filter['BrandID']=obj['Brand']
            $scope.expert_filter[obj]=QS[obj];
        }
        $scope.getExpert();
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
                window.location.href='admin.html#/success?TAG='+'APPRSISER';
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
    }
}]);
