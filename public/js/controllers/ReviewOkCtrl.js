/**
 * Created by 73951 on 2017/3/17.
 */
define(['app','storageUtils'], function (app,storageUtils,serverService) {
    return  app.controller('ReviewOkCtrl',['$scope','serverService',function ($scope,serverService) {
        /*var okResult = storageUtils.session.getItem('_reviewOk_');
        if(okResult){
            okResult.forEach(function (item,index) {
                item.checkState = false
            })
            $scope.reviewOkItems = okResult;
            console.log($scope.reviewOkItems)
        }else{
            //console.log($scope.reviewOkItems)
            return false;
        }*/
        var searchCheckBydate = storageUtils.session.getItem('searchCheckBydate');
        if(searchCheckBydate&&searchCheckBydate[0].status == 2){
            window.location = '#/reviewDetail/reviewDetail/tab1';
        }
        if(searchCheckBydate&&searchCheckBydate[0].status == 4){
            window.location = '#/reviewDetail/reviewDetail/tab3';
        }
        if(searchCheckBydate&&searchCheckBydate[0].status == 3){
            $scope.reviewOkItems = searchCheckBydate;
            $scope.reviewOk = $scope.reviewOkItems[0].data;
            $scope.changeColor = 0;
            $scope.currentIndex = 0;
            //$scope.reviewOk = $scope.reviewOkItems[0].data;
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

                    if(!$scope.toReviewItems[i].checkState){
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
            };
            storageUtils.session.removeItem('searchCheckBydate');
            return
        }
        /******************/
        serverService.getReviewList({
            id:'',
            date:'',
            status:3,
            page:1,
            rows:100,
        }).then(function (data) {
            console.log(data);
            $scope.reviewOkItems = data.result.rows;
            $scope.reviewOk = $scope.reviewOkItems[0].data;
            $scope.changeColor = 0;
            $scope.currentIndex = 0;
            //$scope.reviewOk = $scope.reviewOkItems[0].data;
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

                    if(!$scope.toReviewItems[i].checkState){
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
        })


    }])
})