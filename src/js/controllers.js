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
            AuthService.LoginOut();
            if(data.status==1){
                AuthService.LoginOut();
            }

        });
    }
}]).controller('IndexController',['$rootScope','$scope','$sce',function($rootScope,$scope,$sce){
    $scope.availableCash=$sce.trustAsHtml('2004<small>.00</small>');
    $scope.s=[1,2,3,4,5,6];
    console.log(GetQueryString())
   // $rootScope.dialog('./logindialog.html')

}]).controller('HomeController',['$rootScope','$scope','$sce',function($rootScope,$scope,$sce){
   $scope.availableCash=$sce.trustAsHtml('2004<small>.00</small>');
    $scope.s=[1,2,3,4,5,6]

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
        var holdplace =$( '<div class="file-preview-frame col-md-3" id="'+file.id+'"  data-path="'+src+'">' +
            '<img style="width:200px;height:160px;"  class="file-preview-image" src="'+src+'" >' +
            '<div class="file-thumbnail-footer">' +
            '<div class="file-actions">' +
            '<div class="file-footer-buttons">' +
            '<button title="删除" class="kv-file-remove btn btn-xs btn-default pull-right" type="button">   <i class="glyphicon glyphicon-trash text-danger"></i>'+
            '</button> ' +
            '</div></div></div></div>');
        $(element).find('.file-drop-zone-title').hide();
        $(element).find('.file-preview-thumbnails').append(holdplace);
        if(id==""||id==undefined){
            holdplace.find('.kv-file-remove').remove();
            holdplace.parents('.file-input').find('.input-group ').remove();
        }
        //删除
        var rm=$(element).find('.kv-file-upload');
        rm.bind('click',function(e){
            var params={
                CarPicID:this.value
            };
            ResourceService.getFunServer('deletecarimg',params,'post').then(function(data){
                if(data.status==1){
                    $(e.target).parents('.file-preview-frame').remove();
                    var length=$(element).find('.file-preview-frame').length;
                    if(length==0){
                        $(element).find('.file-drop-zone-title').show();
                    }
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
    };
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
}]).controller('OrderController', ['$rootScope','$scope','$filter','ResourceService','CarService', function ($rootScope,$scope,$filter,ResourceService,CarService) {
    $scope.pageTotal=0;
    $scope.history=0;
    //获取订单
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
                    $scope.pageTotal=parseInt(data.total);
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
            paymount:payTotal||$scope.PrePayMoney
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
    };
    //服务费
    $scope.getserviceFees=function(){
           var params={
               OrderCode:$rootScope.stateParams.OrderCode
           };
        CarService.serviceFees(params).success(function(data){
           $scope.serviceFees=data;
           $scope.getOrder();
           $scope.getCouponList();
        });
    };
    //优惠券列表
    $scope.getCouponList=function(){
        var params={
            PageNo:1,
            PageSize:100
        };
        ResourceService.getFunServer('discount',params).then(function(data){
            if(data.status==1){
                $scope.discountlist=data.data;
            }
        })
    };
    //使用优惠券结算
    $scope.usageDicount=function(){
        var params={
            OrderCode:$rootScope.stateParams.OrderCode,
            PolicyCodes:$scope.discount
        };
        if(params.PolicyCodes&&params.PolicyCodes.length>0){
           ResourceService.getFunServer('discountusage',params).then(function(data){
               if(data.status==1){
                   $scope.paid();
               }else{
                   $scope.alert={
                       type:'alert-danger',
                       msg:data.message
                   }
               }
           })
        }else{
            $scope.paid();
        }
    };
    //提交全款
    $scope.paid=function(){
        var params={
            OrderCode:$rootScope.stateParams.OrderCode,
            AllMoneyBank:$scope.bank,
            AllMoneyTime:$scope.AllMoneyTime
        };
        if($scope.bank==undefined||$scope.bank==''||$scope.payForm.$invalid){
            $scope.alert={
                type:'alert-danger',
                msg:'请选择汇款银行'
            }
        }else{
            ResourceService.getFunServer('fullpay',params).then(function(data){
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
    };
    //申请撤单
    $scope.calcelDialog=function(obj){
        $scope.calcel_order=obj;
        $rootScope.dialog('./admin/calcelorder.html','OrderController',$scope);
    };
    //撤单
    $scope.cancelOrder=function(){
        var params={
            OrderCode:$scope.calcel_order.OrderCode,
            RevokeMemo: $scope.RevokeMemo
        };
        if($rootScope.stateParams.OUID==0){
            ResourceService.getFunServer('buyrevoke',params).then(function(data){
                if(data.status==1){
                    $scope.alert={
                        type:'alert-success',
                        msg:'提交成功'
                    };
                    setTimeout(function(){
                        $scope.cancel();
                        window.location.reload();
                    },1500)
                }
                else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    }
                }
            })
        }
        else if($rootScope.stateParams.OUID==1){
            ResourceService.getFunServer('sellrevoke',params).then(function(data){
                if(data.status==1){
                    $scope.alert={
                        type:'alert-success',
                        msg:'提交成功'
                    };
                    setTimeout(function(){
                        $scope.cancel();
                        window.location.reload();
                    },1500)
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
    //修改成交价
    $scope.openPirceDialog=function(obj){
        $scope.calcel_order=obj;
        $rootScope.dialog('./admin/orderprice.html','OrderController',$scope);
    };
    //修改成交价
    $scope.price=function(){
        var params={
            orderCode: $scope.calcel_order.OrderCode,
            dealPrice: $scope.DealPrice
        };
        ResourceService.getFunServer('amount',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'修改成功'
                };
                setTimeout(function(){
                    $scope.cancel();
                    window.location.reload();
                },1500)
            }
            else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    };
    //买家评价
    $scope.buyEvaluate=function(){
        var params={
            OrderCode: $rootScope.stateParams.OrderCode,
            UserGiveScore:$scope.UserGiveScore||1,
            UserGiveShipping:$scope.UserGiveShipping||1,
            UserGiveTest:$scope.UserGiveTest||1,
            UserGiveTestTarget:$scope.UserGiveTestTarget||1,
            UserFeedback: $scope.UserFeedback
        };
        ResourceService.getFunServer('buyfeedback',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'评价成功'
                };
                setTimeout(function(){
                    $scope.cancel();
                    window.location.reload();
                },1500)
            }
            else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    };
    //买家评价
    $scope.buyEvaluate=function(){
        var params={
            OrderCode: $rootScope.stateParams.OrderCode,
            UserGiveScore:$scope.UserGiveScore||1,
            UserGiveShipping:$scope.UserGiveShipping||1,
            UserGiveTest:$scope.UserGiveTest||1,
            UserGiveTestTarget:$scope.UserGiveTestTarget||1,
            UserFeedback: $scope.UserFeedback
        };
        ResourceService.getFunServer('buyfeedback',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'评价成功'
                };
                setTimeout(function(){
                    $scope.cancel();
                    window.location.reload();
                },1500)
            }
            else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    };
    //卖家评价
    $scope.sellEvaluate=function(){
        var params={
            OrderCode: $rootScope.stateParams.OrderCode,
            CarOwnerGiveScore:$scope.CarOwnerGiveScore||1,
            CarOwnerMemo: $scope.CarOwnerMemo
        };
        ResourceService.getFunServer('sellfeedback',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'评价成功'
                };
                setTimeout(function(){
                    $scope.cancel();
                    window.location.reload();
                },1500)
            }
            else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    };
}]).controller('AccountController', ['$rootScope','$scope','ResourceService','$filter',function ($rootScope,$scope,ResourceService,$filter) {
    $scope.profile={};
    $scope.passwdChangeEditor={editing:false,error:'',errorType:'bind-red'};
    $scope.tradePasswdEditor={editing:false,error:'',errorType:'bind-red',sent:false,time:60,tradePasswdEditor:'',setting:false};
    $scope.trueNameEditor={editing:false,error:'',errorType:'bind-red',sent:false,time:60,setting:false};
    $scope.cityEditor={editing:false,error:'',errorType:'bind-red',sent:false,time:60,setting:false};
    $scope.phoneEditor={editing:false,error:'',errorType:'bind-red',sent:false,time:60,setting:false};
   //用户信息
   $scope.getProfile=function(){
       ResourceService.getFunServer('user',{}).then(function(data){
           if(data.status==1){
               $scope.profile=data.data;
           }
       })
   };
    //更改用户信息
    $scope.updateUser=function(){

      ResourceService.getFunServer('updateUser',$scope.profile).then(function(data){


      })
    };
   //修改切换
    $scope.toggleEditor=function(a,b,c){
      a[b]=!a[b];
    };
   //修改密码
    $scope.changePassword=function(){
        if($scope.passwdChangeForm.$valid){
            if($scope.passwdChangeEditor.params.newPwd!=$scope.passwdChangeEditor.confPwd){

                $scope.passwdChangeEditor.error='*两次密码输入不一致'
            }
            else{
                ResourceService.getFunServer('resetPwd',$scope.passwdChangeEditor.params).then(function(data){
                    if(data.status==1){
                        $scope.passwdChangeEditor.errorType='text-success';
                        $scope.passwdChangeEditor.error='登录密码修改成功';
                    }else{
                        $scope.passwdChangeEditor.error=data.message;
                    }
                })
            }
        }
    };
  //交易密码
    $scope.hasTradePwd=function(){
        ResourceService.getFunServer('hastradePwd',{}).then(function(data){
            if(data.status==1){
                $scope.tradePasswdEditor.TradePwd='******';
            }
            else{
                $scope.tradePasswdEditor.TradePwd='未设置';
            }
        })
    };
    //设置交易密码
   $scope.setTradePassword=function(){
       if($scope.TradePwdSetForm.$valid){
           if($scope.tradePasswdEditor.params.PayPassword!=$scope.tradePasswdEditor.confPwd){

               $scope.tradePasswdEditor.error='*两次密码输入不一致'
           }
           else{
               var params={
                   UserID:$scope.profile.UserID,
                   PayPassword:$scope.tradePasswdEditor.params.PayPassword
               };
               ResourceService.getFunServer('updateUser',params).then(function(data){
                   if(data.status==1){
                       $scope.tradePasswdEditor.errorType='text-success';
                       $scope.tradePasswdEditor.error='交易密码设置成功';
                   }else{

                       $scope.tradePasswdEditor.error=data.message;
                   }
               })
           }
       }
   };
    //修改交易密码
    $scope.changeTradePassword=function(){
        if($scope.TradePwdChangeForm.$valid){
            if($scope.tradePasswdEditor.params.newTradePwd!=$scope.tradePasswdEditor.confPayPassword){

                $scope.tradePasswdEditor.error='*两次密码输入不一致'
            }
            else{
                ResourceService.getFunServer('resetTradePwd',$scope.tradePasswdEditor.params).then(function(data){
                    if(data.status==1){
                        $scope.tradePasswdEditor.errorType='text-success';
                        $scope.tradePasswdEditor.error='交易密码修改成功';
                    }else{

                        $scope.tradePasswdEditor.error=data.message;
                    }
                })
            }

        }
    };
    //真实姓名
    $scope.setTrueName=function(){
        if($scope.trueNameSetForm.$valid){
            var params={
                UserID:$scope.profile.UserID,
                UserName:$scope.trueNameEditor.params.UserName
            };
            ResourceService.getFunServer('updateUser',params).then(function(data){
                if(data.status==1){
                    $scope.trueNameEditor.errorType='text-success';
                    $scope.trueNameEditor.error='姓名设置成功';
                    $scope.getProfile();
                }else{

                    $scope.trueNameEditor.error=data.message;
                }

            })
        }
    };
    //修改真实姓名
    $scope.changeTrueName=function(){
        if($scope.changeTrueNameForm.$valid){
            var params={
                UserID:$scope.profile.UserID,
                UserName:$scope.trueNameEditor.params.UserName
            };
            ResourceService.getFunServer('updateUser',params).then(function(data){
                if(data.status==1){
                    $scope.trueNameEditor.errorType='text-success';
                    $scope.trueNameEditor.error='姓名设置成功';
                    $scope.getProfile();
                }else{

                    $scope.cityEditor.error=data.message;
                }

            })
        }
    };
    //设置城市
    $scope.setCity=function(){
        if($scope.citySetForm.$valid){
            var city=angular.element('#city').val();
            if(city.indexOf('-')==city.lastIndexOf('-')){
              city= city.substr(city.indexOf('-')+1,city.length);
            }else{
                city=city.substr(city.indexOf('-')+1,city.lastIndexOf('-'))
            }
            var params={
                UserID:$scope.profile.UserID,
                CityID:angular.element('#city').attr('city'),
                CityName:city,
                Address:$scope.profile.Address
            };
            ResourceService.getFunServer('updateUser',params).then(function(data){
                if(data.status==1){
                    $scope.cityEditor.errorType='text-success';
                    $scope.cityEditor.error='设置成功';
                    $scope.getProfile();
                }else{
                    $scope.cityEditor.errorType='bind-red';
                    $scope.cityEditor.error=data.message;
                }
            })
        }
    };
    //修改城市
    $scope.changeCity=function(){
        if($scope.citySetForm.$valid){
            var city=angular.element('#city2').val();
            if(city.indexOf('-')==city.lastIndexOf('-')){
                city= city.substr(city.indexOf('-')+1,city.length);
            }else{
                city=city.substr(city.indexOf('-')+1,city.lastIndexOf('-'))
            }
            var params={
                UserID:$scope.profile.UserID,
                CityID:angular.element('#city').attr('city'),
                CityName:city,
                Address:$scope.profile.Address
            };
            ResourceService.getFunServer('updateUser',params).then(function(data){
                if(data.status==1){
                    $scope.cityEditor.errorType='text-success';
                    $scope.cityEditor.error='设置成功';
                    $scope.getProfile();
                }else{
                    $scope.cityEditor.errorType='bind-red';
                    $scope.trueNameEditor.error=data.message;
                }
            })
        }
    };
   //计时
    $scope.timmer=function(){
            if($scope.phoneEditor.time==0){
                $scope.phoneEditor.time=60;
                $scope.phoneEditor.sent=false;
            }
            else
            {
                $scope.phoneEditor.time--;
                $scope.phoneEditor.sent=true;
                angular.element('.phoneCountDown').text($scope.phoneEditor.time)
                setTimeout($scope.timmer,1000);
            }

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
   //重新绑定
    $scope.changePhone=function(){
        if($scope.changPhoneForm.$valid){
            var params={
                phonenum:$scope.phoneEditor.Contact,
                code:$scope.phoneEditor.confCode
            };
            ResourceService.getFunServer('validcode',params).then(function(data){
                if(data.status==1){
                    ResourceService.getFunServer('updateUser',{
                        UserID:$scope.profile.UserID,
                        Contact:$scope.phoneEditor.Contact
                    }).then(function(d){
                        if(d.status==1){
                            $scope.phoneEditor.errorType='text-info';
                            $scope.phoneEditor.error='您已成功更换绑定手机号';
                            $scope.getProfile();
                        }else{
                            $scope.phoneEditor.errorType='bind-red';
                            $scope.phoneEditor.error= d.message;
                        }

                    })
                }else{
                    $scope.phoneEditor.errorType='bind-red';
                    $scope.phoneEditor.error=data.message;
                }

            })
        }

    }
}]).controller('CompanyController', ['$rootScope','$scope','ResourceService','$filter',function ($rootScope,$scope,ResourceService,$filter) {
    //联盟商信息
    $scope.getCompany=function(){
        var params={
            PageNo:1,
            PageNum:1000
        };
        ResourceService.getFunServer('company',params).then(function(data){
            if(data.status==1){
                $scope.company=data.data;
                if($scope.company.BusinessLicenseAddr){
                    preview($scope.company.BusinessLicenseAddr,'#BusinessLicenseNo');
                }
                if($scope.company.OrganizationPicAddr){
                    preview($scope.company.OrganizationPicAddr,'#OrganizationCode')
                }


            }
        })
    };
    //图片占位符
    function preview(src,element,id) {
        var holdplace =$( '<div class="file-preview-frame col-md-3"   data-path="'+src+'">' +
            '<img style="width:200px;height:160px;"  class="file-preview-image" src="'+src+'" >' +
            '<div class="file-thumbnail-footer">' +
            '<div class="file-actions">' +
            '<div class="file-footer-buttons">' +
            '<button title="删除" class="kv-file-remove btn btn-xs btn-default pull-right" type="button">   <i class="glyphicon glyphicon-trash text-danger"></i>'+
            '</button> ' +
            '</div></div></div></div>');
        if (id=='' || id ==undefined) {
            $(element).find('.file-preview-frame').remove();
        }
        $(element).find('.file-drop-zone-title').hide();
        $(element).find('.file-preview-thumbnails').append(holdplace);
        //删除
        var rm=$(element).find('.kv-file-remove');
        rm.bind('click',function(e){
            var params={
                fileName:src
            };
            ResourceService.getFunServer('delimg',params,'post').then(function(data){
                if(data.status==1){
                    $(e.target).parents('.file-preview-frame').remove();
                    var length=$(element).find('.file-preview-frame').length;
                    if(length==0){
                        $(element).find('.file-drop-zone-title').show();
                    }
                }
            });


        });
        return holdplace
    }
    //编辑信息
    $scope.editCompany=function(){
        if($scope.companyForm.$valid){
            getPicPath();
            var city=angular.element('#city').val();
            if(city.indexOf('-')==city.lastIndexOf('-')){
                city= city.substr(city.indexOf('-')+1,city.length);
            }else{
                city=city.substr(city.indexOf('-')+1,city.lastIndexOf('-'))
            }
            $scope.company.CityName=city;
            $scope.company.CityID=angular.element('#city').attr('city')||$scope.company.CityID;
            ResourceService.getFunServer('updatecompany',$scope.company).then(function(data){
                if(data.status==1){
                   $scope.alert={
                       type:'alert-success',
                       msg:'编辑成功'
                   };
                   setTimeout(function(){
                       window.location.reload();
                   },1500)
                }
                else{
                    $scope.alert={
                        type:'alert-danger',
                        msg: data.messge
                    };
                }
            })
        }
    }
    //读图片路径
    function getPicPath(){
        var cover=$('#OrganizationCode').find('.file-preview-frame').attr('data-path')||'';
        var pics=angular.element('#BusinessLicenseNo').find('.file-preview-frame').attr('data-path')||'';
        $scope.company.OrganizationPicAddr=cover;
        $scope.company.BusinessLicenseAddr=pics;
        return true;
    }
    //编辑成员
    $scope.editDialog=function(obj){
        $scope.employee=obj;
        $rootScope.dialog('./admin/editemployee.html','CompanyController',$scope);
    };
    //编辑成员
    $scope.edit=function(){
        if($scope.employeeForm.$valid){
            ResourceService.getFunServer('updateUser',$scope.employee).then(function(data){
                if(data.status==1){
                    $scope.alert={
                        type:'alert-success',
                        msg:'编辑成功'
                    };
                    setTimeout(function(){
                        window.location.reload();
                    },1500)
                }else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    };
                }
            })
        }
    };
    $scope.deleteDialog=function(obj){
        $scope.employee=obj;
        $rootScope.dialog('./admin/delemployee.html','CompanyController',$scope);
    };
    //删除成员
    $scope.delete=function(){
        var params={
            AllianceCode:$scope.employee.AllianceCode,
            User_Alliance_AllianceCode:[{UserID:$scope.employee.UserID}]
        };
        ResourceService.getFunServer('deletemployee',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'删除成功'
                };
                setTimeout(function(){
                    window.location.reload();
                },1500)
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                };
            }
        })
    };
    //添加成员
    $scope.addDialog=function(){
        $rootScope.dialog('./admin/addemployee.html','CompanyController',$scope);
    };
    $scope.new={};
    $scope.isExist=function(){
        if(!$scope.new.Contact){
            return;
        }
        var params={
            Contact:$scope.new.Contact
        };
        $scope.exist=false;
        ResourceService.getFunServer('isexist',params).then(function(data){
            if(data.status==0){
                $scope.alert={
                    type:'alert-danger',
                    msg:'该手机号已被注册'
                };
                $scope.exist=true
            }
            else{
                $scope.alert={
                    type:'',
                    msg:null
                };
            }
        })
    };
    $scope.add=function(){
        if($scope.exist){
            $scope.alert={
                type:'alert-danger',
                msg:'该手机号已被注册'
            };
        }
       else{
            if($scope.new.Pwd!=$scope.confPwd){
                $scope.alert={
                    type:'alert-danger',
                    msg:'两次密码不一致'
                };
            }else{
                $scope.new.Account=$scope.new.Contact;
                ResourceService.getFunServer('addemployee',$scope.new).then(function(data){
                    if(data.status==1){
                        $scope.alert={
                            type:'alert-success',
                            msg:'新增成功'
                        };
                        setTimeout(function(){
                            window.location.reload();
                        },1500)
                    }else{
                        $scope.alert={
                            type:'alert-danger',
                            msg:data.message
                        };
                    }
                })
            }
        }

    }
}]);