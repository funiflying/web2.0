angular.module('chetongxiang',['ui.bootstrap','ui.router','ngResource','ngCookies','chetongxiang.controllers','chetongxiang.services','chetongxiang.directives','chetongxiang.filters'])
    .config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider){

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
        //登录
        url:'/success?TAG',
        templateUrl:'./admin/success.html',
        controller:'RegisterController',
        access:0
    }).state('home',{
        url:'/home',
        templateUrl:'./admin/home.html',
        access:1,
        action:'main'
    }).state('home.main',{
        url:'/main',
        templateUrl:'./admin/main.html',
        controller:'',
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
        url:'/editcar?CarNo',
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
    }).state('home.entrust',{
        url:'/entrust',
        templateUrl:'./admin/entrust.html',
        controller:'EntrustController',
        access:1,
        action:'employee'
    });
     $httpProvider.interceptors.push('myInterceptor');
}]).constant('PAGE_CONFIG',{
        PageSize:10,
        PageTotal:0,
        PageNo:1
    }).run(['$rootScope','$modal','$timeout','$stateParams','$state','$cookieStore','PAGE_CONFIG','AuthService','CookieService',function($rootScope,$modal,$timeout,$stateParams,$state,$cookieStore,PAGE_CONFIG,AuthService,CookieService){
    $rootScope.USER=$cookieStore.get('AUTH')||null;
    $rootScope.CITY=CookieService.GetCookie('CITY')||{CityName:'全国',CityID:''} ;
    $rootScope.HOST='http://192.168.0.218';//window.location.protocol+window.location.host//
    $rootScope.PAGE_CONF=PAGE_CONFIG;
    $rootScope.state=$state;
    $rootScope.stateParams=$stateParams;
    //默认车图
    $rootScope.DefaultCarIcon='./images/defaultCarIcon.png'
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
            document.getElementsByTagName('body')[0].scrollTop=0;
        });
        $rootScope.$on('$stateChangeSuccess', function() {

            if($state.current.access==1&&!AuthService.IsAuthenticated()){
                 $rootScope.toast('您还没有登录或登录超时',function(){
                     $rootScope.state.go('login');
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

}]).factory("myInterceptor",['$q', '$rootScope', function($q,$rootScope) {
        //http 拦截
        var requestInterceptor = {
            request: function(config) {

                return config;
            },
            requestError:function(config){
                return config
            },
            response:function(response){
                if(response.data.status==-1){
                    $rootScope.toast('您还没有登录或登录超时',function(){
                        $rootScope.state.go('login');
                    });
                }

                return response
            },
            responseError:function(response){

                return response
            }
        };
        return requestInterceptor;
    }]);