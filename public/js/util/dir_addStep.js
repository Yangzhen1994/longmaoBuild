/**
 * Created by 73951 on 2017/3/21.
 */
/**
 * Created by 73951 on 2017/3/20.
 */
/**
 *
 */
define(['app'], function (app) {
    app.directive('stepModule',[function () {
        return {
            restrict: "EA",

            templateUrl: 'tpls/stepModule.html',
            controller:function ($scope) {
                $scope.middleItems = [];
                /*文本凭证*/
                $scope.textProof = function () {
                    $scope.middleItems.push({
                        value : 1
                    })
                }
                /*图片凭证*/
                $scope.imgProof = function () {
                    //alert('如片凭证')
                };
                /*位置凭证*/
                $scope.posProof = function () {
                    //alert('位置凭证')
                    $scope.middleItems.push({
                        value : 3
                    })
                };
                /*录音凭证*/
                $scope.audioProof = function () {
                    //alert('录音凭证')
                };
                /*显示文本*/
                $scope.showText = function () {
                    //alert('显示文本')
                    $scope.middleItems.push({
                        value : 5
                    })
                };
                /*显示图片*/
                $scope.showImg = function () {
                    //alert('显示图片')
                    $scope.middleItems.push({
                        value : 6
                    })
                };
                $scope.$on('deleteOneShowText',function (data) {
                    //console.log(data)
                   for(var i=0;i<$scope.middleItems.length;i++){
                       if($scope.middleItems[i] == data.targetScope.middleItem){
                           $scope.middleItems.splice(i,1)
                       }
                   }
                });
                $scope.$on('deleteImg',function (data) {
                    for(var i=0;i<$scope.middleItems.length;i++){
                        if($scope.middleItems[i] == data.targetScope.middleItem){
                            $scope.middleItems.splice(i,1)
                        }
                    }
                    $scope.$emit('deleteImgTop')
                })
            }
        }

    }])
})