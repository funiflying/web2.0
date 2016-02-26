/**
 * Created by Administrator on 2016/2/18.
 */
angular.module('chetongxiang.services',[]).factory('ResourceService', ['$resource', '$rootScope','$q', function($resource, $rootScope,$q) {
    return {
        getFunServer: function(sname,params,method) {
            var surl = "",defer = $q.defer();
            switch (sname) {
                case "RequestHomeData"://首页车源
                    surl = "/Common/Car/RequestHomeData/";
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
                case "CarListServcie"://车辆筛选
                    surl='/common/car/SearchCarForMobile';
                    break;
                case 'brandlist-search'://品牌查询
                    surl='/data/Brand.json';
                    break;
                case 'SendPhoneValCode'://发送手机验证码
                    surl='/common/message/SendValiadeCode';
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
                    surl='/order/UserRevokeRequest';
                    break;
                case 'sellrevoke'://卖家撤单
                    surl='/order/CarOwnerRevokeRequest';
                    break;
                case 'amount'://修改成交价
                    surl='/order/CarOwnerUpdateOrder';
                    break;
                case 'login'://登录
                    surl='/account/OutAndAllanceLogin';
                    break;
                case 'loginout'://登出
                    surl='/account/LoginOff';
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
                    surl='/common/car/GetCarCreditInfoByCarNo';
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
                case 'updateUser':
                    surl='/account/UpdatingUser';//更新用户信息
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
                    surl='/JoinMessage/JoinMessage/AddJoinMessage';//买车请求
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
                    surl='/common/message/ValideMessageCode';  //短信验证
                    break;
                default:
                    break;
            }
            if (surl == "") return '';
            $resource($rootScope.HOST + surl, {}, {
                query: {
                    method: method||'get',
                    params: params||'{}',
                    isArray: false
                }
            }).query(function(data, headers) {
                defer.resolve(data);
            }, function(data, headers) {
                defer.reject(data);
            })
            return defer.promise;
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
        },
        setSearchCarHistory:function(stateParams){
            if(!stateParams.SearchValue){
                return;
            }
            var SEARCH_CAR_HISTORY=this.getStorage('SEARCH_CAR_HISTORY')||{DATA:[]};
            var count=0;
            if(SEARCH_CAR_HISTORY.DATA.length==0){
                SEARCH_CAR_HISTORY.DATA.push(stateParams);
            }
            else{
                angular.forEach(SEARCH_CAR_HISTORY.DATA,function(obj,index){
                    if((stateParams.SeriesID&&obj.BrandID==stateParams.BrandID&&obj.SeriesID==stateParams.SeriesID)||(!stateParams.SeriesID&&obj.BrandID==stateParams.BrandID)){
                        count++;
                    }
                })
                if(count==0){
                    SEARCH_CAR_HISTORY.DATA.push(stateParams)
                }
            }
            this.setStorage('SEARCH_CAR_HISTORY',SEARCH_CAR_HISTORY);
        },
        getSearchCarHistory:function(){
            var SEARCH_CAR_HISTORY=this.getStorage('SEARCH_CAR_HISTORY')||{DATA:[]};
            return SEARCH_CAR_HISTORY.DATA
        },
        clearSearchCarHistory:function(){
            this.removeStorage('SEARCH_CAR_HISTORY')
        }
    }
}).factory('UploaderService',['$http','$rootScope',function($http,$rootScope){
    return {
        uploader:function(data,flag){
            flag=parseInt(flag)
            switch (flag){
                case 1:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForCar',data)
                    break;
                case 2:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForUser',data)
                    break;
                case 3:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForAppraiserSign',data)
                    break;
                case 4:
                    return $http.post($rootScope.HOST+'/common/file/UpLoadImgByBase64ForCertificateImg',data)
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
        WriteTestReport:function(data){
            return $http.post($rootScope.HOST+'/Alliance/TestReport/WriteTestReport',data)
        },
        OrderPostTestReport:function(data){
            return $http.post($rootScope.HOST+'/Order/OrderPostTestReport',data)
        }

    }

}])