angular.module('chetongxiang',['ui.bootstrap','ui.router','ngResource','ngCookies','chetongxiang.controllers','chetongxiang.services','chetongxiang.directives','chetongxiang.filters'])
    .config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider){

    $urlRouterProvider.otherwise('home/main',{

    });
    //access访问权限,0未不限制，1为需登录
    $stateProvider.state('login',{
        url:'/login',
        templateUrl:'./admin/login.html',
        controller:'LoginController',
        access:0
    }).state('home',{
        url:'/home',
        templateUrl:'./admin/home.html',
        access:1,
        action:'home',
    }).state('home.main',{
        url:'/main',
        templateUrl:'./admin/main.html',
        controller:'HomeController',
        access:1,
        action:'home'
    }).state('home.issuecar',{
        url:'/issuecar',
        templateUrl:'./admin/issuecar.html',
        controller:'CarController',
        access:1,
        action:'home'
    }).state('home.cargather',{
        url:'/cargather',
        templateUrl:'./admin/cargather.html',
        controller:'CarController',
        access:1,
        action:'home'
    }).state('home.editcar',{
        url:'/editcar?CarNo',
        templateUrl:'./admin/editcar.html',
        controller:'CarController',
        access:1,
        action:'home'
    })
}]).constant('PAGE_CONFIG',{
        PageSize:10,
        PageTotal:0,
        PageNo:1
    }).run(['$rootScope','$modal','$timeout','$stateParams','$state','$cookieStore','PAGE_CONFIG',function($rootScope,$modal,$timeout,$stateParams,$state,$cookieStore,PAGE_CONFIG){
    $rootScope.USER=$cookieStore.get('AUTH')||null;
    $rootScope.HOST='http://192.168.0.218';
    $rootScope.PAGE_CONF=PAGE_CONFIG;
    $rootScope.state=$state;
    $rootScope.stateParams=$stateParams;
    //默认车图
    $rootScope.DefaultCarIcon='./images/defaultCarIcon.png';
    //信息提示
    $rootScope.toast=function(msg,callback){
        var modalInstance = $modal.open({
            template : '<div class="modal-header">'+
            ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">'+
            '&times;'+
           '</button>'+
            '<header>'+
            '<div ng-if="!session.isAuthenticated" class="clearfix ng-scope">'+
             '<h3 class="modal-title">提示信息</h3>'+
            '</div>'+
           ' </header></div>'+
            '<div class="modal-body" style="min-height: 100px"><h4>'+msg+
           '</h4></div>'+
            '</div><div class="modal-footer">'+
           '<button class="btn btn-sm btn-default" ng-click="cancel()">退出</button>'+
           ' </div>',  //指向上面创建的视图
            size : 'sm'//大小配置
        });
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
    // $rootScope.toast('./admin/dialog.html')
   //$rootScope.dialog('./logindialog.html')

}]);