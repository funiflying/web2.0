/**
 * Created by Administrator on 2016/2/18.
 */
angular.module('chetongxiang.services',[]).factory('ResourceService', ['$resource', '$rootScope','$q','$http', function($resource, $rootScope,$q,$http) {
    return {
        getFunServer: function(sname,params,method) {
            var surl = "",defer = $q.defer();
            switch (sname) {
                case "RequestHomeData"://首页车源
                    surl ="/Common/Car/RequestHomeData/";
                    break;
                case "brandlist"://品牌列表
                    surl = "/data/brandlist.json";
                    break;
                case "GetCardata"://车辆基本信息
                    surl = "/common/car/GetCardata";
                    break;
                case "GetTestReportWithCode"://检测报告
                    surl = "/Alliance/TestReport/GetTestReportWithCode";
                    break;
                case "CarList"://车辆筛选
                    surl='/common/car/SearchCar';
                    break;
                case "CarPeerList"://同行车辆筛选
                    surl='/common/car/SearchCarForMobile';
                    break;
                case 'brandlist-search'://品牌查询
                    surl='/data/Brand.json';
                    break;
                case 'SendPhoneValCode'://发送手机验证码
                    surl='/common/message/SendValiadeCode';//phone
                    break;
                case 'buyorderlist'://买车订单
                    surl='/order/UserGetOrderList';
                    break;
                case 'sellorderlist'://卖车订单
                    surl='/order/CarOwnerGetOrderList';
                    break;
                case 'order'://订单详情
                    surl='/order/GetOrderInfoWithCode';
                    break;
                case 'paycode'://汇款信息
                    surl='/order/SendBankInfoToBuyer';
                    break;
                case 'prepay'://预付款
                    surl='/Order/UserPrePay';
                    break;
                case 'fullpay'://全款
                    surl='/Order/UserPayAll';
                    break;
                case 'servicefees'://获取服务费
                    surl='/order/GetServiceFee';
                    break;
                case 'buyfeedback'://买家评价
                    surl='/order/UserFeedback';
                    break;
                case 'sellfeedback'://卖家评价
                    surl='/order/CarOwnerFeedback';
                    break;
                case 'buyrevoke'://买家撤单
                    surl='/order/UserRevokeRequest';//OrderCode,RevokeMemo
                    break;
                case 'sellrevoke'://卖家撤单
                    surl='/order/CarOwnerRevokeRequest';//OrderCode,RevokeMemo
                    break;
                case 'amount'://确认成交价
                    surl='/order/SellerConfirmPrice';//OrderCode,OrderPrice
                    break;
                case 'login'://登录
                    surl='/account/OutAndAllanceLogin';
                    break;
                case 'loginout'://登出
                    surl='/account/LoginOff';
                    break;
                case 'register'://注册
                    surl='/account/OutsiteRegister';
                    break;
                case 'GetCar':
                    surl='/common/car/GetCar';   //获取车源基本信息
                    break;
                case 'SearchAppraiserWithSkill':
                    surl='/Alliance/Appraiser/SearchAppraiserWithSkill'; //获取评估师列表
                    break;
                case 'cargather':
                    surl='/common/car/GetCarsByUserID'; //个人车源
                    break;
                case 'alliancecargather':
                    surl='/common/car/GetAllianceCarList'; //联盟商车源
                    break;
                case 'carsoldout':
                    surl='/common/car/PostCarRevoke'; //车源下架
                    break;
                case 'republish':
                    surl='/common/car/RePublish'; //车源重新发布
                    break;
                case 'delimg':
                    surl='/File/DelImage'; //删除图片?fileName=
                    break;
                case 'deletecarimg':
                    surl='/Common/Car/DeleteCarImg'; //删除车源图片?CarPicID=
                    break;
                case 'GetCarCreditInfoByCarNo':  //获取诚信数据
                    surl='/common/car/GetCarCreditInfoByCarNo';//CarNo
                    break;
                case 'Series':  //获取车系
                    surl='/Common/Carbrand/GetSeries';
                    break;
                case 'SpecName':  //获取车型号
                    surl='/carbrand/GetSpecByBrandSeries';
                    break;
                case 'release':  //发布车源
                    surl='/common/car/Publish';
                    break;
                case 'editcar':  //编辑车源
                    surl='/common/car/updatecar';
                    break;
                case 'UserGetOrderList':
                    //UserID=""&PageNo=""&history=1
                    surl='/Alliance/AppraiserOrder/UserGetOrderList';
                    break;
                case 'AppraiserAccept'://委托订单接单
                    surl='/Alliance/AppraiserOrder/AppraiserAccept';
                    break;
                case 'submitorder':
                    surl='/Order/userbuy';//提交买车订单
                    break;
                case 'orderTopay':
                    surl='/order/SendBankInfoToBuyer';  //汇款信息
                    break;
                case 'GetTestReportWithCode': //通过检测编号获取检测报告
                    surl='/Alliance/TestReport/GetTestReportWithCode';
                    break;
                case 'UserRevoke':  //我的委托评估－申请撤销
                    surl='/Alliance/AppraiserOrder/UserRevoke';  //AppraiserOrderCode
                    break;
                case 'AppraiserGetOrderList':  //评估师获取客户委托订单
                    surl='/Alliance/AppraiserOrder/AppraiserGetOrderList'; //AppraiserCode
                    break;
                case 'servicecity':
                    surl='/oa/direct/HomeGetAlldirectCity';//开通城市
                    break;
                case 'city':
                    surl='/common/City/getcity';//城市
                    break;
                case 'updateUser':
                    surl='/account/UpdatingUser';//更新用户信息
                    break;
                    break;
                case 'updateAllianceUser':
                    surl='/account/UpdatingAllianceUser';//更新联盟商用户信息
                    break;
                case 'resetPwd':
                    surl='/account/ChangePwd';//修改密码//newPwd,oldPwd
                    break;
                case 'findPwd':
                    surl='/account/ChangePwdByMobie';//找回密码// code, phonenum,newpwd
                    break;
                case 'hastradePwd':
                    surl='/account/CheckCurrentUserIfHasTradePwd';//是否设置交易密码
                    break;
                    break;
                case 'resetTradePwd':
                    surl='/account/ChangeTradePwd';//重置Trade
                    break;
                case 'checkTradePwd':
                    surl='/account/CheckCurrentUserIfHasTradePwd';//检测Trade
                    break;
                case 'apprasiorApply':
                    surl='/account/UserUpgradeApprasior';//评估师认证
                    break;
                case 'user':
                    surl='/account/GetCurrentUserinfo';//用户信息
                    break;
                case 'sellcar':
                    surl='/JoinMessage/JoinMessage/AddJoinMessage';//卖车请求
                    break;
                case 'sellcarcount':
                    surl='/Common/car/GetSellingCount';//在售车源
                    break;
                case 'alliance':
                    surl='/account/GetCurrentAllianceinfo';//联盟商
                    break;
                case 'withdraw':
                    surl='/Financial/FinanceNeedPay/PostExtraction';//提现
                    break;
                case 'AppraiserFeedBack':
                    surl='/Alliance/AppraiserOrder/AppraiserFeedBack'; //给评估师评价
                    break;
                case 'UserFeedBack':
                    surl='/AppraiserOrder/UserFeedBack'; //给委托人评价
                    break;
                case 'CarEvalutionRequest':
                    surl='/JoinMessage/JoinMessage/CarEvalutionRequest';  //请求金牌评估师评估
                    break;
                case  'discount':
                    surl='/DiscountPolicy/DiscountPolicy/UserGetDiscountPolicy'//'/DiscountPolicy/DiscountPolicy/GetDiscountPolicyByUser';//优惠券列表int PageNo, int PageSize = 20
                    break;
                case  'discountlog':
                    surl='/DiscountPolicy/DiscountPolicy/GetDiscountPolicysLogByUser';//优惠券明细记录int PageNo, int PageSize = 20
                    break;
                case  'discountinfo':
                    surl='/DiscountPolicy/DiscountPolicy/GetInfo';//优惠详情string PolicyCode
                    break;
                case  'discountusage':
                    surl='/Order/OrderUseDiscountPolicy';//优惠券抵扣购车服务费string OrderCode, string[] PolicyCodes
                    break;
                case 'TestEntrust':
                    surl='/Alliance/AppraiserOrder/TestEntrust';  //委托订单提交
                    break;
                case 'worrylist':
                    surl='/Common/CarWorrySell/GetCarWorrySellListWithFlag';  //急售列表
                    break;
                case 'worry':
                    surl='/Common/CarWorrySell/PublishWorryCar';  //急售发布
                    break;
                case 'guideprice':
                    surl='/common/car/GetGuidePrice';  //急售指导价
                    break;
                case 'validcode':
                    surl='/common/message/ValideMessageCode';  //短信验证 phonenum,code
                    break;
                case 'company':
                    surl='/alliance/alliance/GetCurrentAllanceAndUsers';  //联盟商信息 pageNo,pageNum
                	break;
                case 'updatecompany':
                    surl='/alliance/alliance/UpdateAllance';  //联盟商信息 entity
                    break;
                case 'deletemployee':
                    surl='/alliance/alliance/DeleteAllanceUser';  //联盟商信息 AllianceCode,User_Alliance_AllianceCode[{UserID:UserID}]
                    break;
                case 'addemployee':
                    surl='/Account/AddUser';  //新增联盟商成员 {"UserName":"","Contact":"","Account":"","Pwd":"","IdentityTag":""}
                    break;
                case 'isexist':
                    surl='/account/CheckIsExists';  //验证账号是否存在Contact，返回0为存在
                    break;
                case 'expert':
                    surl='/alliance/appraiser/SearchAppraiserWithIndex';  //专家库{"CityID":0,"BrandID":0,"SeriesID":0,"PageNo":1,"PageNum":10}
                    break;
                case 'appraiser':
                    surl='/Alliance/Appraiser/GetAppraiserInfo';  //评估师信息?AppraiserCode
                    break;
                case 'updateappraiser':
                    surl='/Alliance/Appraiser/UpdateAppraiser';  //更新评估师信息entity
                    break;
                case 'deleteSkill':
                    surl='/Alliance/AppraiserSkill/DeleteAppraiserSkill';  //删除评估师技能 SkillID
                    break;
                case 'addSkill':
                    surl='/Alliance/AppraiserSkill/AddAppraiserSkillList';  //添加评估师技能 [{ BrandID,AppraiserCode}]
                    break;
                case 'preassess':
                    surl='/Alliance/AppraiserOrder/GetOrderForEvaluationReportByCode';  //填写评估报告前获取相关数据 orderCode
                    break;
                case 'assess':
                    surl='/Alliance/AppraiserOrder/AppraiserFinishEvaluation';  //填写评估报告 string AppraiseOrderCode, Evaluation_Report ReportCode
                    break;
                case 'detection':
                    surl='/Alliance/AppraiserOrder/AppraiserFinishTest';  //填写评估报告 string AppraiseOrderCode, Test_Report TestReportCode ReportCode
                    break;
                case 'viewassess':
                    surl='/Alliance/EvaluationReport/GetEvaluationReportDetailByCode';  //查看评估报告 ReportCode=
                    break;
                case 'carcount':
                    surl='/common/car/GetMyCarDetailForUser';  //车源统计
                    break;
                case 'carconfig':
                    surl='/car/GetCatalogPara';  //车辆配置参数catalogid
                    break;
                case 'fb':
                    surl='/System/Feedback/PostInfo';  //反馈
                    break;
                case 'offline':
                    surl='/Customer/CarofflineTrade/GetOffLineTradeListWithUserID';  //线下检测列表
                    break;
                case 'issueoffline':
                    surl='/Customer/CarOfflineTrade/PostOffLineTrade';  //线下发布
                    break;
                case 'ExsitFrame':
                    surl='/car/CheckIfExsitFrame';  //车架号是否存在FrameNumber
                    break;
                default:
                    break;
            }
            if (surl == "") return '';
            $resource($rootScope.HOST + surl, {}, {
                query: {
                    method: method||'post',
                    params: params||'{}',
                    isArray: false
                }
            }).query(function(data, headers) {
                defer.resolve(data);
            }, function(data, headers) {
                defer.reject(data);
            });
            return defer.promise;
        },
        SendPhoneValCode:function(data){
            return $http.post($rootScope.HOST+'/common/message/SendValiadeCode',data)
        },
        //删除联盟商成员
        deletemployee:function(data){
            return $http.post($rootScope.HOST+'/alliance/alliance/DeleteAllanceUser',data)
        }
    }
}]).factory('LocalStorageService',function(){
    return {
        setStorage:function(name,val){
            localStorage.setItem(name,JSON.stringify(val))
        },
        getStorage:function(name){
            return JSON.parse(localStorage.getItem(name));
        },
        removeStorage:function(name){
            localStorage.removeItem(name)
        }
    }
}).factory('UploaderService',['$http','$rootScope',function($http,$rootScope){
    return {
        uploader:function(data,flag){
            flag=parseInt(flag)
            switch (flag){
                case 1:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForCar',data);
                    break;
                case 2:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForUser',data);
                    break;
                case 3:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForAppraiserSign',data);
                    break;
                case 4:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForCertificateImg',data);
                    break;
                default:
            }
            return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64',data)
        }
    }
}]).factory('CarService',['$http','$rootScope',function($http,$rootScope){
    return {
        release:function(data){
            return $http.post($rootScope.HOST+'/common/car/Publish',data)
        },
        edit:function(data){
            return $http.post($rootScope.HOST+'/common/car/updatecar',data)
        },
        carsellcount:function(){
            return $http.get($rootScope.HOST+'/Common/car/GetSellingCount')
        },
        joinCount:function(param){
            return $http.get($rootScope.HOST+'/Alliance/Alliance/GetAllianceCount?EventFlag='+param)
        },
        WriteTestReport:function(data){
            return $http.post($rootScope.HOST+'/Alliance/TestReport/WriteTestReport',data)
        },
        OrderPostTestReport:function(data){
            return $http.post($rootScope.HOST+'/Order/OrderPostTestReport',data)
        },
        serviceFees:function(data){
            return $http.post($rootScope.HOST+'/order/GetServiceFee',data);
        },
        detection:function(data){
            return $http.post($rootScope.HOST+'/Alliance/AppraiserOrder/AppraiserFinishTest',data);
        },
        assess:function(data){
            return $http.post($rootScope.HOST+'/Alliance/AppraiserOrder/AppraiserFinishEvaluation',data);
        },
        addCarInfo:function(data){
            return $http.post($rootScope.HOST+'/Alliance/TestReportCarInfo/AddTestReportCarInfo',data);
        },
        ConfirmPublishCar:function(data){
            //联盟商确认车源
            return $http.post($rootScope.HOST+'/common/car/ConfirmPublishCar',data)
        }
    }
}]).factory('AuthService',['$http','$rootScope','$cookieStore','ResourceService','CookieService',function($http,$rootScope,$cookieStore,ResourceService,CookieService){
    return {
        Login:function(data){
            $cookieStore.put('AUTH',data);
            CookieService.SetCookie('AUTH',data);
        },
        IsAuthenticated:function(){
         return CookieService.GetCookie('AUTH');
        },
        LoginOut:function(){
            CookieService.RemoveCookie('AUTH');
            $cookieStore.remove('AUTH');
            window.location.href="index.html";
        }
    }
}]).factory('CookieService',['$rootScope',function($rootScope){
    return {
        //自定义设置COOKIE
        SetCookie: function(name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(JSON.stringify(value)) + ";expires=" + exp.toGMTString();
        },
        //自定义获取COOKIE
        GetCookie: function(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            arr = document.cookie.match(reg);
            if (arr){
                return JSON.parse( unescape(arr[2]));
            }else{
                return null;
            }
        },
        RemoveCookie: function(name) {

            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = name + "=a; expires=" + date.toGMTString();
        },
        SetCityCookie:function(value){
            this.SetCookie('CITY',value);
        }

    }
}]).factory('PayService',['$http',function($http){
    return {
        //评估订单支付
        AppraiserPay: function(obj) {
            return $http.post('/Common/MSpay/RequestAppraiserPay', obj);
        },
        //支付
        payServlet: function(obj) {
            return $http.post('http://110.80.39.174:9012/gwpay/payServlet', obj);
        }
    }

}]).factory('AppraiserService',['$http',function($http){
    return {
        AddSkill: function(obj) {
            return $http.post('/Alliance/AppraiserSkill/AddAppraiserSkillList', obj);
        }
    }

}]);