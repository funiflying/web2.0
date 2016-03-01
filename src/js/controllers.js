/**
 * Created by Administrator on 2016/2/18.
 */
angular.module('chetongxiang.controllers',[]).controller('LoginController',['$rootScope','$scope','$cookieStore','ResourceService',function($rootScope,$scope,$cookieStore,ResourceService){
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
                    console.log(data.data);
                    $rootScope.USER=data.data;
                    $cookieStore.put('AUTH',data.data);
                    if(dialog){
                        //弹出层登录
                        $scope.cancel();
                    }
                    else{
                        $rootScope.state.go('home');
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
        ResourceService.getFunServer('loginout').then(function(data){
            if(data.status==1){
                $rootScope.state.go('login');
                $cookieStore.remove('AUTH');
            }

        });
    }
}]).controller('HomeController',['$rootScope','$scope','$sce',function($rootScope,$scope,$sce){
   $scope.availableCash=$sce.trustAsHtml('2004<small>.00</small>')



}]).controller('CarController',['$rootScope','$scope','$filter','ResourceService','CarService',function($rootScope,$scope,$filter,ResourceService,CarService){
    $scope.car={
        WholesalePrice:0,
        Mileage:0,
        TransferNo:0
    };
    $scope.CarNo=$rootScope.stateParams.CarNo;
    $scope.list=[];
    $scope.history=0;
    $scope.pageTotal=0;
    //读取车系
    $scope.getSeries=function(){
        var params={
            BrandID:angular.element('#newbrandid').val()
        };
        ResourceService.getFunServer('Series',params).then(function(data){
            if(data.status==1){
                $scope.series=data.data;
            }
            else{
                $scope.series=[];
            }
        })
    };
    //读取型号
    $scope.getArctics=function(){
        var params={
            brandid:angular.element('#newbrandid').val(),
            seriesid:$scope.car.Series
        };
        ResourceService.getFunServer('SpecName',params).then(function(data){
            if(data.status==1){
                $scope.arctics=data.data
            }
            else {
                $scope.arctics=[];
            }
        })
    };
    //读图片路径
    function getPicPath(){
        var cover=$('#car-cover').find('.file-preview-frame').attr('data-path');
        var pics=angular.element('#car-pics').find('.file-preview-frame');
        $scope.car.HomePicID=cover;
        $scope.car.CarPic_Car_CarNo=[];
        $.each(pics,function(index,obj){
            var o=new Object();
            o.PicAddr=$(obj).attr('data-path');
            $scope.car.CarPic_Car_CarNo.push(o);
        });
        if(!$scope.car.HomePicID||!$scope.car.CarPic_Car_CarNo.length>0){
          $rootScope.toast('请上传车辆图片');
           return false;
        }
        return true;
    }
    //发布车源
    $scope.issuecar=function(){
        if($scope.carissue.$valid){
            $scope.car.CatalogID=$scope.spec.CatalogID;
            $scope.car.SpecName=$scope.spec.SpecName;
            $scope.car.Color=$scope.Color;
            var pic= getPicPath();
            if(!pic){
                return;
            }
           $scope.car.RegisterPlace=$('#city').attr('city');
            CarService.release($scope.car).success(function(data){
                if(data.status==1){
                    $rootScope.toast('发布成功',function(){
                        $rootScope.state.go('home.cargather')
                    })
                }else{
                    $rootScope.toast(data.message);
                }
            })
        }
    };
    //读取车源
    $scope.getList=function(status){
        if(status!=undefined){
            $scope.history=status;
        }
        var params = {
            PageNo: $scope.currentPage||1,
            PageNum:$rootScope.PAGE_CONF.PageSize,
            history:$scope.history
        };
        //联盟商
        if($rootScope.USER&&$rootScope.USER.AllianceCode!=""){
            ResourceService.getFunServer('alliancecargather',params,'post').then(function(data){
                if(data.status==1){
                    $scope.list=data.data.rows;
                    $scope.pageTotal=data.data.total;
                }
                else {

                }

            });
        }
        //个人
        else{
            ResourceService.getFunServer('cargather',params,'post').then(function(data){
                if(data.status==1){
                    $scope.list=data.data.rows;
                    $rootScope.pageTotal=data.data.total;
                }
                else {

                }

            })
        }
    };
   //分页切换
    $scope.changePager=function(){
        $scope.getList();
    };
    //车源下架
    $scope.saleOffDialog=function(car){
        $scope.saleoff_car=car;
        $rootScope.dialog('./admin/saleoff.html','CarController',$scope,null);
    };
    $scope.setSaleOff=function(){
        $scope.saleoff.CarNo=$scope.saleoff_car.CarNo;
        ResourceService.getFunServer('carsoldout',$scope.saleoff,'post').then(function(data){
            if(data.status==1){
                $scope.alert={
                    msg:'提交成功',
                    type:'alert-success'
               };
                setTimeout(function(){
                    $scope.cancel();
                    window.location.reload()
                },1500);
            }
            else{
                $scope.alert={
                    msg:data.message,
                    type:'alert-danger'
                };

            }
        })
    };
    //重新发布
    $scope.republish=function(CarNo){
        var params={
            CarNo:CarNo
        }
        ResourceService.getFunServer('republish',params,'post').then(function(data){
            if(data.status==1){
                $rootScope.toast('发布成功',function(){
                    window.location.reload();
                })
            }
            else{
                $rootScope.toast(data.message)
            }
        })
    };
    //车辆详情
    $scope.carInfo=function(){
      var params={
          CarNo:$scope.CarNo
      };
      ResourceService.getFunServer('GetCar',params).then(function(data){
          if(data.status==1){
              var val=data.data;
              var o=new Object();
              for(var i=0;i<val.length;i++){
                  var name=val[i].name;
                  switch (name){
                      case 'Car':
                          var  o= val[i].value[0];
                          o.Mileage=parseInt(o.Mileage);
                          o.TransferNo=parseInt(o.TransferNo);
                          o.Price=parseFloat(o.Price);
                          o.WholesalePrice=parseFloat(o.WholesalePrice);
                          o.Buyyear =o.Buyyear&&$filter('DateFormat')(o.Buyyear,'yyyy-MM-dd');
                          o.InitialDate =o.InitialDate&&$filter('DateFormat')(o.InitialDate,'yyyy-MM-dd');
                          o.Annual_Inspect_Time =o.Annual_Inspect_Time&&$filter('DateFormat')(o.Annual_Inspect_Time,'yyyy-MM-dd');
                          o.Compulsory_insurance_Time =o.Compulsory_insurance_Time&&$filter('DateFormat')(o.Compulsory_insurance_Time,'yyyy-MM-dd');
                          o.Commercial_Insurance_Time =o.Commercial_Insurance_Time&&$filter('DateFormat')(o.Commercial_Insurance_Time,'yyyy-MM-dd');
                          o.IsUrgent=o.IsUrgent.toString().toLowerCase()=='true'?true:false;
                          o.QuasiNewCar=o.QuasiNewCar.toString().toLowerCase()=='true'?true:false;
                          o.LearnerCar=o.LearnerCar.toString().toLowerCase()=='true'?true:false;
                          o.WomenCar=o.WomenCar.toString().toLowerCase()=='true'?true:false;
                          o.SevenSeat=o.SevenSeat.toString().toLowerCase()=='true'?true:false;
                          o.DrivingLicense=o.DrivingLicense.toString().toLowerCase()=='true'?true:false;
                          o.Registration=o.Registration.toString().toLowerCase()=='true'?true:false;
                          o.PurchaseInvoices=o.PurchaseInvoices.toString().toLowerCase()=='true'?true:false;
                          o.IncludeTransferFee=o.IncludeTransferFee.toString().toLowerCase()=='true'?true:false;
                          o.CarPic_Car_CarNo=[];
                          $scope.car=o;
                          $scope.spec={
                              CatalogID:$scope.car.CatalogID,
                              SpecName:$scope.car.SpecName
                          };
                          $scope.Color=$scope.car.Color;
                          preview($scope.car.HomePicID,'#car-cover');
                          break;
                      case 'CarPic':
                          $scope.CarPic=val[i].value;
                         angular.forEach($scope.CarPic,function(obj,index){
                             if(index>0){
                                 preview(obj.PicAddr,'#car-pics',obj.CarPicID);
                             }
                         });
                          break;
                      default:
                        //  obj=val[i].value[0];
                          break;
                  }
              }
              return $scope.car;
          }
      });
    };
   //图片占位符
    function preview(src,element,id) {
        var holdplace =$( '<div  class="file-preview-frame col-md-3" data-path="'+src+'">' +
            '<img style="width:200px;height:160px;"  class="file-preview-image" src="' + src + '">' +
            '<div class="file-thumbnail-footer">' +
            '<div class="file-actions">' +
            '<div class="file-footer-buttons"></span>' +
            '<button title="删除" class="kv-file-upload btn btn-xs btn-default pull-right" type="button" value="'+id+'">   <i class="glyphicon glyphicon-trash text-danger"></i>'+
            '</button> ' +
            '</div></div></div></div>');
        $(element).find('.file-drop-zone-title').hide();
        $(element).find('.file-preview-thumbnails').append(holdplace);
        if(id==""||id==undefined){
            holdplace.find('.kv-file-upload').remove();
        }
        //删除
        var rm=$(element).find('.kv-file-upload');
        rm.bind('click',function(){
            var params={
                CarPicID:this.value
            };
            ResourceService.getFunServer('deletecarimg',params,'post').then(function(data){
                if(data.status==1){
                    $(this).parents('.file-preview-frame').remove();
                }
            });


        });
        return holdplace
    }
   //车源号查找
   $scope.search=function(){
       $scope.CarNo=$scope.searchCarNo;
       if($scope.CarNo==""){
           $scope.getList();
       }
       else{
           var params={
               CarNo:$scope.CarNo
           };
           ResourceService.getFunServer('GetCar',params).then(function(data){
               if(data.status==1){
                   var val=data.data;
                   for(var i=0;i<val.length;i++){
                       var name=val[i].name;
                       switch (name){
                           case 'Car':
                               $scope.list=val[i].value;
                               $scope.pageTotal=1;
                               break;
                           default:
                               break;
                       }
                   }
               }else{
                   $scope.list=[];
                   $scope.pageTotal=0;
               }
           });
       }
   }
   //修改品牌
    $scope.editabled=function(){
        $scope.isEdit=!$scope.isEdit;
    }
   //修改车源
    $scope.editcar=function(){
        if($scope.carissue.$valid){
            $scope.car.CatalogID=$scope.spec.CatalogID||$scope.car.CatalogID;
            $scope.car.SpecName=$scope.spec.SpecName||$scope.car.SpecName;
            $scope.car.Color=$scope.Color;
            var pic= getPicPath();
            if(!pic){
                return;
            }
            $scope.car.RegisterPlace=$('#city').attr('city');
            CarService.edit($scope.car).success(function(data){
                if(data.status==1){
                    $rootScope.toast('编辑成功',function(){
                        $rootScope.state.go('home.cargather')
                    })
                }else{
                    $rootScope.toast(data.message);
                }
            })
        }
    }
}]).controller('OrderController', ['$rootScope','$scope','$filter','ResourceService', function ($rootScope,$scope,$filter,ResourceService) {
    $scope.pageTotal=0;

    //获取订单
    $scope.history=0;
    $scope.getList=function(status){
        if(status!=undefined){
            $scope.history=status;
        }
        var params = {
            PageNo: $scope.currentPage||1,
            PageNum:$rootScope.PAGE_CONF.PageSize,
            history:$scope.history
        };
        //买车订单
        if($rootScope.stateParams.OUID==0){
            ResourceService.getFunServer('buyorderlist',params,'post').then(function(data){
                if(data.rows){
                    $scope.list=data.rows;
                    $scope.pageTotal=parseInt(data.total) ;
                }
                else {

                }

            });
        }
        //卖车订单
        else if($rootScope.stateParams.OUID==1){
            ResourceService.getFunServer('sellorderlist',params,'post').then(function(data){
                if(data.rows){
                    $scope.list=data.rows;
                    $rootScope.pageTotal=parseInt(data.total);
                }
                else {

                }

            })
        }





    };
    //订单详情
    $scope.getOrder=function(OrderCode){
        var params={
            OrderCode:$rootScope.stateParams.OrderCode
        };
        ResourceService.getFunServer('order',params).then(function(data){
            if(data.status==1){
                $scope.order=data.data.rows[0];
                var date= new Date((new Date($scope.order.OrderTime)/1000+(86400*2))*1000)
                $scope.payTime=date.Format('yyyy年MM月dd日');
            }
        })

    };
    //订单号查询
    $scope.search=function(){
        var params={
            OrderCode:$scope.searchCode
        };
    };
    //获取汇款信息
    $scope.getpay=function(payTotal){
        var params={
            OrderCode:$scope.order.OrderCode,
            paymount:$scope.PrePayMoney||payTotal
        }
        ResourceService.getFunServer('paycode',params,'post').then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'汇款信息已成功发送至您'+$filter('ClipPhone')($rootScope.USER.Contact) +'的手机，请注意查收'
                }
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    };
   //提交预付款
    $scope.prepay=function(){
        if($scope.bank==undefined||$scope.bank==''||$scope.payForm.$invalid){
            $scope.alert={
                type:'alert-danger',
                msg:'请选择汇款银行'
            }
        }else{
            var params={
                OrderCode:$rootScope.stateParams.OrderCode,
                PrePayTime:$scope.PrePayTime,
                PrePayBank:$scope.bank
            };
            ResourceService.getFunServer('prepay',params,'post').then(function(data){
                if(data.status==1){
                    $scope.alert={
                        type:'alert-success',
                        msg:'提交成功'
                    };
                    setTimeout(function(){
                        $rootScope.state.go('home.buyorder',{OUID:0});
                    },1500);
                }else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    }
                }
            });
        }
    }
}]).controller('AccountController', ['$rootScope','$scope',
    function ($rootScope,$scope) {

    }]);