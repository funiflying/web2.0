/**
 * Created by Administrator on 2016/2/18.
 */
angular.module('chetongxiang.controllers',[]).controller('LoginController',['$rootScope','$scope','$cookieStore','ResourceService','AuthService','CookieService',function($rootScope,$scope,$cookieStore,ResourceService,AuthService,CookieService){
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
                        $rootScope.state.go('home.account');
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
        ResourceService.getFunServer('loginout',{},'post').then(function(data){
            AuthService.LoginOut();
            if(data.status==1){
                AuthService.LoginOut();
            }

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
            ResourceService.SendPhoneValCode(params).success(function(data){
                if(data.status==1){
                    $scope.timmer();
                    $scope.phoneEditor.errorType='text-info';
                    $scope.phoneEditor.error='验证码已发送至您'+$filter('ClipPhone')($scope.phoneEditor.Contact)+'的手机，请注意查收';
                }
            })
        }

    };
    //回车提交
    $scope.submitKey=function(e,dialog){
        var keyCode=window.event? e.keyCode: e.which;
        if(keyCode==13){
           $scope.login(dialog);
        }
    }
}]).controller('RegisterController',['$rootScope','$scope','$cookieStore','$filter','ResourceService','AuthService',function($rootScope,$scope,$cookieStore,$filter,ResourceService,AuthService){

    //同意注册协议
    $scope.agreement=true;
    $scope.time=60;
    $scope.sent=false;
    $scope.exist=true;
    //接受短信验证码
    //计时
    $scope.timmer=function(){
        if($scope.time==0){
            $scope.time=60;
            $scope.sent=false;
            angular.element('.password-code-btn').removeAttr('disabled');
            angular.element('.phoneCountDown').text('');
        }
        else
        {
            $scope.time--;
            $scope.sent=true;
            angular.element('.phoneCountDown').text($scope.time+'s');
            setTimeout($scope.timmer,1000);
        }
    };
    $scope.fetchTradekeyCode=function(){
        var params={
            phoneNum:$scope.Contact
        };
        if($scope.Contact&&!$scope.exist){
            ResourceService.SendPhoneValCode(params).success(function(data){
                if(data.status==1){
                    $scope.timmer();
                    $scope.alert= {
                        type: 'alert-info',
                        msg: '验证码已发送至您' + $filter('ClipPhone')($scope.Contact) + '的手机，请注意查收'
                    }
                }else{
                    $scope.alert= {
                        type: 'alert-danger',
                        msg: data.message
                    }
                }
            })
        }
    };
    $scope.fetchkeyCode=function(){
        var params={
            phoneNum:$scope.Contact
        };
        if($scope.Contact&&$scope.exist){
            ResourceService.SendPhoneValCode(params).success(function(data){
                if(data.status==1){
                    $scope.timmer();
                    $scope.alert= {
                        type: 'alert-info',
                        msg: '验证码已发送至您' + $filter('ClipPhone')($scope.Contact) + '的手机，请注意查收'
                    }
                }else{
                    $scope.alert= {
                        type: 'alert-danger',
                        msg: data.message
                    }
                }
            })
        }
    };
    //验证手机号是否注册
    $scope.isExist=function(){
        if(!$scope.Contact){
            return;
        }
        var params={
            Contact:$scope.Contact
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
                $scope.exist=false
            }
        })
    };
    $scope.Exist=function(){
        if(!$scope.Contact){
            return;
        }
        var params={
            Contact:$scope.Contact
        };
        $scope.exist=false;
        ResourceService.getFunServer('isexist',params).then(function(data){
            if(data.status==0){
                $scope.exist=true
            }
            else{
                $scope.alert={
                    type:'alert-danger',
                    msg:'该手机号没有注册'
                };
                $scope.exist=false
            }
        })
    };
    //注册
    $scope.register=function(){
        if($scope.registerForm.$valid&&!$scope.exist)
        {
            var params={
                UserName: $scope.Contact,
                Account: $scope.Contact,
                Pwd: "123456",
                Code:$scope.Code,
                Contact: $scope.Contact
            };
            ResourceService.getFunServer('register',params).then(function(data){
                if(data.status==1){
                    $rootScope.state.go('success',{TAG:'REGISTER'})
                }else{
                    $scope.alert= {
                        type: 'alert-danger',
                        msg: data.message
                    }
                }
            })
        }
    };
    //找回密码
    $scope.password=function(){
        var parsms={
            code: $scope.Code,
            phonenum: $scope.Contact,
            newpwd: $scope.Pwd
        };
        if($scope.confPwd!=$scope.Pwd){
            $scope.alert={
                type:'alert-danger',
                msg:'两次密码不一致'
            };
            return false;
        }
        if($scope.pwdForm.$valid&&$scope.exist){
            ResourceService.getFunServer('findPwd',parsms).then(function(data){
                if(data.status==1){
                    $rootScope.state.go('success',{TAG:'RESETPWD'})
                }else{
                    $scope.alert= {
                        type: 'alert-danger',
                        msg: data.message
                    }
                }
            })
        }
    }
}]).controller('SuccessController',['$rootScope','$scope','$sce',function($rootScope,$scope,$sce){
    $scope.QS=$rootScope.stateParams.TAG;
    $scope.time=3;
    $scope.timmer=function(){
        if($scope.time==0&&$rootScope.state.current.url.indexOf('/success')>-1) {
            $scope.time = 3;
            if ($scope.QS == 'REGISTER' || $scope.QS == 'RESETPWD') {
                $rootScope.state.go('login');
            }
            else if ($scope.QS == 'ISSUE' || $scope.QS == 'ISSUEDIT') {
                $rootScope.state.go('home.cargather');

            } else if ($scope.QS == 'APPRSISER') {
                $rootScope.state.go('home.entrustorder');
            }
            else if ($scope.QS == 'ORDER') {
                $rootScope.state.go('home.buyorder', {OUID: 0});
            }
            else if ($scope.QS == 'DETECTION') {
                window.close();
            }
            else if ($scope.QS == 'ASSESS') {
                $rootScope.state.go('home.entrust');
            }
        }
        else
        {
            $scope.time--;
            angular.element('.timer').text($scope.time);
            setTimeout($scope.timmer,1000);
        }
    };

}]).controller('CarController',['$rootScope','$scope','$filter','ResourceService','CarService',function($rootScope,$scope,$filter,ResourceService,CarService){
    $scope.car={
        WholesalePrice:0,
        Mileage:0,
        TransferNo:0,
        UseType:1,
        OwnerType:1,
        WomenCar:0

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
        if(params.BrandID){
            ResourceService.getFunServer('Series',params).then(function(data){
                if(data.status==1){
                    $scope.series=data.data;
                }
                else{
                    $scope.series=[];
                }
            })
        }
    };
    //读取型号
    $scope.getArctics=function(){
        $scope.spec=null;
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
    $scope.SpecNameChange=function(){
        $scope.SpecName=$scope.spec.SpecName;
        var params={
            brand:angular.element('#newbrandid').val(),
            catalogid:$scope.spec.CatalogID
        };
        ResourceService.getFunServer('carconfig',params).then(function(data){
               if(data.status==1){
                   $scope.config=data.data;
                   $scope.DischargeStandardDetail=data.data.DischargeStandardDetail
               }
        })

    };
    //读图片路径
    function getPicPath(){
        var cover=$('#car-cover').find('.file-preview-frame').attr('data-path');
        var pics=angular.element('#car-pics').find('.file-preview-frame');
        var chejiahao=$('#chejiahao-pics').find('.file-preview-frame').attr('data-path');
        var arr={
            HomePicID:cover,
            FrameNumberPic:chejiahao,
            CarPic_Car_CarNo:[]
        };
        $.each(pics,function(index,obj){
            var o=new Object();
            o.PicAddr=$(obj).attr('data-path');
            o.SerialNO=index+1;
            arr.CarPic_Car_CarNo.push(o);
        });
        if(!cover||!chejiahao){
            if(!cover){
                $scope.alert={
                    type:'alert-warning',
                    msg:'请上传车辆封面图'
                }

            }
            else if(!chejiahao){
                $scope.alert={
                    type:'alert-warning',
                    msg:'请上传车架号图片'
                }
            }
           return false;
        }
        return arr;
    }
    //不确定车型
    $scope.$watch('spec',function(newValue){
        if(angular.element('#nospac')[0]){
            angular.element('#nospac')[0].checked=false;
        }

    });
    $scope.getCarConf=function(catalogid){
        var params={
            catalogid:catalogid
        };
        ResourceService.getFunServer('carconfig',params).then(function(data){
            if(data.status==1){

            }
        })
    };
    $scope.Discharges=[{
        value:'1',
        detail:'国II'
    },{
        value:'2',
        detail:'国III'
    },{
        value:'3',
        detail:'国IV'
    },{
        value:'3',
        detail:'国IV(国V)'
    },{
        value:'3',
        detail:'国IV/京V'
    },{
        value:'3',
        detail:'国IV(国V)+OBD'
    },{
        value:'4',
        detail:'国V+OBD'
    },{
        value:'1',
        detail:'欧II'
    },{
        value:'2',
        detail:'欧III'
    },{
        value:'2',
        detail:'欧III+OBD'
    },{
        value:'3',
        detail:'欧IV'
    },{
        value:'3',
        detail:'欧IV+OBD'
    },{
        value:'4',
        detail:'欧V'
    },{
        value:'4',
        detail:'欧V+OBD'
    },{
        value:'4',
        detail:'欧VI'
    }];
    //发布车源
    $scope.Price=0.00;
    $scope.WholesalePrice=0.00;
    $scope.$watch('Price',function(newValue){
         if(newValue&&newValue.toString().indexOf('.')>-1){
             newValue=newValue.toString();
             $scope.Price=newValue.substring(0,newValue.indexOf('.')+3);
         }
    });
    $scope.$watch('WholesalePrice',function(newValue){
        if(newValue&&newValue.toString().indexOf('.')>-1){
            newValue=newValue.toString();
            $scope.WholesalePrice=newValue.substring(0,newValue.indexOf('.')+3);
        }
    });

    $scope.isExistFrameNumber=function(){
      var params={
          FrameNumber:$scope.car.FrameNumber
      };
        if(params.FrameNumber&&params.FrameNumber.length==17){
            ResourceService.getFunServer('ExsitFrame',params,'get').then(function(data){
                  if(data.status==1){
                      $('.FrameNumber i').removeClass(' glyphicon-exclamation-sign ').addClass('glyphicon  glyphicon-ok-sign').text('车架号可用')
                  }else{
                      $('.FrameNumber i').removeClass(' glyphicon-ok-sign ').addClass('glyphicon glyphicon-exclamation-sign ').text('车架号不可用')
                  }
            })
        }else{
            $('.FrameNumber i').removeClass('glyphicon glyphicon-exclamation-sign glyphicon-ok-sign').text(' ')
        }
    };
    $scope.issuecar=function(){
        if($scope.carissue.$valid){
            $scope.car.CatalogID=$scope.spec.CatalogID;
            $scope.car.SpecName=$scope.SpecName;
            $scope.car.Color=$scope.Color;
            $scope.car.Price=parseFloat($scope.Price)*10000;
            $scope.car.WholesalePrice=parseFloat($scope.WholesalePrice)*10000;
            $scope.car.OutputVolumeDetail=$scope.config.OutputVolumeDetail;
            $scope.car.GearBox=$scope.config.GearBox;
            angular.forEach($scope.Discharges,function(obj,index){
                if(obj.detail==$scope.DischargeStandardDetail){
                    $scope.car.DischargeStandard=obj.value;
                    return;
                }
            });
            $scope.car.DischargeStandardDetail=$scope.DischargeStandardDetail;
            if(!$scope.car.Color){
                $scope.alert={
                    type:'alert-warning',
                    msg:'请选择车辆颜色'
                };
                return;
            }
            if($scope.car.FrameNumber.length!=17){
                $scope.alert={
                    type:'alert-warning',
                    msg:'车架号长度必须为17位'
                };
                return false;
            }

            var pic= getPicPath();
            if(!pic){
                return;
            }
            $scope.car.CarPic_Car_CarNo=pic.CarPic_Car_CarNo;
            $scope.car.HomePicID=pic.HomePicID;
            $scope.car.FrameNumberPic=pic.FrameNumberPic;

            var city=angular.element('#city').val();
            if(city.indexOf('-')==city.lastIndexOf('-')){
                city= city.substring(city.indexOf('-')+1,city.length);
            }else{
                city=city.substring(city.indexOf('-')+1,city.lastIndexOf('-'))
            }
            $scope.car.RegisterPlace=city;
            $scope.car.CityID=angular.element('#city').attr('city');
            CarService.release($scope.car).success(function(data){
                if(data.status==1){
                    $rootScope.state.go('success',{TAG:'ISSUE'})
                }else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    }
                }
            })
        }
    };
    $scope.getCount=function(){
        ResourceService.getFunServer('carcount',{}).then(function(data){
            if(data.status==1){
                $scope.count=data.data
            }
        })
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
                    $scope.list=[];
					$scope.pageTotal=0;
                }

            });
        }
        //个人
        else{
            ResourceService.getFunServer('cargather',params,'post').then(function(data){
                if(data.status==1){
                    $scope.list=data.data.rows;
                    $scope.pageTotal=data.data.total;
                }
                else {
                    $scope.list=[];
					$scope.pageTotal=0;
                }

            })
        }
        $scope.getCount();
    };
   //分页切换
    $scope.changePager=function(){
        window.scrollTo(0,0);
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
        };
        ResourceService.getFunServer('republish',params,'post').then(function(data){
            if(data.status==1){
                $rootScope.state.go('success',{TAG:'ISSUE'})
            }
            else{
                $rootScope.toast(data.message)
            }
        })
    };
    
    $scope.confirmCarDialog=function(car){
        $scope.confirmcarinfo=car;
        $rootScope.dialog('./admin/confirmcar.html','CarController',$scope,null);
    };
    
    //联盟商确认车源
    $scope.confirmCarBtn=function(CarNo){
        var params={
            CarNo:CarNo
        };
        CarService.ConfirmPublishCar(params).then(function(data){
            if(data.data.status==1){
                $scope.alert={
                    msg:'确认车源成功',
                    type:'alert-success'
               };
                setTimeout(function(){
                    $scope.cancel();
                    window.location.reload()
                },1500);
            }
            else{
                $scope.alert={
                    msg:data.data.message||'确认车源失败',
                    type:'alert-danger'
                };
            }
        })
    };
    //车辆详情
    $scope.carInfo=function(){
      var params={
          CarNo:$scope.CarNo
      };
      ResourceService.getFunServer('GetCardata',params).then(function(data){
          if(data.status==1){
              var val=data.data;
              var o=new Object();
              for(var i=0;i<val.length;i++){
                  var name=val[i].name;
                  switch (name){
                      case 'Car':
                          var  o= val[i].value[0];
                          o.Mileage=parseFloat(o.Mileage);
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
                          o.UnknowSpec=o.UnknowSpec.toString().toLowerCase()=='true'?true:false;
                          o.CarPic_Car_CarNo=[];
                          $scope.car=o;
                          $scope.Price=parseFloat($scope.car.Price/10000);
                          $scope.WholesalePrice=parseFloat($scope.car.WholesalePrice/10000);
                          $scope.spec={
                              CatalogID:$scope.car.CatalogID,
                              SpecName:$scope.car.SpecName
                          };
                          $scope.OutputVolumeDetail= $scope.car.OutputVolumeDetail;
                          $scope.DischargeStandard=$scope.car.DischargeStandardDetail;
                          $scope.GearBox=$scope.car.GearBox;
                          $scope.Color=$scope.car.Color;
                          preview($scope.car.HomePicID,'#car-cover');
                          preview($scope.car.FrameNumberPic,'#chejiahao-pics');

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
                          break;
                  }
              }
              return $scope.car;
          }
      });
    };
   //图片占位符
    function preview(src,element,id) {
        var holdplace =$( '<div class="file-preview-frame col-md-3" id="'+id+'"  data-path="'+src+'">' +
            '<img style="width:200px;height:160px;"  class="file-preview-image" src="'+src+'" >' +
            '<div class="file-thumbnail-footer">' +
            '<div class="file-actions">' +
            '<div class="file-footer-buttons">' +
            '<button title="删除" class="kv-file-remove btn btn-xs btn-default pull-right" type="button">   <i class="glyphicon glyphicon-trash text-danger"></i>'+
            '</button> ' +
            '</div></div></div></div>');
            $(element).find('.file-drop-zone-title').hide();
            $(element).find('.file-preview-thumbnails').append(holdplace);
           /* if(id==""||id==undefined){
                holdplace.find('.kv-file-remove').remove();
                holdplace.parents('.file-input').find('.input-group ').remove();
            }*/
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
           ResourceService.getFunServer('GetCardata',params).then(function(data){
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
   };
   //修改品牌
    $scope.editabled=function(){
        $scope.isEdit=!$scope.isEdit;
    };
   //修改车源
    $scope.editcar=function(){
        if($scope.carissue.$valid){
            $scope.car.CatalogID=$scope.spec.CatalogID;
            $scope.car.SpecName=$scope.SpecName;
            $scope.car.Color=$scope.Color;
            $scope.car.Price=parseFloat($scope.Price)*10000;
            $scope.car.WholesalePrice=parseFloat($scope.WholesalePrice)*10000;
            angular.forEach($scope.Discharges,function(obj,index){
                if(obj.detail==$scope.car.DischargeStandardDetail){
                    $scope.car.DischargeStandard=obj.value;
                    return;
                }
            });
            if(!$scope.car.Color){
                $scope.alert={
                    type:'alert-warning',
                    msg:'请选择车辆图片'
                }
                return;
            }
            if($scope.car.FrameNumber.length!=17){
                $scope.alert={
                    type:'alert-warning',
                    msg:'车架号长度必须为17位'
                };
                return false;
            }
            var pic= getPicPath();
            if(!pic){
                return;
            }
            $scope.car.CarPic_Car_CarNo=pic.CarPic_Car_CarNo;
            $scope.car.HomePicID=pic.HomePicID;
            $scope.car.FrameNumberPic=pic.FrameNumberPic;

            var city=angular.element('#city').val();
            if(city.indexOf('-')==city.lastIndexOf('-')){
                city= city.substring(city.indexOf('-')+1,city.length);
            }else{
                city=city.substring(city.indexOf('-')+1,city.lastIndexOf('-'))
            }
            $scope.car.RegisterPlace=city;
            $scope.car.CityID=angular.element('#city').attr('city');
            CarService.edit($scope.car).success(function(data){
                if(data.status==1){
                    $rootScope.state.go('success',{TAG:'ISSUEDIT'});
                }else{
                    $rootScope.toast(data.message);
                }
            })
        }
    };
    //急售
    //指导价
    $scope.FactoryPrice=0;
    $scope.GuidePirce=0;
    $scope.$watch('guide',function(newValue){
        if(newValue&&newValue.CatalogID&&newValue.Buyyear&&newValue.Mileage){
            ResourceService.getFunServer('guideprice',$scope.guide).then(function(data){
                 if(data.status==1){
                     $scope.FactoryPrice=data.data.FactoryPrice;
                     $scope.GuidePirce=data.data.GuidePirce;
                 }
            })
        }
    },true);
    //急售发布
    $scope.issueurgent=function(){
       $scope.car.Color=$scope.Color;
       $scope.car.CatalogID=$scope.guide.CatalogID;
        $scope.car.SeriesID=$scope.car.Series;
       $scope.car.Buyyear=$scope.guide.Buyyear;
       $scope.car.Mileage=$scope.guide.Mileage;
       $scope.car.Price=parseFloat($scope.Price*10000);
       $scope.car.HomePicURL=$('#car-cover').find('.file-preview-frame').attr('data-path');
       if(!$scope.car.Color){
           $scope.alert={
               type:'alert-warning',
               msg:'请选择车辆颜色'
           }
           return false;
       }
        if(!$scope.car.HomePicURL){
            $scope.alert={
                type:'alert-warning',
                msg:'请上传车辆图片'
            }
            return false;
        }
        var city=angular.element('#city').val();
        if(city.indexOf('-')==city.lastIndexOf('-')){
            city= city.substring(city.indexOf('-')+1,city.length);
        }else{
            city=city.substring(city.indexOf('-')+1,city.lastIndexOf('-'))
        }
        $scope.car.CityName=city;
        $scope.car.CityID=angular.element('#city').attr('city');
        if(!$scope.car.CityName||!$scope.car.CityID){
            $scope.alert={
                type:'alert-warning',
                msg:'请选择车辆所在城市'
            };
            return false;
        }
        if($scope.car.Price>parseFloat($scope.GuidePirce) *0.8){
            $scope.alert={
                type:'alert-warning',
                msg:'您的急售价不符合急售条件'
            };
            return false;
        }
        var params = {
            phonenum: $scope.car.OwnerPhone,
            code: $scope.Code
        };
        ResourceService.getFunServer('validcode',params).then(function(data){
            if(data.status==1){
                ResourceService.getFunServer('worry',$scope.car).then(function(d){
                    if(d.status==1){
                        $scope.alert={
                            type:'alert-success',
                            msg:'发布成功'
                        };
                        setTimeout(function(){
                            window.location.href='urgent.html'
                        },1500)
                    }
                    else{
                        $scope.alert={
                            type:'alert-danger',
                            msg: d.message
                        };
                    }
                })
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:'您的验证码错误'
                };
                return false;
            }
        })

    }
    //接受短信验证码
    //计时
    $scope.time=60;
    $scope.timmer=function(){
        if($scope.time==0){
            $scope.time=60;
            $scope.sent=false;
            angular.element('.password-code-btn').removeAttr('disabled');
            angular.element('.phoneCountDown').text('');
        }
        else
        {
            $scope.time--;
            $scope.sent=true;
            angular.element('.phoneCountDown').text($scope.time+'s');
            setTimeout($scope.timmer,1000);
        }
    };
    $scope.fetchkeyCode=function(){
        var params={
            phoneNum:$scope.car.OwnerPhone
        };
        if($scope.car.OwnerPhone){
            ResourceService.SendPhoneValCode(params).success(function(data){
                if(data.status==1){
                    $scope.timmer();
                    $scope.alert= {
                        type: 'alert-info',
                        msg: '验证码已发送至您' + $filter('ClipPhone')($scope.car.OwnerPhone) + '的手机，请注意查收'
                    }
                }else{
                    $scope.alert= {
                        type: 'alert-danger',
                        msg: data.message
                    }
                }
            })
        }
    };
    //线下交易
    $scope.issueoffline=function(){
        $scope.car.Color=$scope.Color;
        $scope.car.CatalogID=$scope.spec&&$scope.spec.CatalogID;
        $scope.car.SpecName=$scope.spec&&$scope.spec.SpecName;
        $scope.car.SeriesID=$scope.car.Series;
        $scope.car.TradeMoney=parseFloat($scope.Price*10000);
        $scope.car.HomePicID=$('#car-cover').find('.file-preview-frame').attr('data-path');
        if(!$scope.car.Color){
            $scope.alert={
                type:'alert-warning',
                msg:'请选择车辆颜色'
            }
            return false;
        }
        if(!$scope.car.HomePicID){
            $scope.alert={
                type:'alert-warning',
                msg:'请上传车辆图片'
            };
            return false;
        }
        var city=angular.element('#city').val();
        if(city.indexOf('-')==city.lastIndexOf('-')){
            city= city.substring(city.indexOf('-')+1,city.length);
        }else{
            city=city.substring(city.indexOf('-')+1,city.lastIndexOf('-'))
        }
        $scope.car.CityName=city;
        $scope.car.CityID=angular.element('#city').attr('city');
        if(!$scope.car.CityName||!$scope.car.CityID){
            $scope.alert={
                type:'alert-warning',
                msg:'请选择车辆所在城市'
            };
            return false;
        }
        ResourceService.getFunServer('issueoffline',$scope.car).then(function(d){
            if(d.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'发布成功,正为您转向检测报告'
                };
                setTimeout(function(){
                    $rootScope.state.go('detection',{Event:3,CarNo: d.data});
                },1500)
            }
            else{
                $scope.alert={
                    type:'alert-danger',
                    msg: d.message
                };
            }
        })

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
                    $scope.list=[];
                    $scope.pageTotal=0;
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
                    $scope.list=[];
                    $scope.pageTotal=0;
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
                var date= new Date((new Date($scope.order.OrderTime.replace(/-/gi,'/'))/1000+(86400*2))*1000);
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
        };
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
            OrderCode: $scope.calcel_order.OrderCode,
            DealPrice: $scope.OrderPrice
        };
        ResourceService.getFunServer('amount',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'确认成功'
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
    $scope.changePager=function(){
        window.scrollTo(0,0);
        $scope.getList();
    }
}]). controller('AccountController', ['$rootScope','$scope','ResourceService','$filter',function ($rootScope,$scope,ResourceService,$filter) {
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
               $scope.hasBank=!!$scope.profile.RegisterBankCode;
               $scope.showBank=!$scope.hasBank;
               $scope.profilte_bussiness={
                   User:$scope.profile
               }
           }
       });
       if($rootScope.USER&&$rootScope.USER.IdentityTag==3){
           ResourceService.getFunServer('alliance',{}).then(function(data){
               if(data.status==1){
                   $scope.Business=data.data[0];
                   $scope.profilte_bussiness={
                       User:$scope.profile,
                       Business:$scope.Business
                   }
               }
           });
       }
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
                       $scope.tradePasswdEditor.TradePwd='******';
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
                CityID:angular.element('#city2').attr('city'),
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
                angular.element('.get-phonecode-btn').removeAttr('disabled');
                angular.element('.phoneCountDown').text('');
            }
            else
            {
                $scope.phoneEditor.time--;
                $scope.phoneEditor.sent=true;
                angular.element('.phoneCountDown').text($scope.phoneEditor.time+'s');
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
            ResourceService.SendPhoneValCode(params).success(function(data){
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

    };
    //头像
    $scope.icon=function(){
        var ca = new CropAvatar('#crop-avatar');
        $scope.uplodeImg = function() {
            ca.submit().success(function(d) {
                $scope.profile.HeadImage= d.data;
                $scope.updateUser();
            })
        };
        ca.click()
    };
    //绑定银行卡

    $scope.addbank=false;
    $scope.addCard=function(){
        $scope.addbank=true;
        $scope.showBank=false;
        $scope.hasBank=false;
    };
    $scope.changeBank=function(){
        $scope.addbank=true;
        $scope.hasBank=false;
        $scope.showBank=false;
    };
    $scope.band=function(){
        $scope.profile.RegisterBank=$scope.bank;
        var params={
            UserID:$scope.profile.UserID,
            RegisterBank:$scope.bank,
            UserName:$scope.profile.UserName,
            RegisterBankCode:$scope.profile.RegisterBankCode
        };
        if($scope.profile.RegisterBank==null||$scope.profile.RegisterBank==undefined||$scope.profile.RegisterBank==''){
            $scope.alert={
                type:'alert-danger',
                msg:'请选择开户银行'
            };
            return false;
        }
        ResourceService.getFunServer('updateUser',params).then(function(data){
              if(data.status==1){
                  $scope.alert={
                      type:'alert-success',
                      msg:'银行卡绑定成功'
                  };
                  setTimeout(function(){
                      window.location.reload();
                  },1500)
              }else{
                  $scope.alert={
                      type:'alert-danger',
                      msg:data.message
                  }
              }
        })
    };
    //提现
    $scope.withdraw=function(){
        if($scope.depositForm.$valid){
            $rootScope.USER&&$rootScope.USER.IdentityTag==3?$scope.deposit.BusinessFlag=1:$scope.deposit.BusinessFlag=0;
            if(!parseFloat($scope.deposit.PayMoney)>0){
                $scope.alert={
                    type:'alert-danger',
                    msg:'您输入的提现金额有误。'
                };
                return;
            }
            ResourceService.getFunServer('withdraw',$scope.deposit,'post').then(function(data){
                if(data.status==1){
                    $scope.alert={
                        type:'alert-success',
                        msg:'您的提现请求已经成功提交，将在3个工作日内到账，如有疑问请致电400-0732-777'
                    };
                    setTimeout(function(){
                        window.location.reload();
                    },1500)
                } else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    };
                }
            })
        }
    }
}]).controller('CompanyController', ['$rootScope','$scope','ResourceService','$filter',function ($rootScope,$scope,ResourceService,$filter) {
    //用户信息
    $scope.profile={
        User:$rootScope.USER,
        Business:null
    };
    $scope.getProfile=function(){
        if($rootScope.USER&&$rootScope.USER.IdentityTag==0){
            ResourceService.getFunServer('user',{}).then(function(data){
                if(data.status==1){
                    $scope.profile.User=data.data;
                }
            })

        }else{
            ResourceService.getFunServer('alliance',{}).then(function(data){
                if(data.status==1){
                    $scope.profile.Business=data.data[0];
                }
            });
            ResourceService.getFunServer('user',{}).then(function(data){
                if(data.status==1){
                    $scope.profile.User=data.data;
                }
            });

        }
    };
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
    };
    //读图片路径
    function getPicPath(){
        var cover=$('#OrganizationCode').find('.file-preview-frame').attr('data-path')||'noimg';
        var pics=angular.element('#BusinessLicenseNo').find('.file-preview-frame').attr('data-path')||'noimg';
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
            ResourceService.getFunServer('updateAllianceUser',$scope.employee).then(function(data){
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
    $scope.remove=function(){
      var params={
          AllianceCode:$scope.employee.AllianceCode,
          User_Alliance_AllianceCode:[{UserID:$scope.employee.UserID}]
      };
      ResourceService.deletemployee(params).then(function(data){
          if(data.data.status==1){
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
                  msg:data.data.message
              };
          }
      })
  };
    $scope.addDialog=function(){
      $rootScope.dialog('./admin/addemployee.html','CompanyController',$scope);
  };
    $scope.menber={}
    $scope.isExist=function(){
        if(!$scope.menber.Contact){
            return;
        }
        var params={
            Contact:$scope.menber.Contact
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
            if($scope.menber.Pwd!=$scope.confPwd){
                $scope.alert={
                    type:'alert-danger',
                    msg:'两次密码不一致'
                };
            }else{
                $scope.menber.Account=$scope.menber.Contact;
                ResourceService.getFunServer('addemployee',$scope.menber).then(function(data){
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
}]).controller('EntrustOrderController',['$rootScope','$scope','ResourceService','$filter',function ($rootScope,$scope,ResourceService,$filter){
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
            history:$scope.history,
            UserID:$rootScope.USER&&$rootScope.USER.Userid
        };
        //委托评估订单
        ResourceService.getFunServer('UserGetOrderList',params,'post').then(function(data){
                if(data.data.rows){
                    $scope.list=data.data.rows;
                    $scope.pageTotal=parseInt(data.data.total) ;
                }
                else {

                }

            });
    };
    //撤销评估
    $scope.revokeDialog=function(obj){
        $scope.calcel_order=obj;
        $rootScope.dialog('./admin/cancelentrust.html','EntrustOrderController',$scope)
    };
    $scope.cancelOrder=function(){
        var params={
            AppraiseOrderCode:$scope.calcel_order.AppraiseOrderCode,
        };
        ResourceService.getFunServer('UserRevoke',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'订单撤销成功'
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
    //翻页
    $scope.changePager=function(){
        window.scrollTo(0,0);
        $scope.getList();
    };
    //订单详情
    $scope.getOrder=function(){
        var params={
            OrderCode:$rootScope.stateParams.OrderCode
        };
        ResourceService.getFunServer('preassess',params).then(function(data){
            var d=data.data;
            for(var i=0;i< d.length;i++){
                var name=d[i].name;
                switch (name){
                    case  'AppraiserOrder':
                        $scope.order= d[i].value[0];
                        break;
                    case  'Car':
                        $scope.Car= d[i].value[0];
                        break;
                }
            }
        })
    };
    //评价
    $scope.evaluate=function(){
        var params={
            AppraiseOrderCode:$rootScope.stateParams.OrderCode,
            AppraiserGiveScore:$scope.AppraiserGiveScore||1,
            AppraiserFeedback:$scope.AppraiserFeedback
        };
        ResourceService.getFunServer('AppraiserFeedBack',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'评价成功'
                };
                setTimeout(function(){
                    $rootScope.state.go('home.entrustorder');
                },1500)
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    }
}]).controller('PayController',['$rootScope','$scope','PayService',function($rootScope,$scope,PayService){
    $scope.OrderCode=$rootScope.stateParams.OrderCode;
    $scope.Amount=$rootScope.stateParams.Amount;
    $scope.btn_disabled=true;
    $scope.banklistdata = [
        {
            bankid:0,
            bankcode:'01000000',
            bankname:'邮储银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                }
            ],
            bankdesc:'电话：95580',
            sname:'post'
        },
        {
            bankid:1,
            bankcode:'01020000',
            bankname:'工商银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95588',
            sname:'icbc'
        },
        {
            bankid:2,
            bankcode:'01030000',
            bankname:'农业银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95599',
            sname:'abc'
        },
        {
            bankid:3,
            bankcode:'01040000',
            bankname:'中国银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95566',
            sname:'boc'
        },
        {
            bankid:4,
            bankcode:'01050000',
            bankname:'建设银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95533',
            sname:'bccb'
        },
        {
            bankid:5,
            bankcode:'03010000',
            bankname:'交通银行',
            banktype:[
                {
                    cardtype:'3',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95559',
            sname:'bcom'
        },
        {
            bankid:6,
            bankcode:'03020000',
            bankname:'中信银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                }
            ],
            bankdesc:'电话：95558',
            sname:'citic'
        },
        {
            bankid:7,
            bankcode:'03030000',
            bankname:'光大银行',
            banktype:[
                {
                    cardtype:'3',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95595',
            sname:'ceb'
        },
        {
            bankid:8,
            bankcode:'03050000',
            bankname:'中国民生银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95568',
            sname:'cmbc'
        },
        {
            bankid:9,
            bankcode:'03060000',
            bankname:'广发银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'2',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95508',
            sname:'cgb'
        },
        {
            bankid:10,
            bankcode:'03070000',
            bankname:'平安银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'1',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：4006699999',
            sname:'pab'
        },
        {
            bankid:11,
            bankcode:'03080000',
            bankname:'招商银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95555',
            sname:'cmb'
        },
        {
            bankid:12,
            bankcode:'03090000',
            bankname:'兴业银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                }
            ],
            bankdesc:'电话：95561',
            sname:'cib'
        },
        {
            bankid:13,
            bankcode:'03100000',
            bankname:'浦发银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                },
                {
                    cardtype:'2',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：95528',
            sname:'spdb'
        },
        {
            bankid:14,
            bankcode:'03200000',
            bankname:'东亚银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                }
            ],
            bankdesc:'电话：8008303811',
            sname:'hkbea'
        },
        {
            bankid:15,
            bankcode:'04031000',
            bankname:'北京银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                }
            ],
            bankdesc:'电话：95526',
            sname:'bob'
        },
        {
            bankid:16,
            bankcode:'04083320',
            bankname:'宁波银行',
            banktype:[
                {
                    cardtype:'3',
                    cardname:'借记卡'
                }
            ],
            bankdesc:'电话：96528',
            sname:'nbcb'
        },
        {
            bankid:17,
            bankcode:'04243010',
            bankname:'南京银行',
            banktype:[
                {
                    cardtype:'1',
                    cardname:'借记卡'
                }
            ],
            bankdesc:'电话：96400',
            sname:'njcb'
        },
        {
            bankid:18,
            bankcode:'65012900',
            bankname:'上海农村商业银行',
            banktype:[
                {
                    cardtype:'3',
                    cardname:'借记卡'
                },
                {
                    cardtype:'3',
                    cardname:'信用卡'
                }
            ],
            bankdesc:'电话：4006962999',
            sname:'srcb'
        }
    ];
    $scope.pay=function(){
        var  obj = {
            orderCode: $scope.OrderCode,
            bank_code:$('input[name=bankcode]').val(),
            pay_type:$('input[name=banktype]').val()
        };
        if (obj.orderCode ==null || obj.bank_code =='' || obj.pay_type == '') {
            $scope.alert={
                type:'alert-danger',
                msg:'请选择支付方式和银行卡类型'
            };
            return false;
        }
        PayService.AppraiserPay(obj).success(
            function(d){
                if (d.data != null) {
                    $scope.paydata = d.data;
                    $scope.btn_disabled=false
                }
                else{
                    $scope.btn_disabled=true;
                }
            }
        );
    };
    $scope.checkpay=function(){
      $rootScope.dialog('./admin/payconfirm.html','PayController',$scope)
    };
    $scope.obstacle=function(){
        window.location.reload();
    };
    $scope.complete=function(){
        $scope.cancel();
        $rootScope.state.go('home.entrustorder');
    }
}]).controller('MainController',['$rootScope','$scope','ResourceService','$filter',function ($rootScope,$scope,ResourceService,$filter){

    //用户信息
    $scope.profile={
        User:$rootScope.USER,
        Business:null
    };
    $scope.getProfile=function(){
        if($rootScope.USER&&$rootScope.USER.IdentityTag==0){
            ResourceService.getFunServer('user',{}).then(function(data){
                if(data.status==1){
                    $scope.profile.User=data.data;
                }
            })

        }else{
            ResourceService.getFunServer('alliance',{}).then(function(data){
                if(data.status==1){
                    $scope.profile.Business=data.data[0];
                }
            });
            ResourceService.getFunServer('user',{}).then(function(data){
                if(data.status==1){
                    $scope.profile.User=data.data;
                }
            });

        }
    };
}]).controller('AppraiserController',['$rootScope','$scope','ResourceService','$filter','AppraiserService',function ($rootScope,$scope,ResourceService,$filter,AppraiserService){

    //评估师信息
    $scope.getAppraiser=function(){
        if($rootScope.USER&&$rootScope.USER.AppraiserCode)
        {
            var params={
                AppraiserCode:$rootScope.USER&&$rootScope.USER.AppraiserCode
            };
            ResourceService.getFunServer('appraiser',params).then(function (data){
                if(data.status==1){
                    $scope.appraiser=data.data.Appraiser[0];
                    $scope.skill=data.data.AppraiserSkill;
                }
            })
        }
    };
    //更新评估师信息
    $scope.updateAppraiser=function(){
        ResourceService.getFunServer('updateappraiser',$scope.appraiser).then(function(data){
            if(data.status==1){

            }else{
               $rootScope.toast(data.message)
            }
        })
    };
    //签名
    $scope.signature=function(){
        //签名
        var ca1 = new CropAvatar('#crop-signature');
        $scope.uplodeImg = function() {
            ca1.submit().success(function(d) {
                $scope.appraiser.Signature= d.data;
                $scope.updateAppraiser();
            })
        };
        ca1.click();
    };
    //评估师申请
    $scope.approve=function(){
       var params={
           realName:$scope.realName,
           AppraiserPic:angular.element('#cover').find('.file-preview-frame').data('path')
       };
        ResourceService.getFunServer('apprasiorApply',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'您的申请已提交，我们将尽快为您审核'
                }
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    };
    //删除技能
    $scope.deleteSkill=function(skillID){
        if(skillID){
            var params={
                SkillID:skillID
            };
            ResourceService.getFunServer('deleteSkill',params).then(function(data){
                if(data.status==1){
                    $scope.alert={
                        type:'alert-success',
                        msg:'删除成功'
                    };
                    setTimeout(function(){
                        $scope.getAppraiser();
                        $scope.alert={
                            type:null,
                            msg:null
                        }
                    },1500)
                }else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    }
                }
            })
        }
    };
    //添加技能
    $scope.addDialog=function(){
        $rootScope.dialog('./admin/addprofess.html','AppraiserController',$scope)

    };
    $scope.add=function(){
        var params=[];
        var elem=angular.element('#selectBrand').find('a');
        angular.forEach(elem,function(obj,index){
           var o=new Object();
            o.BrandID=obj.id;
            o.AppraiserCode=$rootScope.USER&&$rootScope.USER.AppraiserCode;
            params.push(o);
        });
        if(params.length>0){
            AppraiserService.AddSkill(params).success(function(data){
                if(data.status==1){
                    $scope.alert={
                        type:'alert-success',
                        msg:'新技能添加成功'
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
        else{
            $scope.alert={
                type:'alert-danger',
                msg:'您没有选择技能'
            };
        }


    }
}]).controller('EntrustController',['$rootScope','$scope','ResourceService','$filter',function ($rootScope,$scope,ResourceService,$filter){
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
            history:$scope.history,
            AppraiserCode:$rootScope.USER&&$rootScope.USER.AppraiserCode
        };
        //委托评估订单
        ResourceService.getFunServer('AppraiserGetOrderList',params,'post').then(function(data){
            if(data.status==1){
                var entity=data.data;
                for(var i=0;i< entity.length;i++){
                    var name=entity[i].name;
                    switch (name){
                        case  'AppraiserOrder':
                            $scope.orderlist= entity[i].value.rows;
                            $scope.pageTotal=entity[i].value.total;
                            break;
                        case  'Car':
                            $scope.car= entity[i].value.rows;
                            break;

                    }
                }
                $scope.list=$filter('EntrustOrder')($scope.orderlist,$scope.car);

            }
            else {
                $scope.list=[];
                $scope.pageTotal=0 ;
            }

        });
    };
    //接单
    $scope.acceptDialog=function(obj){
        $scope.accept_order=obj;
        $rootScope.dialog('./admin/acceptentrust.html','EntrustController',$scope);
    };
    $scope.accept=function(){
        var params={
            AppraiseOrderCode:$scope.accept_order.AppraiseOrderCode,
            AppraiserFee:$scope.accept_order.AppraiserFee
        };
        ResourceService.getFunServer('AppraiserAccept',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'操作成功'
                };
                setTimeout(function(){
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
    //翻页
    $scope.changePager=function(){
        window.scrollTo(0,0);
        $scope.getList();
    };
    //订单详情
    $scope.getOrder=function(){
        var params={
            OrderCode:$rootScope.stateParams.OrderCode
        };
        ResourceService.getFunServer('preassess',params).then(function(data){
            var d=data.data;
            for(var i=0;i< d.length;i++){
                var name=d[i].name;
                switch (name){
                    case  'AppraiserOrder':
                        $scope.order= d[i].value[0];
                        break;
                    case  'Car':
                        $scope.Car= d[i].value[0];
                        break;
                }
            }
        })
    };
    //评价
    $scope.evaluate=function(){
        var params={
            AppraiseOrderCode:$rootScope.stateParams.OrderCode,
            UserGiveScore:$scope.UserGiveScore||1,
            UserFeedback:$scope.UserFeedback
        };
        ResourceService.getFunServer('UserFeedBack',params).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'评价成功'
                };
                setTimeout(function(){
                    $rootScope.state.go('home.entrust');
                },1500)
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    }
}]).controller('DetectionController',['$rootScope','$scope','ResourceService','$filter','CarService',function ($rootScope,$scope,ResourceService,$filter,CarService){
    var CarNo=$rootScope.stateParams.CarNo;
    var EventFlag=$rootScope.stateParams.Event||0;////委托检测  检测+评估 1,交易车辆卖方检测 2,交易车辆买方检测 3,线下检测 4 默认检测    只检测不做评估 0;
    var TestCode=$rootScope.stateParams.Code;
    var OrderCode=$rootScope.stateParams.OrderCode;
    $scope.dateTimeNow=new Date();
    $scope.Test_ReportPic={
        CarPic:[],
        ProcudPic:[],
        FlawPic:[],
        ProofPic:[]
    };
    $scope.report={
        CarNo: CarNo,
        CarRate: "95",
        TestDescription: "经检测，排除重大事故、排除水淹、排除火烧；外观正常，无钣金修复、无刮擦；内饰整洁干净无异味；安全系统、刹车系统以及电子设备一切正常；发动机启动运行正常，动力充沛，换挡平顺，一切正常！",
        EventFlag: EventFlag,
        AccidentCheckMemo: "车体骨架结构无变形、无扭曲、无更换、无烧焊、无褶皱；无火烧痕迹，无水泡痕迹。",
        SecurityCheckMemo: "经检测轮胎正常、四门螺丝正常。",
        ControlCheckMemo: "经试驾员专业测试，发动机、变速箱正常，无怠速抖动，变速时无闯档顿挫，转向无乏力感。",
        AICheckMemo: "经检测，无钣金修复、无刮擦，外观正常；灯光设备正常；内饰整洁干净，无异味。其它无更换、无异常！",
        DeviceCheckMemo: "经检测，安全系统正常、电子设备正常、发动机舱正常！",
        OtheMemo:"",
        Test_ReportCarSurfaceCase_Test_Report_TestReportCode:[],
        Test_ReportDetail_Test_Report_TestReportCode:[],
        Test_ReportPic_Test_Report_TestReportCode:[]
    };
    $scope.car={
        WholesalePrice:0,
        Mileage:0,
        TransferNo:0,
        UseType:1,
        OwnerType:1,
        WomenCar:0
    };

    //读取车系
    $scope.getSeries=function(){
        var params={
            BrandID:$scope.car.BrandID
        };
        if(params.BrandID){
            ResourceService.getFunServer('Series',params).then(function(data){
                if(data.status==1){
                    $scope.series=data.data;
                }
                else{
                    $scope.series=[];
                }
            })
        }
    };
    //读取型号
    $scope.getArctics=function(){
        $scope.spec=null;
        var params={
            brandid:$scope.car.BrandID,
            seriesid:$scope.car.SeriesID
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

    $scope.Discharges=[{
        value:'1',
        detail:'国II'
    },{
        value:'2',
        detail:'国III'
    },{
        value:'3',
        detail:'国IV'
    },{
        value:'3',
        detail:'国IV(国V)'
    },{
        value:'3',
        detail:'国IV/京V'
    },{
        value:'3',
        detail:'国IV(国V)+OBD'
    },{
        value:'4',
        detail:'国V+OBD'
    },{
        value:'1',
        detail:'欧II'
    },{
        value:'2',
        detail:'欧III'
    },{
        value:'2',
        detail:'欧III+OBD'
    },{
        value:'3',
        detail:'欧IV'
    },{
        value:'3',
        detail:'欧IV+OBD'
    },{
        value:'4',
        detail:'欧V'
    },{
        value:'4',
        detail:'欧V+OBD'
    },{
        value:'4',
        detail:'欧VI'
    }];
    //车辆详情
    $scope.carInfo=function(){
        var params={
            CarNo:CarNo
        };
        ResourceService.getFunServer('GetCardata',params).then(function(data){
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
                            $scope.DischargeStandard=$scope.car.DischargeStandardDetail;
                            $scope.Color=$scope.car.Color;
                            break;
                        case 'CarPic':
                            $scope.CarPic=val[i].value;

                            break;
                        default:

                            break;
                    }
                }
                $scope.getSeries();
                return $scope.car;
            }
        });
    };
    //修改品牌
    $scope.editabled=function(){
        $scope.isEdit=!$scope.isEdit;
    };
    //提交检测报告
    $scope.detect=function(){
        var Accident=angular.element('#Accident i.glyphicon-exclamation-sign');
        var Security=angular.element('#Security i.glyphicon-exclamation-sign');
        var AI=angular.element('#AI li');
        var GC=angular.element('#GC_PZ .e_guacha');
        var PZ=angular.element('#GC_PZ .e_pengzhuang');
        var Device=angular.element('#Device li');
        var Engine=angular.element('#Engine i.glyphicon-exclamation-sign');
        var A=-1,B=-1,C=-1,D=-1;
        var Test_ReportDetail_Test_Report_TestReportCode=[];
        var Test_ReportCarSurfaceCase_Test_Report_TestReportCode=[];
        angular.forEach(Accident,function(obj,index){
           var id=$(obj).attr('id');
           var value=$(obj).attr('value');
           var o={};
            o.AbnormalColumn=id;
            o.Flag=value;
            o.Description='缺陷';
            Test_ReportDetail_Test_Report_TestReportCode.push(o);
            if(parseInt(id,10)<18){
                D=0; //D
            }
            if(parseInt(id,10)==18||parseInt(id,10)==123||parseInt(id,10)==124){
                C=0;//C
            }
        });
        angular.forEach(Security,function(obj,index){
            var id=$(obj).attr('id');
            var value=$(obj).attr('value');
            var o={};
            o.AbnormalColumn=id;
            o.Flag=value;
            o.Description='缺陷';
            Test_ReportDetail_Test_Report_TestReportCode.push(o);
        });
        angular.forEach(AI,function(obj,index){
            var id=$(obj).attr('id');
            var value=parseInt($(obj).attr('value'),10);
            if(value!=0){
                var o={};
                o.AbnormalColumn=id;
                o.Flag=1;
                o.Param1=value;
                if(value==1){
                    o.Description='修复';
                }
                else if(value==2){
                    o.Description='更换';
                }
                else if(value==3){
                    o.Description='色差';
                }
                Test_ReportDetail_Test_Report_TestReportCode.push(o);
                if(parseInt(id,10)>63&&parseInt(id,10)<75){
                   B=0;
                }
                else if(parseInt(id,10)==75||parseInt(id,10)==76){
                   A=0;
                }
            }
        });
        angular.forEach(GC,function(obj,index){
            var X=$(obj).data('x');
            var Y=$(obj).data('y');
            var o={};
            o.ProblemFlag=1;
            o.X=X;
            o.Y=Y;
            Test_ReportCarSurfaceCase_Test_Report_TestReportCode.push(o);
            B=0;
        });
        angular.forEach(PZ,function(obj,index){
            var X=$(obj).data('x');
            var Y=$(obj).data('y');
            var o={};
            o.ProblemFlag=2;
            o.X=X;
            o.Y=Y;
            Test_ReportCarSurfaceCase_Test_Report_TestReportCode.push(o);
            B=0;
        });
        angular.forEach(Device,function(obj,index){
            var btn=$(obj).find('.moreitem-btn a');
            var btn_value=parseFloat(btn.attr('data-value'));
            var id=btn.attr('data-name');
            var dot=$(obj).find('i.glyphicon');
            if(btn_value==-1){
                var o={};
                o.AbnormalColumn=id;
                o.Flag=0;
                o.Description='无';
                Test_ReportDetail_Test_Report_TestReportCode.push(o);
            }
           if(btn_value==0){
               if(dot.length>1){
                   angular.forEach(dot,function(d,index){
                       var value=parseInt($(d).attr('value'),10);
                       if(value==1){
                           var o={};
                           o.AbnormalColumn=id;
                           o.Flag=1;
                           o.Description='缺陷';
                           o.DeviceType=$(d).attr('data-name');
                           Test_ReportDetail_Test_Report_TestReportCode.push(o);
                       }
                   })
               }else{
                   var value=parseInt(dot.attr('value'),10);
                   if(value==1){
                       var o={};
                       o.AbnormalColumn=id;
                       o.Flag=1;
                       o.Description='缺陷';
                       o.DeviceType=$(d).attr('data-name');
                       Test_ReportDetail_Test_Report_TestReportCode.push(o);
                   }
               }
           }else{

                   var o={};
                   o.AbnormalColumn=id;
                   o.Flag=dot.attr('value');
                   o.Description=btn.text();
                   o.DeviceType=btn_value;
                   Test_ReportDetail_Test_Report_TestReportCode.push(o);
           }
        });
        angular.forEach(Engine,function(obj,index){
            var id=$(obj).attr('id');
            var value=$(obj).attr('value');
            var o={};
            o.AbnormalColumn=id;
            o.Flag=value;
            o.Description='缺陷';
            Test_ReportDetail_Test_Report_TestReportCode.push(o);

        });
        $scope.report.Test_ReportDetail_Test_Report_TestReportCode=Test_ReportDetail_Test_Report_TestReportCode;
        $scope.report.Test_ReportCarSurfaceCase_Test_Report_TestReportCode=Test_ReportCarSurfaceCase_Test_Report_TestReportCode;
        var CarRate='';
        if(A==0&&B==-1&&C==-1&&D==-1){
            CarRate="A";
        }
        if(B==0&&C==-1&&D==-1){
            CarRate="B";
        }
        if(C==0&&D==-1){
           CarRate="C";
        }
        if(D==0){
            CarRate="D";
        }
        if(A==-1&&B==-1&&C==-1&&D==-1){
            CarRate="A";
        }
        $scope.report.CarRate=$scope.report.CarRate+CarRate;
        $scope.report.Test_ReportPic_Test_Report_TestReportCode=getPic();
        if(!$scope.report.Test_ReportPic_Test_Report_TestReportCode){
            return false;
        }
        var params={
            AppraiseOrderCode:OrderCode,
            TestReportCode:$scope.report
        };
        if(EventFlag==1){
            CarService.detection(params).success(function(data){
                if(data.status==1){

                    $scope.addCar(data.data,EventFlag);
                }else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    };
                }
            })
        }
        else{
            CarService.WriteTestReport($scope.report).success(function(data){
                if(data.status==1){
                    $scope.addCar(data.data,EventFlag);
                }
                else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    };
                }
            })
        }
    };
    $scope.addCar= function (reportCode,event) {
           if(!reportCode){
               return ;
           }
            $scope.car.TestReportCode=reportCode;
            $scope.car.CatalogID=$scope.spec.CatalogID;
            $scope.car.SpecName=$scope.spec.SpecName;
            angular.forEach($scope.Discharges,function(obj,index){
                if(obj.detail==$scope.DischargeStandard){
                    $scope.car.DischargeStandard=obj.value;
                    return;
                }
            });
            $scope.car.DischargeStandardDetail=$scope.DischargeStandard;
            CarService.addCarInfo($scope.car).success(function(data){
                if(data.status==1){
                    if(event==1){
                        $scope.alert={
                            type:'alert-success',
                            msg:'检测报告发布成功，为您转到评估报告......'
                        };
                        setTimeout(function(){
                            $rootScope.state.go('assess',{'OrderCode':OrderCode})
                        },1500)
                    }else{
                        $scope.alert={
                            type:'alert-success',
                            msg:'检测报告发布成功'
                        };
                        setTimeout(function(){
                            window.location.href='/admin.html#/home/cargather';
                        },1500)

                    }
                }else{
                    $scope.alert={
                        type:'alert-danger',
                        msg:data.message
                    };
                }
            })

    };
    //排序
    var sortByFlag=function(a,b){
       return Number(a.SerialNO)< Number(b.SerialNO);
    };
    //获取检测报告
    $scope.getReport=function(){
        var params={
            TestReportCode:TestCode
        };
       ResourceService.getFunServer('GetTestReportWithCode',params).then(function(data){
            if(data.status==1){
                var d=data.data;
                for (var i=0;i< d.length;i++){
                    var name=d[i].name;
                    switch (name){
                        case "Test_Report":
                            $scope.report = d[i].value[0];
                            break;
                        case "Test_ReportDetail":
                            $scope.report.ReportDetail = d[i].value;
                            break;
                        case "Test_ReportCarSurfaceCase":
                            $scope.report.SurfaceCase = d[i].value;
                            break;
                        case "Test_ReportPic":
                            $scope.report.Test_ReportPic = d[i].value;
                            break;
                        case "Test_ReportCarInfo":
                            $scope.report.Car = d[i].value[0];
                            break;
                        default:
                            break;
                    }
                }
                $scope.score={
                     'background-image':'url("../images/detection/'+$scope.report.CarRate+'.png")'
                };
                viewReport();
            }
       })
    };
    //获取图片
    var getPic=function(){
        var allpics=angular.element('#uploaderbar').find('.gallery-file-preview-frame');
        var carpictures=angular.element('#carpictures').find('.gallery-file-preview-frame');
        var procedure=angular.element('#procedure').find('.gallery-file-preview-frame');
        var abnormal=angular.element('#abnormal').find('.gallery-file-preview-frame');
        var proof=angular.element('#proof').find('.gallery-file-preview-frame');
        var Test_ReportPic=[];
        if(allpics.length>0){
            $scope.alert={
                type:'alert-warning',
                msg:'请对上传的图片进行分类'
            };
            return false;

        }
        angular.forEach(carpictures,function(obj,index){
            var o=new Object();
            var elem=$(obj);
            var path=elem.data('path');
            var remark=elem.find('textarea').val();
            o.PicURL=path;
            o.PictureFlag=0;
            o.PicMemo=remark;
            o.SerialNO=index+1;
            Test_ReportPic.push(o);
        });
        angular.forEach(procedure,function(obj,index){
            var o=new Object();
            var elem=$(obj);
            var path=elem.data('path');
            var remark=elem.find('textarea').val();
            o.PicURL=path;
            o.PictureFlag=1;
            o.PicMemo=remark;
            o.SerialNO=index+1;
            Test_ReportPic.push(o);
        });
        angular.forEach(abnormal,function(obj,index){
            var o=new Object();
            var elem=$(obj);
            var path=elem.data('path');
            var remark=elem.find('textarea').val();
            o.PicURL=path;
            o.PictureFlag=2;
            o.PicMemo=remark;
            o.SerialNO=index+1;
            Test_ReportPic.push(o);
        });
        angular.forEach(proof,function(obj,index){
            var o=new Object();
            var elem=$(obj);
            var path=elem.data('path');
            var remark=elem.find('textarea').val();
            o.PicURL=path;
            o.PictureFlag=3;
            o.PicMemo=remark;
            o.SerialNO=index+1;
            Test_ReportPic.push(o);
        });
        return Test_ReportPic;
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

}]).controller('AssessController',['$rootScope','$scope','ResourceService','$filter','CarService',function ($rootScope,$scope,ResourceService,$filter,CarService){
    var OrderCode=$rootScope.stateParams.OrderCode;
    var ReportCode=$rootScope.stateParams.Code;
    $scope.dateTimeNow=new Date();
    $scope.endTime=new Date(($scope.dateTimeNow/1000+86400*90)*1000).toLocaleDateString();
    $scope.evaluate={
        TechnologyParam:1,
        MaintainParam:1,
        QualityParam:1,
        NatureParam:1,
        ConditionParam:1,
        HotParam:1,
        EvaluationPrice:0,
        CarNo:'',
        EventFlag:1,
        UserID:$rootScope.USER.Userid
    };
    //获取数据
    $scope.getPreAssess=function(){
       var params={
           OrderCode:OrderCode
       };
       ResourceService.getFunServer('preassess',params).then(function(data){
           if(data.status==1){
                 var d=data.data;
                 for(var i=0;i< d.length;i++){
                     var name=d[i].name;
                     switch (name){
                         case  'AppraiserOrder':
                             $scope.Order= d[i].value[0];
                             break;
                         case  'Car':
                             $scope.Car= d[i].value[0];
                             $scope.evaluate.EvaluationPrice=$scope.Car.NewCarPrice;
                             $scope.evaluate.CarNo=$scope.Car.CarNo;
                             break;
                         case  'Appraiser':
                             $scope.Appraiser= d[i].value[0];
                             break;
                     }
                 }
           }
       });
    };
    //计算车价
     $scope.$watch('evaluate',function(newValue){
         Number(newValue.TechnologyParam)>1?newValue.TechnologyParam=1:newValue.TechnologyParam;
         Number(newValue.MaintainParam)>1?newValue.MaintainParam=1:newValue.MaintainParam;
         Number(newValue.QualityParam)>1?newValue.QualityParam=1:newValue.QualityParam;
         Number(newValue.NatureParam)>1?newValue.NatureParam=1:newValue.NatureParam;
         Number(newValue.ConditionParam)>1?newValue.ConditionParam=1:newValue.ConditionParam;
         var   b = (Number(newValue.TechnologyParam) * 0.3) + (Number(newValue.MaintainParam) * 0.25) + (Number(newValue.QualityParam) * 0.2) + (Number(newValue.NatureParam) * 0.15) + (Number(newValue.ConditionParam) * 0.1);
         var cary = $scope.Car&&$scope.Car.CarYear || 0.1;
         y = ((1 - (Number(0.1) * 12) / 180)) * b;
         p = Math.ceil(Number($scope.Car&&$scope.Car.NewCarPrice) * y * Number(newValue.HotParam));
         $scope.evaluate.EvaluationPrice=p;
     },true);
     //提交
     $scope.assess=function(){
         var params={
             AppraiseOrderCode:OrderCode,
             ReportCode:$scope.evaluate
         };
         CarService.assess(params).success(function(data){
             if(data.status==1){
                 $rootScope.state.go('success',{TAG:'ASSESS'})
             }
             else{
                 $scope.alert={
                     type:'alert-danger',
                     msg:data.message
                 };
             }
         });
     };
     //查看评估报告
     $scope.getAssess=function(){
         var params={
             ReportCode:ReportCode
         };
         ResourceService.getFunServer('viewassess',params).then(function(data){
             if(data.status==1){
                 var d=data.data;
                 for(var i=0;i< d.length;i++){
                     var name=d[i].name;
                     switch (name){
                         case  'Evaluation_Report':
                             $scope.evaluate= d[i].value[0];
                             $scope.Order=d[i].value[0];
                             break;
                         case  'Car':
                             $scope.Car= d[i].value[0];
                             break;
                         case  'Appraiser':
                             $scope.Appraiser= d[i].value[0];
                             break;
                     }
                 }
             }
         })
     }
}]).controller('GeneralController',['$rootScope','$scope','ResourceService','$filter','CarService',function ($rootScope,$scope,ResourceService,$filter,CarService){
    $scope.feedback=function(){
        ResourceService.getFunServer('fb',$scope.FB).then(function(data){
            if(data.status==1){
                $scope.alert={
                    type:'alert-success',
                    msg:'提交成功'
                };
                setTimeout(function(){
                    window.location.reload();
                },1500)
            }else{
                $scope.alert={
                    type:'alert-danger',
                    msg:data.message
                }
            }
        })
    }

}]).controller('CouponController',['$rootScope','$scope','ResourceService','$filter','CarService',function ($rootScope,$scope,ResourceService,$filter,CarService){

    $scope.pageTotal=0;
    $scope.getList=function(){

        var params = {
            PageNo: $scope.currentPage||1,
            PageSize:$rootScope.PAGE_CONF.PageSize
        };
        ResourceService.getFunServer('discount',params).then(function(data){
            if(data.status==1){
                $scope.discountlist=data.data;
                $scope.pageTotal=data.data.length;
            }
            else {
                $scope.discountlist=[];
                $scope.pageTotal=0;
            }
        })
    };
    $scope.getDiscount=function(){
        var params={
            PolicyCode:$rootScope.stateParams.PolicyCode
        };
        ResourceService.getFunServer('discountinfo',params).then(function(data){
            if(data.status==1){
                $scope.discount=data.data;
            }
        })
    };
    $scope.changePager=function(){
        window.scrollTo(0,0);
        $scope.getList();
    }
}]).controller('OfflineController',['$rootScope','$scope','ResourceService','$filter','CarService',function ($rootScope,$scope,ResourceService,$filter,CarService){

    $scope.pageTotal=0;
    $scope.getList=function(){
        var params = {
            PageNo: $scope.currentPage||1,
            PageSize:$rootScope.PAGE_CONF.PageSize
        };
        ResourceService.getFunServer('offline',params).then(function(data){
            if(data.status==1){
                $scope.list=data.data.rows;
                $scope.pageTotal=data.data.total;
            }
            else {
                $scope.list=[];
                $scope.pageTotal=0;
            }
        })
    };
    $scope.getDiscount=function(){
        var params={
            PolicyCode:$rootScope.stateParams.PolicyCode
        };
        ResourceService.getFunServer('discountinfo',params).then(function(data){
            if(data.status==1){
                $scope.discount=data.data;
            }
        })
    };
    $scope.changePager=function(){
        window.scrollTo(0,0);
        $scope.getList();
    }
}]);