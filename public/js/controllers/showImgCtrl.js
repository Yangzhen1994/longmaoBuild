/**
 * Created by 73951 on 2017/3/22.
 */
define(['app','storageUtils'], function (app,storageUtils,serverService) {
    return  app.controller('showImgCtrl',['$scope','Upload','$timeout','$http','serverService',function ($scope,Upload,$timeout,$http,serverService) {
        $scope.fileName = '';
        //上传js
       /* $scope.uploadself = function(f){
            var str = "";
            for(var i=0;i<f.length;i++){
                var reader = new FileReader();
                reader.readAsDataURL(f[i]);
                reader.onload = function(e){
                    str+="<img src='"+e.target.result+"'/>";
                    document.getElementById("moniImg").innerHTML = str;
                }
            }
        }*/
        /*上传文件test*/
        /*$scope.uploadFiles = function(file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    console.log($scope.f)
                    $scope.fileName = $scope.f.name;
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                            evt.loaded / evt.total));
                });
            }
        }*/

            $scope.reader = new FileReader();  //创建一个FileReader接口
            $scope.form = {   //用于绑定提交内容，图片或其他数据
                image:{},
            };
            $scope.stepItems.forEach(function (item) {

            })
            $scope.thumb = {};   //用于存放图片
            $scope.thumb_default = {  //用于循环默认的‘加号'添加图片的框
                1111:{}
            };

            $scope.img_upload = function(files,dom) {//单次提交图片的函数










                dom.parentNode.parentNode.style.visibility = 'hidden';
                $scope.guid = (new Date()).valueOf();  //通过时间戳创建一个随机数，作为键名使用
                $scope.reader.readAsDataURL(files[0]); //FileReader的方法，把图片转成base64
                $scope.reader.onload = function(ev) {
                    $scope.$apply(function(){
                        $scope.thumb[$scope.guid] = {
                            imgSrc : ev.target.result, //接收base64
                        }
                    });
                };
                $scope.$emit('pic',files[0]);
            };

            $scope.img_del = function(key) {
                $scope.$emit('delPic',key);
                //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
                var guidArr = [];
                for(var p in $scope.thumb){
                    guidArr.push(p);
                }
                delete $scope.thumb[guidArr[key]];
                delete $scope.form.image[guidArr[key]];
            };
            $scope.submit_form = function(){
                //图片选择完毕后的提交，这个提交并没有提交前面的图片数据，只是提交用户操作完毕后，
                //到底要上传哪些，通过提交键名或者链接，后台来判断最终用户的选择,整个思路也是如此
                $http({
                    method: 'post',
                    url: '',
                    data:$scope.form,
                }).success(function(data) {
                    console.log(data);
                })
            };
            /**点击xx删除*/
            $scope.deleteImg = function (e,data) {
                    e=event||window.event;
                    e.stopPropagation();
                    $scope.$emit('deleteImg',data);
            }

        ///



    }])
})