/**
 * Created by Administrator on 2016/2/18.
 */
angular.module('chetongxiang.directives', []).directive('uploader', ['UploaderService', 'ResourceService', function (UploaderService, ResourceService) {
//
    return {
        restrict: 'AE',
        replace: false,
        templateUrl: './statics/uploader.html',
        link: function (scope, element, attr) {

        },
        compile:function(element,attr){
            var $elem = $(element);
            var $btn = $(element).find('.filePicker');
            var $start=$(element).find('.uploader-btn');
            $elem.on('click', '.kv-file-remove',function (e) {
                var params={
                    CarPicID:$(e.target).parents('.file-preview-frame').attr('id')
                };
                if(params.CarPicID=='undefined'){
                    $(e.target).parents('.file-preview-frame').remove();
                    var length = $elem.find('.file-preview-frame').length;
                    if (length == 0) {
                        $elem.find('.file-drop-zone-title').show();
                    }
                }
                else if(params.CarPicID!='undefined') {
                    ResourceService.getFunServer('deletecarimg',params,'post').then(function(data){
                        if(data.status==1){
                            $(e.target).parents('.file-preview-frame').remove();
                            var length = $elem.find('.file-preview-frame').length;
                            if (length == 0) {
                                $elem.find('.file-drop-zone-title').show();
                            }
                        }
                    })
                }
            });
            // 初始化Web Uploader
            var uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                // swf文件路径
                swf: './lib/webuploader-0.1.5/Uploader.swf',
                // 文件接收服务端。
                server: attr.action,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: $btn,
                //文件上传方式
                method:"POST",
                threads:1,
                //是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容
                sendAsBinary:false,
                // 开起分片上传。 thinkphp的上传类测试分片无效,图片丢失;
                chunked:false,
                // 只允许选择图片文件。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },
                //配置生成缩略图的选项
                thumb:{
                    width:210,
                    height:137,
                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality:70,
                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify:false,
                    // 是否允许裁剪。
                    crop:true,
                    // 为空的话则保留原有图片格式。
                    // 否则强制转换成指定的类型。
                    type:"image/jpeg"
                },
                fileNumLimit: attr.limit||32,
                // 分片大小
                chunkSize:512 * 1024,
                //最大上传的文件数量, 总文件大小,单个文件大小(单位字节);
                fileSizeLimit:500000 * 1024,
                fileSingleSizeLimit:50000 * 1024
            });
            // 当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                var $li = $('<li class="file-preview-frame col-md-3" id="' + file.id + '">' +
                    '<img style="width:210px;height:137px;"  class="file-preview-image" >' +
                    '<div class="file-thumbnail-footer">' +
                    '<div class="file-actions">' +
                    '<div class="file-footer-buttons"><span class="text-primary pull-left img-loading"><i class="glyphicon glyphicon-info-sign"></i> <span class="up-text">待上传</span></span>' +
                    '<button title="删除" class="kv-file-remove btn btn-xs btn-default pull-right" type="button">   <i class="glyphicon glyphicon-trash text-danger"></i>' +
                    '</button>' +
                    '</div></div></div></li>');
                var $img = $li.find('.file-preview-image');
                $elem.find('.file-drop-zone-title').hide();
                if(attr.multi&&attr.multi=='true'){
                    $elem.find('.file-preview-thumbnails').append($li);
                }
                else{
                    $elem.find('.file-preview-thumbnails').html($li);
                }
                // 创建缩略图
                // 如果为非图片文件，可以不用调用此方法。
                uploader.makeThumb(file, function (error, src) {
                    if (error) {
                        $img.replaceWith('<span>不能预览</span>');
                        return;
                    }
                    $img.attr('src', src);
                });
                $elem.find('.kv-file-remove').bind('click', function (e) {
                    var filename = $(this).parents('.file-preview-frame').data('path');
                    if (filename) {
                        ResourceService.getFunServer('delimg', {fileName: filename});
                    }
                    uploader.removeFile(file.id);
                    $(e.target).parents('.file-preview-frame').remove();
                    var length = $elem.find('.file-preview-frame').length;
                    if (length == 0) {
                        $elem.find('.file-drop-zone-title').show();
                    }
                });

            });
            // 文件上传过程中创建进度条实时显示。
            uploader.on('uploadProgress', function (file, percentage) {
                $('#' + file.id).find('.up-text').text(parseInt(percentage*100) +'%');
                console.log(percentage)
            });
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on('uploadSuccess', function (file, data) {
                $('#' + file.id).find('.file-preview-image').attr('src',data.data);
                $('#' + file.id).attr('data-path', data.data);
                $('#' + file.id).find('.up-text').text('上传成功');
            });
            // 文件上传失败，显示上传出错。
            uploader.on('uploadError', function (file) {
                $('#' + file.id).find('.img-loading').find('img').remove();
                $('#' + file.id).find('.img-loading').removeClass('text-orange').addClass('text-danger');
                $('#' + file.id).find('.up-text').text('上传失败，请重试');
            });

            // 完成上传完了，成功或者失败
            uploader.on('uploadComplete', function (file) {

            });
            $start.bind('click',function(){
                uploader.upload();
            })

        }
    }
}]).directive('gallery', ['UploaderService', 'ResourceService', function (UploaderService, ResourceService) {
   //
    return {
        restrict: 'AE',
        replace: false,
        templateUrl: './statics/gallery.html',
        link: function (scope, element, attr) {

        },
        compile:function(element, attr){
            var $elem = $(element);
            var $btn = $(element).find('.filePicker');
            var $start=$(element).find('.uploader-btn');
            // 初始化Web Uploader
            var uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: false,
                // swf文件路径
                swf: './lib/webuploader-0.1.5/Uploader.swf',
                // 文件接收服务端。
                server: attr.action,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: $btn,
                //文件上传方式
                method:"POST",
                //是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容
                sendAsBinary:false,
                // 开起分片上传。 thinkphp的上传类测试分片无效,图片丢失;
                chunked:false,
                threads:1,
                // 只允许选择图片文件。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },
                //配置生成缩略图的选项
                thumb:{
                    width:210,
                    height:137,
                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality:70,
                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify:false,
                    // 是否允许裁剪。
                    crop:true,
                    // 为空的话则保留原有图片格式。
                    // 否则强制转换成指定的类型。
                    type:"image/jpeg"
                },
                fileNumLimit: attr.limit||32,
                // 分片大小
                chunkSize:512 * 1024,
                //最大上传的文件数量, 总文件大小,单个文件大小(单位字节);
                fileSizeLimit:500000 * 1024,
                fileSingleSizeLimit:50000 * 1024
            });

            // 当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                var $li = $('<li class="gallery-file-preview-frame" id="' + file.id + '">' +
                    '<img style="width:100%;height:200px;"  class="file-preview-image" >' +
                    '<div class="file-thumbnail-footer">' +
                    '<div class="file-actions">' +
                    '<div class="file-footer-buttons"><span class="text-primary pull-left img-loading"><i class="glyphicon glyphicon-info-sign"></i> <span class="up-text">等待上传</span></span>' +
                    '<button title="删除" class="kv-file-remove btn btn-xs btn-default pull-right" type="button">   <i class="glyphicon glyphicon-trash text-danger"></i>' +
                    '</button> ' +
                    '</div> </div></div>' +
                    '<textarea class="form-control" placeholder="填写图片备注"></textarea>'+
                    '<div class="file-thumbnail-remark">' +
                    '<label class="checkbox-inline">'+
                    '<input type="radio" name="'+file.id+'"  value="0" > 基本照'+
                    '</label>'+
                    '<label class="checkbox-inline">'+
                    '<input type="radio" name="'+file.id+'"  value="1" > 手续照'+
                    '</label>'+
                    '<label class="checkbox-inline">'+
                    '<input type="radio" name="'+file.id+'" value="2" > 瑕疵照'+
                    '</label>'+
                    '<label class="checkbox-inline">'+
                    '<input type="radio" name="'+file.id+'"  value="3" > 泡水火烧照'+
                    '</label>'+
                    '</div>' +
                    '</li>');
                var $img = $li.find('.file-preview-image');
                $elem.find('.file-drop-zone-title').hide();
                $elem.find('.file-preview-thumbnails').append($li);
                // 如果为非图片文件，可以不用调用此方法。
                uploader.makeThumb(file, function (error, src) {
                    if (error) {
                        $img.replaceWith('<span>不能预览</span>');
                        return;
                    }
                    $img.attr('src', src);
                }, 210, 137);
                $elem.find('.kv-file-remove').bind('click', function (e) {
                    var filename = $(this).parents('.gallery-file-preview-frame').data('path');
                    if (filename) {
                        ResourceService.getFunServer('delimg', {fileName: filename});
                    }
                    uploader.removeFile (file.id);
                    $(e.target).parents('.gallery-file-preview-frame').remove();
                    var length = $elem.find('.gallery-file-preview-frame').length;
                    if (length == 0) {
                        $elem.find('.file-drop-zone-title').show();
                    }
                });
                //重新上传
                $elem.find('.kv-file-upload').bind('click', function () {
                    uploader.retry(file);
                });
                //分组
                $li.on('click','input[type=radio]',function(e){
                    var flag=$(this).val();
                    var $elem=$(this).parents('.gallery-file-preview-frame').clone(true);
                    var $parent=null;
                    var length=$(this).parents('.file-preview-thumbnails').find('.gallery-file-preview-frame').length;
                    switch (flag){
                        case '0':
                            $parent=$('#carpictures');
                            break;
                        case '1':
                            $parent=$('#procedure');
                            break;
                        case '2':
                            $parent=$('#abnormal');
                            break;
                        case '3':
                            $parent=$('#proof');
                            break;
                    }
                    $parent.find('.gridly').append($elem) ;
                    $parent.find('.file-drop-zone-title').hide();
                    $p=$(this).parents('.gallery-file-preview-frame').parent().prev('.file-drop-zone-title');
                    $(this).parents('.gallery-file-preview-frame').remove();
                    if (length ==1) {
                        $p.show();
                    }
                    uploader.removeFile (file.id);

                });
            });
            // 文件上传过程中创建进度条实时显示。
            uploader.on('uploadProgress', function (file, percentage) {
                $('#' + file.id).find('.up-text').text(parseInt(percentage*100) +'%');
            });
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on('uploadSuccess', function (file, data) {
                $('#' + file.id).find('.file-preview-image').attr('src',data.data);
                $('#' + file.id).attr('data-path', data.data);
                $('#' + file.id).find('.up-text').text('上传成功');
            });
            // 文件上传失败，显示上传出错。
            uploader.on('uploadError', function (file) {
                $('#' + file.id).find('.img-loading').find('img').remove();
                $('#' + file.id).find('.img-loading').removeClass('text-orange').addClass('text-danger');
                $('#' + file.id).find('.up-text').text('上传失败，请重试');
            });

            // 完成上传完了，成功或者失败
            uploader.on('uploadComplete', function (file) {

            });
            $start.bind('click',function(){
                uploader.upload();
            })



        }
    }
}]).directive('carColor', function () {
    //车辆颜色
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, element, attr) {
            var elem = $(element).find('span');
            elem.bind('click', function () {
                scope.Color = $(this).attr('data-value');
                $(this).addClass('active').siblings().removeClass('active');
            })
        }
    }
}).directive('banklist', function () {
    //银行列表
    return {
        restrict: 'AE',
        replace: false,
        templateUrl: './statics/banklist.html',
        link: function (scope, element, attr) {
            var elem = $(element).find('.pl-item');
            elem.bind('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                scope.bank = $(this).data('bank');
            })
        }
    }
}).directive('toolTip', function () {
    //提示工具
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, element, attr) {
            var option = {
                title: attr.title,
                placement: attr.tooltipPlacement,
                delay: {show: 500, hide: 500}
            }
            $(element).tooltip(option);
        }
    }
}).directive('tuiDiscout', function () {
    return {
        restrict: 'EA',
        link: function (scope, elem, attrs) {
            var element = elem[0];
            elem.find("input[type=checkbox]").bind('click', function () {
                var checked = $("input[name=discount]");
                var arr = [];
                var val = 0;
                var total=scope.order.PayTotal;
                angular.forEach(checked, function (obj, index) {
                    if (obj.checked) {
                        arr.push(obj.id);
                        val += parseFloat(obj.value);
                    }
                });
                if (val > scope.serviceFees) {
                    $("#Msg").text('您抵用券的总金额(￥' + val + ')已超过可抵服务费(￥' + scope.serviceFees + ')的金额');
                    val = scope.serviceFees;
                }
                else {
                    $("#Msg").text('');
                }
                $("#discountCount").text("￥" + val);
                $(".needpay").text("￥" + parseFloat(total - val));
                //scope.order.PayTotal = parseFloat(total - val);
                scope.$parent.discount = arr;
            })
        },
        replace: false,
        templateUrl: ''
    }
}).directive('evaluate', ['$rootScope', function ($rootScope) {
    //评价
    return {
        restrict: 'EA',
        replace: false,
        template: '<div class="pj-container"><span class="pj-star-icon active" val="1" >星星</span>' +
        '<span class="pj-star-icon" val="2">星星</span>' +
        '<span class="pj-star-icon" val="3">星星</span>' +
        '<span class="pj-star-icon" val="4">星星</span>' +
        '<span class="pj-star-icon" val="5">星星</span></div>',
        link: function (scope, element, attr) {
            var elem = $(element[0]).find('.pj-star-icon')
            elem.bind('click', function () {
                var val = $(this).attr('val')
                var arr = $(this).parent('.pj-container').find('.pj-star-icon');
                var name = $(this).parent('.pj-container').parent('div').attr('data-name');
                scope[name] = val;
                arr.each(function (index, obj) {
                    var i = $(obj).attr('val');
                    if (i < val || i == val) {
                        $(this).addClass('active')
                    }
                    else {
                        $(this).removeClass('active')
                    }
                })
            })
        }
    }
}]).directive('autoComplete', ['$http',function ($http) {
    return {
        restict: 'A',
        replace: false,
        link: function (scope, element, attr) {
            var $down=$(element).find('.dropdown-toggle');
            var $downbox=$(element).find('.dropdown-menu');
            var $ipt=$(element).find('#search');
            var $searchbtn=$(element).find('.searchbtn');
            $ipt.AutoComplete({
                'width': "auto",
                'itemHeight': 30,
                'listStyle': 'custom',
                'data': "./data/brandlist-search.json",//Common/Carbrand/SearchBrand
                'ajaxDataType': 'json',
                'async': true,
                'matchHandler': function (keyword, data) {
                    if (data.SeriesName) {
                      return data.SeriesName.indexOf(keyword) > -1||data.PY.indexOf(keyword.toUpperCase()) > -1
                    }
                    else if (data.BrandName) {
                       return data.BrandName.indexOf(keyword) > -1||data.PY.indexOf(keyword.toUpperCase()) > -1
                    }
                    // 匹配规则: 以输入框中的值开头且大小写敏感
                },
                'beforeLoadDataHandler': function (keyword) {
                    return setTimeout(function () {
                        return true;
                    }, 350)
                },
                'createItemHandler': function (index, data) {
                    if (data.SeriesName) {
                        return "<span  style='display: block;line-height: 30px;padding-left: 15px'>" + data.SeriesName + "</span>";
                    }
                    else if (data.BrandName) {
                        return "<span  style='display: block;line-height: 30px;padding-left: 15px'>" + data.BrandName + "</span>";
                    }
                    // 文本显示为绿色，并在前后使用'--'包裹
                },
                'emphasisHandler': function (keyword, data) {

                    // var regex = RegExp("(" + keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", 'ig');
                    // data.brandName = data.brandName.replace(regex, "<span style='font-weight:bold;color:blue;'>$1</span>");
                },
                'afterSelectedHandler': function (data) {
                    if (data.SeriesName) {
                        if (window.location.href.indexOf('peer.html') > -1) {
                            window.location.href = 'peer.html?' + 'Brand=' + data.BrandID + '&BrandName=' + data.BrandName + '&Series=' + data.SeriesID;
                        }
                        else {
                            window.location.href = 'buy.html?' + 'Brand=' + data.BrandID + '&BrandName=' + data.BrandName+ '&Series=' + data.SeriesID;
                        }
                    }
                    else if (data.BrandName) {
                        if (window.location.href.indexOf('peer.html') > -1) {
                            window.location.href = 'peer.html?' + 'Brand=' + data.BrandID+ '&BrandName=' + data.BrandName;
                        }
                        else {
                            window.location.href = 'buy.html?' + 'Brand=' + data.BrandID+ '&BrandName=' + data.BrandName ;
                        }
                    }




                }
            });
            $downbox.on('click','a',function(){
                $down.find('.txt').text($(this).text())
                var tag=parseInt($(this).data('tag'));
                $down.attr('data-tag',tag);
                if(tag==1){
                    $ipt.attr('placeholder','请输入店铺名称搜索');
                    $ipt.AutoComplete({
                        'width': "auto",
                        'itemHeight': 30,
                        'listStyle': 'custom',
                        'data': "/alliance/alliance/GetAllianceByKeyword",
                        'ajaxDataType': 'json',
                        'async': true,
                        'matchHandler': function (keyword, data) {
                            return data.CompanyName&&data.CompanyName.indexOf(keyword) > -1;  // 匹配规则: 以输入框中的值开头且大小写敏感
                        },
                        'beforeLoadDataHandler': function (keyword) {
                            return setTimeout(function () {
                                return true;
                            }, 350)
                        },
                        'createItemHandler': function (index, data) {
                            return "<span  style='display: block;line-height: 30px;padding-left: 15px'>" + data.CompanyName + "</span>"; // 文本显示为绿色，并在前后使用'--'包裹
                        },
                        'emphasisHandler': function (keyword, data) {
                            // var regex = RegExp("(" + keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", 'ig');
                            // data.brandName = data.brandName.replace(regex, "<span style='font-weight:bold;color:blue;'>$1</span>");
                        },
                        'afterSelectedHandler': function (data) {
                            window.location.href = 'shop.html?' + 'AllianceCode=' + data.AllianceCode ;

                        }
                    });
                }
                else if(tag==0){
                    $ipt.attr('placeholder','输入品牌、车系、车源号');
                    $ipt.AutoComplete({
                        'width': "auto",
                        'itemHeight': 30,
                        'listStyle': 'custom',
                        'data': "./data/brandlist-search.json",//Common/Carbrand/SearchBrand
                        'ajaxDataType': 'json',
                        'async': true,
                        'matchHandler': function (keyword, data) {
                            if (data.SeriesName) {
                                return data.SeriesName.indexOf(keyword) > -1||data.PY.indexOf(keyword.toUpperCase()) > -1
                            }
                            else if (data.BrandName) {
                                return data.BrandName.indexOf(keyword) > -1||data.PY.indexOf(keyword.toUpperCase()) > -1
                            }
                            // 匹配规则: 以输入框中的值开头且大小写敏感
                        },
                        'beforeLoadDataHandler': function (keyword) {
                            return setTimeout(function () {
                                return true;
                            }, 350)
                        },
                        'createItemHandler': function (index, data) {
                            if (data.SeriesName) {
                                return "<span  style='display: block;line-height: 30px;padding-left: 15px'>" + data.SeriesName + "</span>";
                            }
                            else if (data.BrandName) {
                                return "<span  style='display: block;line-height: 30px;padding-left: 15px'>" + data.BrandName + "</span>";
                            }
                            // 文本显示为绿色，并在前后使用'--'包裹
                        },
                        'emphasisHandler': function (keyword, data) {

                            // var regex = RegExp("(" + keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", 'ig');
                            // data.brandName = data.brandName.replace(regex, "<span style='font-weight:bold;color:blue;'>$1</span>");
                        },
                        'afterSelectedHandler': function (data) {
                            if (data.SeriesName) {
                                if (window.location.href.indexOf('peer.html') > -1) {
                                    window.location.href = 'peer.html?' + 'Brand=' + data.BrandID + '&BrandName=' + data.BrandName + '&Series=' + data.SeriesID;
                                }
                                else {
                                    window.location.href = 'buy.html?' + 'Brand=' + data.BrandID + '&Series=' + data.SeriesID;
                                }
                            }
                            else if (data.BrandName) {
                                if (window.location.href.indexOf('peer.html') > -1) {
                                    window.location.href = 'peer.html?' + 'Brand=' + data.BrandID;
                                }
                                else {
                                    window.location.href = 'buy.html?' + 'Brand=' + data.BrandID;
                                }
                            }




                        }
                    });
                }
            });
            $searchbtn.on('click',function(e){
                var tag=parseInt($down.data('tag'));
                if(!scope.code){
                    return;
                }
                if(tag==1){
                    $http.post('/alliance/alliance/GetAllianceByKeyword',{keyword:scope.code}).success(function(data){
                        if(data&&data instanceof Array&&data.length>0){
                            window.location.href = 'shop.html?' + 'AllianceCode=' + data[0].AllianceCode ;
                        }else{
                            window.location.href = 'result.html?' + 'keyword=' + scope.code ;
                        }
                    }).error(function(data){
                        console.log(data)
                    })
                }else{
                    scope.code=scope.code.replace(/\s*/g, "");
                    if(!isNaN(scope.code)&&scope.code.length==13){
                        if( window.location.href.indexOf('peer.html')>-1){
                            window.location.href='peer.html?CarNo='+scope.code;
                        }else{
                            window.location.href='buy.html?CarNo='+scope.code;
                        }
                    }
                    else{
                        $http.get('./data/brandlist-search.json').success(function(data){
                            var  href= 'result.html?' + 'keyword=' + scope.code ;
                            angular.forEach(data,function(obj,index){
                                if(obj.SeriesName&&obj.SeriesName==scope.code){
                                    if( window.location.href.indexOf('peer.html')>-1){
                                        href = 'peer.html?'+ 'Brand=' + obj.BrandID + '&BrandName=' + obj.BrandName+'&Series='+obj.SeriesID;
                                    }else{
                                        href = 'buy.html?'+ 'Brand=' + obj.BrandID + '&BrandName=' + obj.BrandName+'&Series='+obj.SeriesID;
                                    }
                                    return ;
                                }
                                if(obj.BrandName&&obj.BrandName==scope.code){
                                    if( window.location.href.indexOf('peer.html')>-1){
                                        href = 'peer.html?'+ 'Brand=' + obj.BrandID + '&BrandName=' + obj.BrandName;
                                    }else{
                                        href = 'buy.html?'+ 'Brand=' + obj.BrandID + '&BrandName=' + obj.BrandName;
                                    }
                                    return ;
                                }
                            })
                            window.location.href =href
                        });
                    }
                }
            });
            $(element).on('keypress',$ipt,function(e){

                var keyCode=window.event? e.keyCode: e.which;
                if(keyCode==13){
                    $searchbtn.trigger('click')
                }
            })
        }
    }
}]).directive('brandlist', function () {
    //品牌列表
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = $(element);
            elem.hover(function () {
                $(this).addClass('active');
                $('#Allbrand').addClass('active')
            }, function () {
                $(this).removeClass('active');
                $('#Allbrand').removeClass('active')
            })
        }
    }
}).directive('carType', function () {
    //首页车源类型
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = $(element).find('a');
            elem.on('mouseover', function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    }
}).directive('filterSelected', function ($rootScope) {
    //买车筛选
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = $(element);
            elem.on('click', 'a', function () {
                $('#PriceStart').val('');
                $('#PriceEnd').val('');
                $(this).addClass('active').siblings().removeClass('active');
                var active = angular.element('.filter-content').find('a.active');
                var qs = QueryString();
                var href = '?q=0';
                delete qs.PriceStart;
                delete qs.PriceEnd;
                angular.forEach(active, function (obj, index) {
                    var name = $(obj).data('name')&&$(obj).data('name').replace(/(^\s*)|(\s*$)/g, "");
                    var val = $(obj).data('value');
                    if (val == 0) {
                        delete  qs[name]
                    }
                    else {
                        qs[name] = val;
                    }
                });
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });
            elem.on('click', '.js-btn', function () {

                var qs = QueryString();
                var href = '?q=0';
                var start=parseInt($('#PriceStart').val()) ;
                var end=parseInt($('#PriceEnd').val());
                if(isNaN(start))
                {
                    return false;
                }
                if(!isNaN(start)&&isNaN(end))
                {
                    end=999;
                }
                if(end<start){
                    start=[end,end=start][0];
                    $('#PriceEnd').val(end);
                    $('#PriceStart').val(start);
                }
                delete qs.PriceID;
                $(this).parents('dd').find('a').removeClass('active');
                var active = angular.element('.filter-content').find('a.active');
                qs.PriceStart=start;
                qs.PriceEnd=end;
                angular.forEach(active, function (obj, index) {
                    var name = $(obj).data('name')&&$(obj).data('name').replace(/(^\s*)|(\s*$)/g, "");
                    var val = $(obj).data('value');
                    if (val == 0) {
                        delete  qs[name]
                    }
                    else {
                        qs[name] = val;
                    }
                });
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
               window.location.href = window.location.href.replace(location.search, '') + href;
            });
            elem.on('keypress','input',function(e){
                var keyCode=window.event? e.keyCode: e.which;
                if(keyCode==13){
                    $(".js-btn").trigger('click');
                }
            })
        }
    }
}).directive('filterMore', function () {
    //更多
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var btn = $(element).find('.moreitem-btn');
            var box = $(element).find('.moreitem-box');
            var a = box.find('a');
            var label = $(element).find('.checkbox-inline');
            angular.forEach(a, function (obj, index) {
                var name = $(obj).data('name').replace(/(^\s*)|(\s*$)/g, "");
                var val = $(obj).data('value');
                if (scope.filter[name] == val) {
                    btn.find('a').text($(obj).text()).addClass('text-orange');
                    ;
                }
            });
            btn.hover(function () {
                $(element).addClass('active').siblings().removeClass('active');
                box.addClass('active').siblings().removeClass('active');
            }, function () {
                $(element).removeClass('active');
                box.removeClass('active');
            });
            box.hover(function () {
                $(element).addClass('active').siblings().removeClass('active');
                box.addClass('active').siblings().removeClass('active');
            }, function () {
                $(element).removeClass('active');
                box.removeClass('active');
            });
            a.bind('click', function () {
                btn.find('a').text($(this).text());
                $(this).addClass('active').siblings().removeClass('active');
                if ($(this).text() != '不限') {
                    btn.find('a').addClass('text-orange');
                } else {
                    btn.find('a').removeClass('text-orange');
                }
                var active = angular.element('.filter-content').find('a.active');
                var qs = QueryString();
                var href = '?q=0';
                angular.forEach(active, function (obj, index) {
                    var name = $(obj).data('name').replace(/(^\s*)|(\s*$)/g, "");
                    var val = $(obj).data('value');
                    if (val == 0) {
                        delete  qs[name]
                    }
                    else {
                        qs[name] = val;
                    }
                });
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });
            label.bind('click', function () {
                var qs = QueryString();
                var href = '?q=0';
                var input = $(this).find('input');
                angular.forEach(input, function (obj, index) {
                    var name = $(obj).data('name').replace(/(^\s*)|(\s*$)/g, "");
                    var val = $(obj).data('value');
                    if (obj.checked) {
                        qs[name] = val;
                    }
                    else {
                        delete qs[name]
                    }
                });
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });

        }
    }
}).directive('allbrand', function () {
    //全部品牌
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var btn = $(element).find('.show');
            var box = $(element).find('.otherbrand');
            var a = box.find('a');
            $(element).hover(function () {
                box.addClass('active');
            }, function () {
                box.removeClass('active');
            });

        }
    }
}).directive('filterbrand', function () {
    //选择品牌
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = $(element).find('a');
            elem.on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var qs = QueryString();
                var href = '?q=0';
                var name = $(this).data('name').replace(/(^\s*)|(\s*$)/g, "");
                var val =parseInt($(this).data('value'));
                delete  qs.Series;
                if (val == 0) {
                    delete  qs[name];
                    delete qs.BrandName;
                }
                else {
                    qs.BrandName = $(this).text();
                    qs[name] = val;
                }
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });
        }
    }
}).directive('filterseries', function () {
    //选择车系
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', 'a', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var qs = QueryString();
                var href = '?q=0';
                var name = $(this).data('name').replace(/(^\s*)|(\s*$)/g, "");
                var val = parseInt($(this).data('value')) ;
                if (val == 0) {
                    delete  qs[name];
                }
                else {
                    qs.BrandName = $(this).data('brandname');
                    qs.Brand = $(this).data('brand');
                    qs[name] = val;
                }
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });

        }
    }
}).directive('morebrand', function () {
    //全部品牌
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var statics = $(element).find('a.statics-brand');
            var i = 0;
            angular.forEach(statics, function (obj, index) {
                var value = $(obj).data('value');
                if (value == scope.filter.Brand || scope.filter.Brand == null) {
                    i += 1
                }
            });
            if (i == 0) {
                $a = $('<a data-name="Brand" data-value="' + scope.filter.Brand + '"   class="statics-brand active">' + scope.filter.BrandName + '</a>');
                $('#morebrand').before($a);

            }
        }
    }
}).directive('filtersort', function () {
    //排序
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', 'li', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var qs = QueryString();
                var href = '?q=0';
                var val = parseInt($(this).data('value'));
                var sort = parseInt(qs['Sort']);
                if(isNaN(val)){
                    delete qs.Sort;
                }
                else{
                    if (isNaN(sort)) {
                        if (!isNaN(val)) {
                            qs['Sort'] = val;
                        } else {
                            delete  qs['Sort']
                        }
                    } else {
                        if (sort > 0) {
                            qs['Sort'] = -val;
                        } else {
                            qs['Sort'] = val;
                        }
                    }
                }


                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });

        }
    }
}).directive('filter', function () {
    //全部查询条件
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var QS = QueryString();
            var href = '?q=0';
            if (QS.CarNo) {
                var carno=QS.CarNo;
                var a = '<a href="javascript:void(0)"  class="filter-a" data-name="CarNo">' + QS.CarNo + '</a>'
                $('.filter-reset').before(a);
                $('.filter-reset').show();
                QS=null;
                QS={CarNo:carno}

            }
            setTimeout(function () {
                var elem = $(element[0]).find('a.active');
                angular.forEach(elem, function (obj, index) {
                    if ($(obj).text() !== '不限') {
                        var a = '<a href="javascript:void(0)"  class="filter-a" data-name="' + $(obj).data('name') + '">' + $(obj).text() + '</a>';
                        var span='<span>'+ $(obj).text()+'</span>';
                        $('.filter-reset').before(a);
                        $('.filter-reset').show();
                    }
                });
                $('.filter-a').on('click', function () {
                    var name = $(this).data('name');
                    if (name == 'Brand') {
                        delete  QS['BrandName'];
                        delete  QS['Series'];
                    }
                    delete  QS[name];

                    for (var obj in QS) {
                        if (obj != 'q') {
                            href += '&' + obj + '=' + QS[obj];
                        }
                    }
                    window.location.href = window.location.href.replace(location.search, '') + href;
                })
            }, 50)
        }
    }
}).directive('changeCity', ['$rootScope', 'CookieService', function ($rootScope, CookieService) {
    //更改城市车源
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var btn = $(element).find('.choose-city');
            var box = $(element).find('.city-box');
            var footcity=$('.our-office');
            btn.hover(function () {
                $(element).addClass('active');
                box.addClass('active');
            }, function () {
                $(element).removeClass('active');
                box.removeClass('active');
            });
            box.hover(function () {
                $(element).addClass('active');
                box.addClass('active');
            }, function () {
                $(element).removeClass('active');
                box.removeClass('active');
            });
            box.on('click', 'a', function () {
                $(this).addClass('active').siblings().removeClass('active');
                CookieService.SetCityCookie({CityName: $(this).data('city'), CityID: $(this).data('value')});
                var active = angular.element('.filter-content').find('a.active');
                var qs = QueryString();
                var href = '?q=0';
                angular.forEach(active, function (obj, index) {
                    var name = $(obj).data('name');
                    var val = $(obj).data('value');
                    if (val == 0) {
                        delete  qs[name]
                    }
                    else {
                        qs[name] = val;
                    }
                });
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });
            footcity.on('click', 'a', function () {
                $(this).addClass('active').siblings().removeClass('active');
                CookieService.SetCityCookie({CityName: $(this).data('city'), CityID: $(this).data('value')});
                var active = angular.element('.filter-content').find('a.active');
                var qs = QueryString();
                var href = '?q=0';
                angular.forEach(active, function (obj, index) {
                    var name = $(obj).data('name');
                    var val = $(obj).data('value');
                    if (val == 0) {
                        delete  qs[name]
                    }
                    else {
                        qs[name] = val;
                    }
                });
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });
        }
    }


}]).directive('changeCity2', ['$rootScope', 'CookieService', function ($rootScope, CookieService) {
    //更改城市车源
    return {
        restrict: 'AE',
        replace: false,
        controller:['$scope','$http',function($scope,$http){

            $http.get('/direct/GetHomeProvinceList').success(function(data){
                    $scope.chain=data;
            })
        }],
        templateUrl:'./statics/city2.html',
        link: function (scope, element, attr) {
            var $btn = $(element).find('#current_city_id');
            var $box = $(element).find('#cityWrap');
            var $target=$(element).find('.pro-letter');
            var $ipt=$(element).find('#topSearch');
            $ipt.AutoComplete({
                'width': "auto",
                'itemHeight': 30,
                'listStyle': 'custom',
                'data': "./data/city.json",///direct/SearchDirectCity
                'ajaxDataType': 'json',
                'async': true,
                'matchHandler': function (keyword, data) {
                    return data.name&&data.name.indexOf(keyword) > -1||data.py&&data.py.indexOf(keyword.toUpperCase()) > -1;  // 匹配规则: 以输入框中的值开头且大小写敏感
                },
                'beforeLoadDataHandler': function (keyword) {
                    return setTimeout(function () {
                        return true;
                    }, 350)
                },
                'createItemHandler': function (index, data) {
                    return "<span  style='display: block;line-height: 30px;padding-left: 15px'>" + data.name + "</span>";
                },
                'emphasisHandler': function (keyword, data) {

                    // var regex = RegExp("(" + keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", 'ig');
                    // data.brandName = data.brandName.replace(regex, "<span style='font-weight:bold;color:blue;'>$1</span>");
                },
                'afterSelectedHandler': function (data) {
                    CookieService.SetCityCookie({CityName: data.name, CityID: data.id});
                    window.location.reload();
                }
            });
            $btn.bind('click',function(){
                 $(this).toggleClass('active');
                 $box.slideToggle();
            });
            $target.on('click','em',function(){
                var title=$(this).attr('title');
                var top =$('#'+title).offset().top-100;
                $box.animate({scrollTop:top},1000);
            });

            $("body").on("click",function(e){
                   if($(e.target).closest('#citybox').length==0){
                       $btn.removeClass('active');
                       $box.slideUp();
                   }
            });
            $box.on('click', '.searc-for', function () {
                $(this).addClass('active').siblings().removeClass('active');
                CookieService.SetCityCookie({CityName: $(this).data('city'), CityID: $(this).data('value')});
                window.location.reload();
            });
        }
    }


}]).directive('paybanklist', ['PayService', '$rootScope', function (PayService, $rootScope) {
    return {
        restrict: 'EA',
        transclude: true,
        link: function (scope, elem, attrs) {
            var obj = {
                orderCode: null,
                bank_code: null,
                pay_type: null
            };
            $(document).on("click", ".payment-list li", function () {
                var bank = $(this).data('name');
                $(this).addClass('active').siblings().removeClass('active');
                var typedata = $(this).attr("type-data");
                scope.$apply(function () {
                    scope.bank = bank;
                    scope.selectedbank = scope.banklistdata[typedata];
                });
                obj = {
                    orderCode: scope.ordernum || null,
                    bank_code: scope.banklistdata[typedata].bankcode || null,
                    pay_type: null
                };
                $('input[name=bankcode]').val(scope.banklistdata[typedata].bankcode);
                $('input[name=banktype]').val('');

            });

            $('.payment_change').on("click", "a", function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('input[name=banktype]').val($(this).data("value"));
                scope.pay();

            });
        },
        templateUrl: './statics/paylist.html',
        replace: false
    }
}]).directive('profess', function () {
    return {
        restrict: 'A',
        template: '',
        replace: false,
        link: function (scope, elem, attrs) {
            var elem = $(elem);
            elem.on('click', '.o-b-list a', function (e) {
                $(this).toggleClass('active');
                var id = $(this).data('value').toString().replace(/(^\s*)|(\s*$)/g, "");
                if ($(this).attr('class') == 'active') {
                    var p = '<a id="' + id + '">' + $(this).text() + '</a>';
                    elem.find('#selectBrand').append(p)
                }
                else {
                    elem.find('#' + id).remove()
                }
            })
        }
    }

}).directive('filterpeer', function () {
    //同行
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', 'li', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var qs = QueryString();
                var href = '?q=0';
                var val = parseInt($(this).data('value'));
                var name = $(this).data('name');
                qs[name] = val;
                for (var obj in qs) {
                    if (obj != 'q') {
                        href += '&' + obj + '=' + qs[obj];
                    }
                }
                window.location.href = window.location.href.replace(location.search, '') + href;
            });
        }
    }
}).directive('detect', ['$rootScope', function ($rootScope) {

    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', 'i', function () {
                var value = parseInt($(this).attr('value'), 10);
                var id = $(this).attr('id');
                var _this = $(this);
                switch (value) {
                    case 1:
                        $(this).removeClass('glyphicon-exclamation-sign').addClass('glyphicon-ok-sign');
                        $(this).attr('value', 2);
                        $('.detect-accident-' + id).removeClass('active');
                        break;
                    case 2:
                        $(this).removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign');
                        $(this).attr('value', 1);
                        $('.detect-accident-' + id).addClass('active');
                        break;
                }
            });
        }
    }
}]).directive('detectMultp', ['$rootScope', function ($rootScope) {

    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', 'i', function () {
                var value = parseInt($(this).attr('value'), 10);
                var id = $(this).attr('id');
                var _this = $(this);
                switch (value) {
                    case 1:
                        $(this).removeClass('glyphicon-exclamation-sign glyphicon-ok-sign').text('无');
                        $(this).attr('value', 0);
                        break;
                    case 2:
                        $(this).removeClass('glyphicon-ok-sign').addClass('glyphicon-exclamation-sign ');
                        $(this).attr('value', 1);
                        break;
                    case 0:
                        $(this).addClass('glyphicon-ok-sign').text('');
                        $(this).attr('value', 2);
                        break;
                }
            });
        }
    }
}]).directive('detectRepair', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', '.repair.carAIbg', function (e) {
                var _this = $(this);
                var value = parseInt($(this).attr('value'), 10);
                var id = $(this).attr('id');
                var blue = 'carAIblue_' + id;
                var gh = 'carAIGH_' + id;
                var sc = 'carAISC_' + id;
                switch (value) {
                    case 0:
                        _this.addClass(blue).removeClass(gh);
                        _this.attr('value', 1);
                        break;
                    case 1:
                        _this.addClass(gh).removeClass(blue);
                        _this.attr('value', 2);
                        break;
                    case 2:
                        _this.removeClass(blue).removeClass(gh).addClass(sc);
                        _this.attr('value', 3);
                        break;
                    case 3:
                        _this.removeClass(blue).removeClass(gh).removeClass(sc);
                        _this.attr('value', 0);
                        break;
                }
            });
            $(elem).on('click', '.repair.carNSbg', function (e) {
                var _this = $(this);
                var value = parseInt($(this).attr('value'), 10);
                var id = $(this).attr('id');
                var blue = 'carAIblue_' + id;
                var gh = 'carAIGH_' + id;
                switch (value) {
                    case 0:
                        _this.addClass(blue).removeClass(gh);
                        _this.attr('value', 1);
                        break;
                    case 1:
                        _this.addClass(gh).removeClass(blue);
                        _this.attr('value', 2);
                        break;
                    case 2:
                        _this.removeClass(blue).removeClass(gh);
                        _this.attr('value', 0);
                        break;

                }
            });
            $(elem).on('click', '.guaca', function (e) {
                var dot = $('<i class="e_guacha"></i>');
                var left = parseInt($(this).css('left'));
                var top = parseInt($(this).css('top'));
                $('.e_main').append(dot);
                dot.css({'left': e.offsetX + left - 55, 'top': e.offsetY + top - 35});
                dot.attr({'data-X': e.offsetX + left - 55, 'data-Y': e.offsetY + top - 35});
            });
            $(elem).on('click', '.pengzhuang', function (e) {
                var dot = $('<i class="e_pengzhuang"></i>');
                var left = parseInt($(this).css('left'));
                var top = parseInt($(this).css('top'));
                $('.e_main').append(dot);
                dot.css({'left': e.offsetX + left - 55, 'top': e.offsetY + top - 35});
                dot.attr({'data-X': e.offsetX + left - 55, 'data-Y': e.offsetY + top - 35});
            })
        }
    }
}]).directive('guaca', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', function (e) {
                $('.e_main').css('z-index', '');
                $(this).addClass('active').siblings().removeClass('active');
                $('.carAIbg').addClass('guaca').removeClass('repair pengzhuang');
            });
        }
    }
}]).directive('peng', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', function (e) {
                $('.e_main').css('z-index', '');
                $(this).addClass('active').siblings().removeClass('active');
                $('.carAIbg').addClass('pengzhuang').removeClass('repair guaca');
            });
        }
    }
}]).directive('repair', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', function (e) {
                $('.e_main').css('z-index', '');
                $(this).addClass('active').siblings().removeClass('active');
                $('.carAIbg').addClass('repair').removeClass('guaca pengzhuang');
                $('.carNSbg').addClass('repair').removeClass('guaca pengzhuang');
            });
        }
    }
}]).directive('removeGuaca', function () {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', function (e) {
                $(this).addClass('active').siblings().removeClass('active');
                $('.carAIbg').removeClass('guaca pengzhuang');
                $('.e_main').css('z-index', '31');
            });
        }
    }
}).directive('eRemove', function () {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var elem = element[0];
            $(elem).on('click', 'i', function (e) {
                $(this).remove();
            });
        }
    }
}).directive('navFix', function () {
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            $(element).on('click','li',function(){
                var id=$(this).find('a').attr('href');
                var top=$(id)[0].offsetTop-10;
                $('body').animate({scrollTop:top},1500)
            });

        }
    }
}).directive('viewReport', function () {
    return {
        restrict: 'AE',
        replace: false,
        templateUrl:'./admin/view-report.html',
        controller:function(){



        }
    }
}).directive('unknowSpec', function () {
    return {
        restrict: 'AE',
        replace: false,
       link:function(scope, element, attr){
            var $elem=$(element);
           $elem.on('change','#nospac',function(){
               if(this.checked){
                   var reg=new RegExp("[\\u4E00-\\u9FFF]+","g");
                   var index=scope.spec.SpecName.lastIndexOf(' ');
                   var sub=scope.spec.SpecName.substr(index+1);
                   if(reg.test(sub)){
                       $('#spacname').text(scope.spec.SpecName.substring(0,index));
                       scope.SpecName=scope.spec.SpecName.substring(0,index);
                   }
               }
               else{
                   $('#spacname').text(scope.spec.SpecName);
                   scope.SpecName=scope.spec.SpecName;
               }
           })

       }
    }
}).directive('detectSelect', function () {
    //检测报告设备类型
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
            var btn = $(element).find('.moreitem-btn');
            var box = $(element).find('.moreitem-box');
            var a = box.find('a');
            btn.hover(function () {
                $(element).addClass('active').siblings().removeClass('active');
                box.addClass('active').siblings().removeClass('active');
            }, function () {
                $(element).removeClass('active');
                box.removeClass('active');
            });
            box.hover(function () {
                $(element).addClass('active').siblings().removeClass('active');
                box.addClass('active').siblings().removeClass('active');
            }, function () {
                $(element).removeClass('active');
                box.removeClass('active');
            });
            a.bind('click', function () {
                var name = $(this).data('name');
                var val =parseInt($(this).data('value')) ;
                btn.find('a').attr('data-value',val).text($(this).text());
                $(this).addClass('active').siblings().removeClass('active');
                if(val==0){
                    $('#'+name).show();
                }
                else if(val==-1){
                    $('#'+name).hide();
                }
                btn.removeClass('active');
                box.removeClass('active');
            });


        }
    }
}).directive('detectSecond',function(){
    return {
        restrict: 'AE',
        replace: false,
        link: function (scope, element, attr) {
          var elem=$(element[0]);
          elem.on('click',function(){
              $('.item-title-tab').find('li').eq(1).addClass('active').siblings().removeClass('active');
              $('#detection').addClass('active in');
              $('#car').removeClass('active in');
              window.scrollTo(0,0);
          })
        }
    }

}).directive('webUploader',['ResourceService',function(ResourceService){
    return{
        restrict: 'A',
        template:'<div class="up-wrapper"><div class="up-container"><div class="uploader"><div class="queueList"><div  class="placeholder">'+
                    '</div></div><div class="statusBar"><div class="progress"><span class="text">0%</span><span class="percentage"></span>'+
                    '</div><div class="info"></div><div class="btns"><div class="pick-btn input-group-btn"> <div class="btn btn-primary btn-file"><i class="glyphicon glyphicon-folder-open"></i> &nbsp;选择 …<div class="filePicker"></div></div></div><div class="btn btn-info btn-file uploader-btn uploadBtn"> <i class="glyphicon glyphicon-upload"></i> &nbsp;上传 …</div></div></div></div></div></div>',
        link:function(scope,element,attr){

        },
        compile:function(element,attr) {
            var $wrap =$(element).find('.uploader'),

            // 图片容器
                $queue = $('<ul class="filelist"></ul>')
                    .appendTo($wrap.find('.queueList')),

            // 状态栏，包括进度和控制按钮
                $statusBar = $wrap.find('.statusBar'),

            // 文件总体选择信息。
                $info = $statusBar.find('.info'),

            // 上传按钮
                $upload = $wrap.find('.uploadBtn'),

            // 没选择文件之前的内容。
                $placeHolder = $wrap.find('.placeholder'),
                $progress = $statusBar.find('.progress').hide(),

            // 添加的文件数量
                fileCount = 0,

            // 添加的文件总大小
                fileSize = 0,

            // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1,

            // 缩略图大小
                thumbnailWidth = 110 * ratio,
                thumbnailHeight = 110 * ratio,

            // 可能有pedding, ready, uploading, confirm, done.
                state = 'pedding',

            // 所有文件的进度信息，key为file id
                percentages = {},
            // 判断浏览器是否支持图片的base64
                isSupportBase64 = (function () {
                    var data = new Image();
                    var support = true;
                    data.onload = data.onerror = function () {
                        if (this.width != 1 || this.height != 1) {
                            support = false;
                        }
                    }
                    data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                    return support;
                })(),

            // 检测是否已经安装flash，检测flash的版本
                flashVersion = (function () {
                    var version;

                    try {
                        version = navigator.plugins['Shockwave Flash'];
                        version = version.description;
                    } catch (ex) {
                        try {
                            version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                                .GetVariable('$version');
                        } catch (ex2) {
                            version = '0.0';
                        }
                    }
                    version = version.match(/\d+/g);
                    return parseFloat(version[0] + '.' + version[1], 10);
                })(),

                supportTransition = (function () {
                    var s = document.createElement('p').style,
                        r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                    s = null;
                    return r;
                })(),

            // WebUploader实例
                uploader;
            //拖拽
            $wrap.find(".filelist").dragsort({
                dragSelector: "img",
                dragEnd: function() { },
                dragBetween: false,
                placeHolderTemplate: "<li></li>"
            });
            if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {

                // flash 安装了但是版本过低。
                if (flashVersion) {
                    (function (container) {
                        window['expressinstallcallback'] = function (state) {
                            switch (state) {
                                case 'Download.Cancelled':
                                    alert('您取消了更新！')
                                    break;

                                case 'Download.Failed':
                                    alert('安装失败')
                                    break;

                                default:
                                    alert('安装已成功，请刷新！');
                                    break;
                            }
                            delete window['expressinstallcallback'];
                        };

                        var swf = './expressInstall.swf';
                        // insert flash object
                        var html = '<object type="application/' +
                            'x-shockwave-flash" data="' + swf + '" ';

                        if (WebUploader.browser.ie) {
                            html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                        }

                        html += 'width="100%" height="100%" style="outline:0">' +
                            '<param name="movie" value="' + swf + '" />' +
                            '<param name="wmode" value="transparent" />' +
                            '<param name="allowscriptaccess" value="always" />' +
                            '</object>';

                        container.html(html);

                    })($wrap);

                    // 压根就没有安转。
                } else {
                    $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                }

                return;
            } else if (!WebUploader.Uploader.support()) {
                alert('Web Uploader 不支持您的浏览器！');
                return;
            }

            // 实例化
            uploader = WebUploader.create({
                pick: {
                    id: '.filePicker',
                    label: '',
                    style:'up-pick'
                },
                formData: {
                    uid: 123
                },
                swf: '/lib/webuploader-0.1.5/Uploader.swf',
                chunked: false,
                chunkSize: 512 * 1024,
                server: '/common/file/UpLoadCarProcess',
                runtimeOrder: 'flash',
                 accept: {
                     title: 'Images',
                     extensions: 'gif,jpg,jpeg,bmp,png',
                     mimeTypes: 'image/*'
                 },
                threads:1,
                // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
                disableGlobalDnd: true,
                fileNumLimit: 32,
                fileSizeLimit: 200 * 1024 * 1024,    // 200 M
                fileSingleSizeLimit:5 * 1024 * 1024    // 5 M
            });

            uploader.on('dialogOpen', function () {
                console.log('here');
            });

            uploader.on('uploadSuccess', function (file, response) {
                if(response.status==1){
                    $("#"+file.id).attr('data-path',response.data)
                }
            });

            // 添加“添加文件”的按钮，
            uploader.addButton({
                id: '.filePicker2',
                label: ''
            });

            uploader.on('ready', function () {
                window.uploader = uploader;
            });

            // 当有文件添加进来时执行，负责view的创建
            function addFile(file) {
                var $li = $('<li id="' + file.id + '" class="file-preview-frame">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"></p>' +
                        '<p class="progress"><span></span></p>' +
                        '</li>'),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span></div>').appendTo($li),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find('p.imgWrap'),
                    $info = $('<p class="error"></p>'),
                    showError = function (code) {
                        switch (code) {
                            case 'exceed_size':
                                text = '文件大小超出';
                                break;

                            case 'interrupt':
                                text = '上传暂停';
                                break;

                            default:
                                text = '上传失败，请重试';
                                break;
                        }

                        $info.text(text).appendTo($li);
                    };

                if (file.getStatus() === 'invalid') {
                    showError(file.statusText);
                } else {
                    // @todo lazyload
                    $wrap.text('预览中');
                    uploader.makeThumb(file, function (error, src) {
                        var img;

                        if (error) {
                            $wrap.text('不能预览');
                            return;
                        }

                        if (isSupportBase64) {
                            img = $('<img src="' + src + '">');
                            $wrap.empty().append(img);
                        } else {
                            $.ajax('/common/file/UpLoadCarProcess', {
                                method: 'POST',
                                data: src,
                                dataType: 'json'
                            }).done(function (response) {
                                if (response.result) {
                                    img = $('<img src="' + response.result + '">');
                                    $wrap.empty().append(img);
                                } else {
                                    $wrap.text("预览出错");
                                }
                            });
                        }
                    }, thumbnailWidth, thumbnailHeight);

                    percentages[file.id] = [file.size, 0];
                    file.rotation = 0;
                }

                file.on('statuschange', function (cur, prev) {
                    if (prev === 'progress') {
                        $prgress.hide().width(0);
                    }
                    // 成功
                    if (cur === 'error' || cur === 'invalid') {
                        showError(file.statusText);
                        percentages[file.id][1] = 1;
                    } else if (cur === 'interrupt') {
                        showError('interrupt');
                    } else if (cur === 'queued') {
                        percentages[file.id][1] = 0;
                    } else if (cur === 'progress') {
                        $info.remove();
                        $prgress.css('display', 'block');
                    } else if (cur === 'complete') {
                        $prgress.hide().width(0);
                        $li.append('<span class="success"></span>');
                    }

                    $li.removeClass('state-' + prev).addClass('state-' + cur);
                });

                $li.on('mouseenter', function () {
                    $btns.stop().animate({height: 30});
                });

                $li.on('mouseleave', function () {
                    $btns.stop().animate({height: 0});
                });

                $btns.on('click', 'span.cancel', function () {

                    var index = $(this).index(),
                        deg;
                    console.log(index)
                    switch (index) {
                        case 0:
                            uploader.removeFile(file);
                          var le=  $(element).find('li').length;
                            if(le==0){
                                $(element).find('.placeholder').show()
                            }
                            return;
                        case 1:
                            file.rotation += 90;
                            break;

                        case 2:
                            file.rotation -= 90;
                            break;
                    }

                    if (supportTransition) {
                        deg = 'rotate(' + file.rotation + 'deg)';
                        $wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                    }


                });
                $li.appendTo($queue);
            }

            // 负责view的销毁
            function removeFile(file) {
                var $li = $('#' + file.id);

                var path=$li.attr('data-path');
                if(path){
                    ResourceService.getFunServer('delimg',{fileName:path});
                }
                delete percentages[file.id];
                updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
            }

            function updateTotalProgress() {
                var loaded = 0,
                    total = 0,
                    spans = $progress.children(),
                    percent;

                $.each(percentages, function (k, v) {
                    total += v[0];
                    loaded += v[0] * v[1];
                });

                percent = total ? loaded / total : 0;


                spans.eq(0).text(Math.round(percent * 100) + '%');
                spans.eq(1).css('width', Math.round(percent * 100) + '%');
                updateStatus();
            }

            function updateStatus() {
                var text = '', stats;

                if (state === 'ready') {
                    text = '选中' + fileCount + '张图片，共' +
                        WebUploader.formatSize(fileSize) + '。';
                } else if (state === 'confirm') {
                    stats = uploader.getStats();
                    if (stats.uploadFailNum) {
                        text = '已成功上传' + stats.successNum + '张，' +
                            stats.uploadFailNum + '张照片上传失败，<a class="retry" href="javascript:void(0)">重新上传</a>失败图片或<a class="ignore" href="javascript:void(0)">忽略</a>'
                    }

                } else {
                    stats = uploader.getStats();
                    text = '共' + fileCount + '张（' +
                        WebUploader.formatSize(fileSize) +
                        '），已上传' + stats.successNum + '张';

                    if (stats.uploadFailNum) {
                        text += '，失败' + stats.uploadFailNum + '张';
                    }
                }

                $info.html(text);
            }

            function setState(val) {
                var file, stats;

                if (val === state) {
                    return;
                }

                $upload.removeClass('state-' + state);
                $upload.addClass('state-' + val);
                state = val;

                switch (state) {
                    case 'pedding':
                        $placeHolder.removeClass('element-invisible');
                       // $queue.hide();
                        uploader.refresh();
                        break;

                    case 'ready':
                        $placeHolder.addClass('element-invisible');
                        $queue.show();
                        uploader.refresh();
                        break;

                    case 'uploading':
                        $progress.show();
                        $upload.text('暂停上传');
                        break;

                    case 'paused':
                        $progress.show();
                        $upload.text('继续上传');
                        break;

                    case 'confirm':
                        $progress.hide();
                        $upload.text('开始上传');
                        stats = uploader.getStats();
                        if (stats.successNum && !stats.uploadFailNum) {
                            setState('finish');
                            return;
                        }
                        break;
                    case 'finish':
                        stats = uploader.getStats();
                        if (stats.successNum) {
                            //alert('上传成功');
                        } else {
                            // 没有成功的图片，重设
                            state = 'done';
                            location.reload();
                        }
                        break;
                }

                updateStatus();
            }

            uploader.onUploadProgress = function (file, percentage) {
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress span');
                $percent.css('width', percentage * 100 + '%');
                percentages[file.id][1] = percentage;
                updateTotalProgress();
            };

            uploader.onFileQueued = function (file) {
                fileCount++;
                fileSize += file.size;

                if (fileCount === 1) {
                    $placeHolder.addClass('element-invisible');
                    $statusBar.show();
                }

                addFile(file);
                setState('ready');
                updateTotalProgress();
            };

            uploader.onFileDequeued = function (file) {
                fileCount--;
                fileSize -= file.size;

                if (!fileCount) {
                    setState('pedding');
                }

                removeFile(file);
                updateTotalProgress();

            };

            uploader.on('all', function (type) {
                var stats;
                switch (type) {
                    case 'uploadFinished':
                        setState('confirm');
                        break;

                    case 'startUpload':
                        setState('uploading');
                        break;

                    case 'stopUpload':
                        setState('paused');
                        break;

                }
            });

            uploader.onError = function (code) {
                alert('Eroor: ' + code);
            };

            $upload.on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }

                if (state === 'ready') {
                    uploader.upload();
                } else if (state === 'paused') {
                    uploader.upload();
                } else if (state === 'uploading') {
                    uploader.stop();
                }
            });

            $info.on('click', '.retry', function () {
                uploader.retry();
            });

            $info.on('click', '.ignore', function () {

            });

            $upload.addClass('state-' + state);
            updateTotalProgress();

        }
    }
}]).directive('viewGalley',['ResourceService',function(ResourceService){
    return{
        restrict: 'A',
        template:'',
        link:function(scope,element,attr){
            $btns=$(element).find('.file-panel');
            $(element).on('mouseenter','li', function () {
                $(this).find('.file-panel').stop().animate({height: 30});
            });

            $(element).on('mouseleave','li', function () {
                $(this).find('.file-panel').stop().animate({height: 0});
            });
            $(element).on('click','.delete-pic',function(e){
                ResourceService.getFunServer('deletecarimg',{CarPicID:e.target.id})
                $(e.target).parents('li').remove();
                var length=$(element).find('li').length;
                if(length==0){
                    $(element).find('.placeholder ').show();
                }
            })
        }
    }
}]);