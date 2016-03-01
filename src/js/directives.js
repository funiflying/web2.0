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
}).directive('banklist',function(){
    //车辆颜色
    return{
        restrict:'AE',
        replace:false,
        templateUrl:'./statics/banklist.html',
        link:function(scope,element,attr){
            var elem=$(element).find('.pl-item');
            elem.bind('click',function(){
                $(this).addClass('active').siblings().removeClass('active');
                scope.bank=$(this).data('bank')
            })
        }
    }
})