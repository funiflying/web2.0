/**
 * Created by Administrator on 2016/2/18.
 */
angular.module('chetongxiang.directives',[]).directive('uploader',['UploaderService','ResourceService',function(UploaderService,ResourceService){
    //图片上传
    return {
        restrict:'EA',
        templateUrl:'./statics/upload.html',
        replace:false,
        link:function(scope,element,attr) {
            var elem = $(element).find('.file')
            if(elem.files)
            {
                elem.bind('change', function (e) {
                    if (this.files && this.files[0]) {
                        var i = 0;
                        var getDataUrl = function (files) {
                            var file = files[i];
                            if (file) {
                                var url = webkitURL.createObjectURL(file);
                                var $img = new Image();
                                $img.onload = function () {
                                    //生成比例
                                    var width = $img.width,
                                        height = $img.height
                                    //   scale = width / height;
                                    /*  width = parseInt(2560);
                                     height = parseInt(width / scale);*/
                                    //生成canvas
                                    var $canvas = document.createElement('canvas');
                                    var ctx = $canvas.getContext('2d');
                                    $canvas.width = width;
                                    $canvas.height = height;
                                    ctx.drawImage($img, 0, 0, width, height);
                                    var base64 = $canvas.toDataURL('image/jpeg');
                                    var placehold=preview(base64);
                                    var params = {BaseCode: base64.substr(23)};
                                    UploaderService.uploader(params, 1).success(function (data) {
                                        if (data.status == 1) {
                                            uploaderstatus(placehold,1,data.data);
                                        }
                                        else{
                                            uploaderstatus(placehold);
                                        }
                                    });
                                    i++
                                    getDataUrl(files)
                                }
                                $img.src = url;
                            }
                        }
                        getDataUrl(this.files);
                    }
                    else{

                    }
                });
            }else{
            }
            function preview(src) {
                var holdplace =$( '<div  class="file-preview-frame col-md-3">' +
                    '<img style="width:200px;height:160px;"  class="file-preview-image" src="' + src + '">' +
                    '<div class="file-thumbnail-footer">' +
                    '<div class="file-actions">' +
                    '<div class="file-footer-buttons"><span class="text-orange pull-left img-loading"><i class="glyphicon glyphicon-info-sign"></i> <span class="up-text">正在上传... </span><img src="./images/loading.gif" alt=""/></span>' +
                    '<button title="删除" class="kv-file-upload btn btn-xs btn-default pull-right" type="button">   <i class="glyphicon glyphicon-trash text-danger"></i>'+
                    '</button> <button title="上传" class="kv-file-remove btn btn-xs btn-default pull-right" type="button"><i class="glyphicon  glyphicon-upload text-info"></i></button>' +
                    '</div></div></div></div>');
                $(element).find('.file-drop-zone-title').hide();
                if (!attr.multi || attr.multi == 'false') {
                    $(element).find('.file-preview-frame').remove();
                }
                $(element).find('.file-preview-thumbnails').append(holdplace);
                //删除
                var rm=$(element).find('.kv-file-upload')
                rm.bind('click',function(){
                    var params={
                        fileName:$(this).parents('.file-preview-frame').attr('data-path')
                    }
                    ResourceService.getFunServer('delimg',params,'post').then(function(data){
                        if(data.status==1){
                            $(this).parents('.file-preview-frame').remove();
                        }
                    });
                });
                return holdplace
            }
            function uploaderstatus(placehold,status,src){
                placehold.find('.img-loading').find('img').remove();
                if(status==1){
                    placehold.attr('data-path',src);
                    placehold.find('.img-loading').removeClass('text-orange').addClass('text-info');
                    placehold.find('.up-text').text('上传成功');
                }
                else{
                    placehold.find('.img-loading').removeClass('text-orange').addClass('text-danger');
                    placehold.find('.up-text').text('上传失败，请重试');
                }
            }
        }
    }
}]).directive('upload',['UploaderService','ResourceService',function(UploaderService,ResourceService){
//车辆颜色
    return{
        restrict:'AE',
        replace:false,
        templateUrl:'./statics/upload.html',
        link:function(scope,element,attr){
            var $elem=$(element);
            var $btn=$(element).find('.filePicker');
            // 初始化Web Uploader
            var uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                // swf文件路径
                swf:  './lib/webuploader-0.1.5/Uploader.swf',
                // 文件接收服务端。
                server: attr.action,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: $btn,
                // 只允许选择图片文件。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },
               fileNumLimit:attr.limit
            });

            // 当有文件添加进来的时候
            uploader.on( 'fileQueued', function( file ) {
                var $li=$( '<div data-path="123456" class="file-preview-frame col-md-3" id="'+file.id+'">' +
                    '<img style="width:200px;height:160px;"  class="file-preview-image" >' +
                    '<div class="file-thumbnail-footer">' +
                    '<div class="file-actions">' +
                    '<div class="file-footer-buttons"><span class="text-orange pull-left img-loading"><i class="glyphicon glyphicon-info-sign"></i> <span class="up-text">正在上传... </span><img src="./images/loading.gif" alt=""/></span>' +
                    '<button title="删除" class="kv-file-upload btn btn-xs btn-default pull-right" type="button">   <i class="glyphicon glyphicon-trash text-danger"></i>'+
                    '</button> <button title="上传" class="kv-file-remove btn btn-xs btn-default pull-right" type="button"><i class="glyphicon  glyphicon-upload text-info"></i></button>' +
                    '</div></div></div></div>');
                var  $img = $li.find('.file-preview-image');
                $elem.find('.file-drop-zone-title').hide();
                $elem.find('.file-preview-thumbnails').append($li);
                // 创建缩略图
                // 如果为非图片文件，可以不用调用此方法。
                // thumbnailWidth x thumbnailHeight 为 100 x 100
                uploader.makeThumb( file, function( error, src ) {
                    if ( error ) {
                        $img.replaceWith('<span>不能预览</span>');
                        return;
                    }
                    $img.attr( 'src', src );
                }, 200, 160 );
                $elem.find('.kv-file-upload').bind('click',function(){
                    var filename=$(this).parents('.file-preview-frame').data('path');
                    if(filename){
                        ResourceService.getFunServer('delimg',{fileName:filename}).then(function(){
                            if(data.status==1){
                                uploader.cancelFile( file.id );
                                $(this).parents('.file-preview-frame').remove();
                                var length=$elem.find('.file-preview-frame').length
                                if(length==0){
                                    $elem.find('.file-drop-zone-title').show();
                                }
                            }
                        })
                    }
                });
            });
            // 文件上传过程中创建进度条实时显示。
            uploader.on( 'uploadProgress', function( file, percentage ) {

            });
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on( 'uploadSuccess', function( file ) {
                console.log(file)
                if(status==1){
                    $( '#'+file.id ).find('.img-loading').find('img').remove();
                    $( '#'+file.id ).attr('data-path',src);
                    $( '#'+file.id ).find('.img-loading').removeClass('text-orange').addClass('text-info');
                    $( '#'+file.id ).find('.up-text').text('上传成功');
                }
                else{
                    $( '#'+file.id ).find('.img-loading').find('img').remove();
                    $( '#'+file.id ).find('.img-loading').removeClass('text-orange').addClass('text-danger');
                    $( '#'+file.id ).find('.up-text').text('上传失败，请重试');
                }
            });
            // 文件上传失败，显示上传出错。
            uploader.on( 'uploadError', function( file ) {
                $( '#'+file.id ).find('.img-loading').find('img').remove();
                $( '#'+file.id ).find('.img-loading').removeClass('text-orange').addClass('text-danger');
                $( '#'+file.id ).find('.up-text').text('上传失败，请重试');
            });

            // 完成上传完了，成功或者失败
            uploader.on( 'uploadComplete', function( file ) {

            });
        }
    }
}]).directive('carColor',function(){
    //车辆颜色
    return{
        restrict:'A',
        replace:false,
        link:function(scope,element,attr){
            var elem=$(element).find('.car-color-item');
            elem.bind('click',function(){
                scope.Color=$(this).attr('data-value');
                $(this).addClass('active').siblings().removeClass('active');
            })
        }
    }
}).directive('toolTip',function(){
    //提示工具
    return{
        restrict:'A',
        replace:false,
        link:function(scope,element,attr){
            console.log( attr);
            var option={
                title:attr.title,
                placement:attr.tooltipPlacement,
                delay:
                { show: 500, hide: 1000000 }
            }
            $(element).tooltip(option);

        }
    }
})