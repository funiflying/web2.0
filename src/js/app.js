﻿angular.module('chetongxiang',['ui.bootstrap','ui.router','ngResource','ngCookies','chetongxiang.controllers','chetongxiang.services','chetongxiang.directives','chetongxiang.filters','angular-loading-bar'])
    .config(['$stateProvider','$urlRouterProvider','$httpProvider','cfpLoadingBarProvider',function($stateProvider,$urlRouterProvider,$httpProvider,cfpLoadingBarProvider){
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $urlRouterProvider.otherwise('',{

    });
    //access访问权限,0未不限制，1为需登录
    $stateProvider.state('login',{
        //登录
        url:'/login',
        templateUrl:'./admin/login.html',
        controller:'LoginController',
        access:0
    }).state('register',{
            //注册
        url:'/register',
        templateUrl:'./admin/register.html',
        controller:'RegisterController',
        access:0
    }).state('password',{
        //找回密码
        url:'/password',
        templateUrl:'./admin/password.html',
        controller:'RegisterController',
        access:0
    }).state('appraiser',{
        //找回密码
        url:'/appraiser',
        templateUrl:'./admin/appraiser.html',
        controller:'IndexController',
        access:0
    }).state('success',{
        //成功状态
        url:'/success?TAG',
        templateUrl:'./admin/success.html',
        controller:'RegisterController',
        access:0
    }).state('pay',{
        //支付
        url:'/pay?OrderCode&Amount',
        templateUrl:'./admin/pay.html',
        controller:'PayController',
        access:1
    }).state('detection',{
        //检测报告
        url:'/detection?CarNo&OrderCode&Event',
        templateUrl:'./admin/detection.html',
        controller:'DetectionController',
        access:1
    }).state('assess',{
        //评估报告
        url:'/assess?OrderCode',
        templateUrl:'./admin/assess.html',
        controller:'AssessController',
        access:1
    }).state('view',{
        //查看检测
        url:'/view?Code&CarNO',
        templateUrl:'./admin/view-report.html',
        controller:'DetectionController',
        access:0
    }).state('view_assess',{
        //查看评估
        url:'/view-assess?Code',
        templateUrl:'./admin/view-assess.html',
        controller:'AssessController',
        access:0
    }).state('urgent',{
        //急售发布
        url:'/urgent',
        templateUrl:'./admin/issueurgent.html',
        controller:'CarController',
        access:0
    }).state('feedback',{
        //意见反馈
        url:'/feedback',
        templateUrl:'./admin/feedback.html',
        controller:'GeneralController',
        access:0
    }).state('handbook',{
        //意见反馈
        url:'/handbook',
        templateUrl:'./admin/handbook.html',
        controller:'GeneralController',
        access:0
    }).state('agreement',{
        //注册协议
        url:'/agreement',
        templateUrl:'./admin/agreement.html',
        access:0
    }).state('home',{
        url:'/home',
        templateUrl:'./admin/home.html',
        access:1,
        action:'main'
    }).state('home.main',{
        url:'/main',
        templateUrl:'./admin/main.html',
        controller:'MainController',
        access:1,
        action:'main'
    }).state('home.issuecar',{
        url:'/issuecar',
        templateUrl:'./admin/issuecar.html',
        controller:'CarController',
        access:1,
        action:'issuecar'
    }).state('home.cargather',{
        url:'/cargather',
        templateUrl:'./admin/cargather.html',
        controller:'CarController',
        access:1,
        action:'cargather'
    }).state('home.editcar',{
        url:'/editcar?CarNo&edittype',
        templateUrl:'./admin/editcar.html',
        controller:'CarController',
        access:1,
        action:'cargather'
    }).state('home.buyorder',{
        url:'/order?OUID',
        templateUrl:'./admin/buyorder.html',
        controller:'OrderController',
        access:1,
        action:'buyorder'
    }).state('home.sellorder',{
        url:'/sell?OUID',
        templateUrl:'./admin/sellorder.html',
        controller:'OrderController',
        access:1,
        action:'sellorder'
    }).state('home.detail',{
        url:'/item?OrderCode',
        templateUrl:'./admin/orderdetail.html',
        controller:'OrderController',
        access:1,
        action:'order'
    }).state('home.prepay',{
        url:'/prepay?OrderCode',
        templateUrl:'./admin/prepay.html',
        controller:'OrderController',
        access:1,
        action:'buyorder'
    }).state('home.paid',{
        url:'/paid?OrderCode',
        templateUrl:'./admin/paid.html',
        controller:'OrderController',
        access:1,
        action:'buyorder',
    }).state('home.sellpaid',{
        url:'/sellpaid?OrderCode',
        templateUrl:'./admin/sellpaid.html',
        controller:'OrderController',
        access:1,
        action:'buyorder',
    }).state('home.buyeval',{
        url:'/buyeval?OrderCode',
        templateUrl:'./admin/buyevaluate.html',
        controller:'OrderController',
        access:1,
        action:'buyorder',
    }).state('home.selleval',{
        url:'/selleval?OrderCode',
        templateUrl:'./admin/sellevaluate.html',
        controller:'OrderController',
        access:1,
        action:'sellorder'
    }).state('home.account',{
        url:'/account',
        templateUrl:'./admin/account.html',
        controller:'AccountController',
        access:1,
        action:'account'
    }).state('home.company',{
        url:'/company',
        templateUrl:'./admin/company.html',
        controller:'CompanyController',
        access:1,
        action:'company'
    }).state('home.employee',{
        url:'/employee',
        templateUrl:'./admin/employee.html',
        controller:'CompanyController',
        access:1,
        action:'employee'
    }).state('home.entrustorder',{
        url:'/entrustorder',
        templateUrl:'./admin/entrustorder.html',
        controller:'EntrustOrderController',
        access:1,
        action:'entrustorder'
    }).state('home.signature',{
        url:'/signature',
        templateUrl:'./admin/signature.html',
        controller:'AppraiserController',
        access:1,
        action:'signature'
    }).state('home.entrust',{
        url:'/entrust',
        templateUrl:'./admin/entrust.html',
        controller:'EntrustController',
        access:1,
        action:'entrust'
    }).state('home.approve',{
        url:'/approve',
        templateUrl:'./admin/approve.html',
        controller:'AppraiserController',
        access:1,
        action:'approve'
    }).state('home.bankcard',{
        url:'/bankcard',
        templateUrl:'./admin/bankcard.html',
        controller:'AccountController',
        access:1,
        action:'bank'
    }).state('home.withdrawal',{
        url:'/deposit',
        templateUrl:'./admin/withdrawal.html',
        controller:'AccountController',
        access:1,
        action:'deposit'
    }).state('home.professional',{
        url:'/professional',
        templateUrl:'./admin/professional.html',
        controller:'AppraiserController',
        access:1,
        action:'professional'
    }).state('home.consignor',{
        url:'/consignor?OrderCode',
        templateUrl:'./admin/consignorevaluate.html',
        controller:'EntrustOrderController',
        access:1,
        action:'entrustorder'
    }).state('home.appraiser',{
        url:'/appraiser?OrderCode',
        templateUrl:'./admin/appraiserevaluate.html',
        controller:'EntrustController',
        access:1,
        action:'entrust'
    }).state('home.coupon',{
        url:'/coupon',
        templateUrl:'./admin/coupon.html',
        controller:'CouponController',
        access:1,
        action:'coupon'
    }).state('home.discount',{
        url:'/discount?PolicyCode',
        templateUrl:'./admin/discount.html',
        controller:'CouponController',
        access:1,
        action:'coupon'
    }).state('home.offline',{
        url:'/offline',
        templateUrl:'./admin/offline.html',
        controller:'OfflineController',
        access:1,
        action:'offline'
    }).state('offline',{
        url:'/offline',
        templateUrl:'./admin/issueoffline.html',
        controller:'CarController',
        access:1,
        action:'offline'
    });
     $httpProvider.interceptors.push('myInterceptor');
}]).constant('PAGE_CONFIG',{
        PageSize:10,
        PageTotal:0,
        PageNo:1
    }).run(['$rootScope','$modal','$timeout','$stateParams','$state','$cookieStore','PAGE_CONFIG','AuthService','CookieService','$templateCache',function($rootScope,$modal,$timeout,$stateParams,$state,$cookieStore,PAGE_CONFIG,AuthService,CookieService,$templateCache){
    $rootScope.USER=CookieService.GetCookie('AUTH')||null;
    $rootScope.CITY=CookieService.GetCookie('CITY')||{CityName:'全国',CityID:''} ;
    $rootScope.HOST='';//window.location.protocol+window.location.host//
    $rootScope.PAGE_CONF=PAGE_CONFIG;
    $rootScope.state=$state;
    $rootScope.stateParams=$stateParams;
    //默认车图
    $rootScope.DefaultCarIcon='./images/defaultCarIcon.png';
      //默认头像
    $rootScope.DefaultUserIcon='./images/default-avator.png';
    //信息提示
    $rootScope.toast=function(msg,callback){
        var modalInstance = $modal.open({
            template : '<div class="modal-header">'+
            ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">'+
            '&times;'+
           '</button>'+
            '<div>'+
            '<div  class="clearfix">'+
             '<h3 class="modal-title">提示信息</h3>'+
            '</div>'+
           ' </div></div>'+
            '<div class="modal-body" style="height: 100px"><h4>'+msg+
           '</h4></div>'+
            '</div><div class="modal-footer">'+
           '<button class="btn btn-sm btn-default" ng-click="cancel()">退出</button>'+
           ' </div>',  //指向上面创建的视图
            size : 'sm'//大小配置
        });
        $rootScope.cancel=function(){
            modalInstance.close(
                angular.isFunction(callback)?callback():null
            );
        };
        $timeout(function(){
            modalInstance.close(
                angular.isFunction(callback)?callback():null
            );
        },2000)
    };
    //弹出模态框
    //url:模板路径,ctrl:控制器,scope:父级scope
    $rootScope.dialog=function(url,ctrl,scope,callback,size){
        scope=scope||$rootScope;
        var modalInstance = $modal.open({
            templateUrl : url,  //指向上面创建的视图
            controller : ctrl||null,// 初始化模态范围
            size : size, //大小配置
            scope : scope,
            backdrop:'static'
        });
        scope.cancel=function(){
            modalInstance.close();
        };
        modalInstance.result.then(function(){
            angular.isFunction(callback)?callback():null
        },function(){

        });
    };
        //路由控制
        $rootScope.$on("$stateChangeStart", function(event) {
            window.scrollTo(0,0)
        });
        $rootScope.$on('$stateChangeSuccess', function() {

            if($state.current.access==1&&!AuthService.IsAuthenticated()){
                $rootScope.alert={
                    type:'alert-warning',
                    msg:'您还未登录，或登录超时'
                };
                 $rootScope.dialog('logindialog.html','LoginController',$rootScope,function(){
                     if($rootScope.USER){
                         window.location.reload();
                     }
                     else{
                         $rootScope.state.go('login');
                     }
                 });
            }
            if ($state.current.action) {
                $rootScope.ACTION=$state.current.action
            }else{
                $rootScope.ACTION = "home"
            }
        });
        $rootScope.$on('$stateNotFound', function(event){
            $rootScope.state.go('404')
        });
}]).factory("myInterceptor",['$q', '$rootScope','CookieService','cfpLoadingBar', function($q,$rootScope,CookieService,cfpLoadingBar) {
        //http 拦截
        var requestInterceptor = {
            request: function(config) {
                cfpLoadingBar.start();
                return config;
            },
            requestError:function(config){
                return config
            },
            response:function(response){
                if(response.data.status==-1){
                    CookieService.RemoveCookie('AUTH');
                }
                cfpLoadingBar.complete();
                return response
            },
            responseError:function(response){
                console.log(response);
                return response
            }
        };
        return requestInterceptor;
    }]);