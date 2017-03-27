/**
 * Created by 73951 on 2017/3/17.
 */
define(['app','storageUtils'], function (app,storageUtils,serverService) {
    return  app.controller('ReviewOkCtrl',['$scope','serverService',function ($scope,serverService) {
        var okResult = storageUtils.session.getItem('_reviewOk_');
        if(okResult){
            okResult.forEach(function (item,index) {
                item.checkState = false
            })
            $scope.reviewOkItems = okResult;
            console.log($scope.reviewOkItems)
        }else{
            console.log($scope.reviewOkItems)
            return false;
        }

        $scope.changeColor = 0;
        $scope.currentIndex = 0;
        $scope.reviewOk = $scope.reviewOkItems[0].data;
        //复选框的初值
        $scope.flag = false;

        $scope.masterItem = false;
        $scope.all= function (master) {
            $scope.masterItem = master;

            for(var i=0;i<$scope.reviewOkItems.length;i++){
                $scope.reviewOkItems[i].checkState=master;
            }
            $scope.currentIndex = $scope.reviewOkItems.length
        };
        $scope.cancelOne = function (ev,x,index) {
            ev  = event || window.event;
            if(ev && ev.stopPropagation){
                ev.stopPropagation()
            }
            $scope.reviewOkItems[index].checkState = x;
            for(var i=0;i<$scope.reviewOkItems.length;i++){

                if($scope.reviewOkItems[i].checkState == false){
                    $scope.masterheader = false;
                    $scope.flag = false;
                    return false
                }else{
                    $scope.flag = true;
                }
            }
        };

        $scope.changeRight = function (item,index) {
            if(item && item.data){
                $scope.reviewOk = item.data
            }else{
                $scope.reviewOk = {}
            }
            $scope.changeColor = index;
            $scope.currentIndex = index;
        }
        $scope.next = function () {
            $scope.currentIndex ++;
            if($scope.currentIndex >= $scope.reviewOkItems.length ){
                $scope.currentIndex = $scope.reviewOkItems.length - 1
            }
            $scope.changeRight($scope.reviewOkItems[$scope.currentIndex], $scope.currentIndex)
        }
        $scope.prev = function () {
            $scope.currentIndex --;
            if($scope.currentIndex < 0 ){
                $scope.currentIndex = 0
            }
            $scope.changeRight($scope.reviewOkItems[$scope.currentIndex], $scope.currentIndex)
        }

    }])
})