/**
 * Created by 73951 on 2017/3/17.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('toReviewCtrl',['$scope','serverService',function ($scope,serverService) {
        var okArr = [];
        var noArr = [];
        var reviewok = storageUtils.session.getItem('_reviewOk_');
        if(reviewok!=null){
            okArr=reviewok;
        }
        var reviewno = storageUtils.session.getItem('_reviewNo_');
        if(reviewno!=null){
            noArr=reviewno;

        }

        $scope.toReviewItems = [
            {
                nickName : '杨镇',
                time : '2016/11/11 12:21:12',
                checkState:false,
                reviewState:0,
                data:{
                    name:'yz',
                    tel:'10012128320'
                }
            },
            {
                nickName : '昵称1',
                time : '2016/11/11 12:21:12',
                checkState:false,
                reviewState:0,
                data:{
                    name:'mick',
                    tel:'100202128320',
                }
            },
            {
                nickName : '昵称2',
                time : '2016/11/11 12:21:12',
                checkState:false,
                reviewState:0,
                data:{
                    name:'第三个',
                    tel:'100322221234',
                }
            },
            {
                nickName : '昵称3',
                time : '2016/11/11 12:21:12',
                checkState:false,
                reviewState:0,
                data:{
                    name:'第三个',
                    tel:'100422221234',
                }
            }];

        $scope.toReview = $scope.toReviewItems[0].data;
        $scope.checkedBox = 0;
        $scope.changeColor = 0;
        $scope.currentIndex = 0;
        //复选框的初值
        $scope.flag = false;

        $scope.masterItem = false;
        $scope.otherReason ='请填写其他原因';


        $scope.changeRight = function (item,index) {
            if(item && item.data){
                $scope.toReview = item.data
            }else{
                $scope.toReview = {}
            }
            $scope.changeColor = index;
            $scope.currentIndex = index;
        }
        $scope.all= function (master) {

            $scope.masterItem = master;

            for(var i=0;i<$scope.toReviewItems.length;i++){
                $scope.toReviewItems[i].checkState=master;
            }
            $scope.currentIndex = $scope.toReviewItems.length;



        };
        $scope.cancelOne = function (ev,x,index) {
            ev  = event || window.event;
            if(ev && ev.stopPropagation){
                ev.stopPropagation()
            }
            $scope.toReviewItems[index].checkState = x;
            for(var i=0;i<$scope.toReviewItems.length;i++){

               if($scope.toReviewItems[i].checkState == false){
                   $scope.masterheader = false;
                   $scope.flag = false;
                   return false
               }else{
                   $scope.masterheader = true
                   $scope.flag = true;
               }
            }
        };
        $scope.next = function () {

            $scope.currentIndex ++;
            if($scope.currentIndex >= $scope.toReviewItems.length ){
                $scope.currentIndex = $scope.toReviewItems.length - 1
            }
            $scope.changeRight($scope.toReviewItems[$scope.currentIndex], $scope.currentIndex)
        }
        $scope.prev = function () {
            $scope.currentIndex --;
            if($scope.currentIndex < 0 ){
                $scope.currentIndex = 0
            }
            $scope.changeRight($scope.toReviewItems[$scope.currentIndex], $scope.currentIndex)
        }
        $scope.trRightAllow = function () {
            /*全选通过*/
            if($scope.master&&$scope.master == true){
                for(var i=0;i<$scope.toReviewItems.length;i++){
                        $scope.toReviewItems[i].reviewState = 1;/*通过的状态变成1*/
                        okArr.push($scope.toReviewItems[i]);
                        $scope.masterheader = false;
                    $scope.masterItem = false;
                        $scope.changeRight(null);
                }
                storageUtils.session.setItem('_reviewOk_',okArr);
                $scope.toReviewItems = [];/*删除待审核的*/
                $scope.masterheader = false;
                storageUtils.session.setItem('_reviewNo_',$scope.toReviewItems);
            }else{
                /*没全选状态下点击next/通过*/
                var result = []
                for(var i=0;i<$scope.toReviewItems.length;i++){
                    if($scope.toReviewItems[i].checkState == true) {
                        console.log($scope.toReviewItems[i].nickName+'通过');
                        $scope.toReviewItems[i].reviewState = 1;/*通过的状态变成1*/
                        okArr.push($scope.toReviewItems[i]);
                        $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                        i--;
                    }
                }
                result = $scope.toReviewItems;
                $scope.toReviewItems = result;
                if($scope.toReviewItems.length>0){
                    $scope.changeRight($scope.toReviewItems[0],0);

                }else{
                    $scope.toReview = {}
                }
                storageUtils.session.setItem('_reviewOk_',okArr);

            }

        };

        /*拒绝*/
        $scope.reasonLists = [
            {
                reasonText :'与要求的内容不符'
            },
            {
                reasonText :'非新用户'
            }
                ]
        $scope.showrejCover = false;

        $scope.changeReasonbg = function (index) {
            $scope.bg = index
        }
        $scope.subReason = function (e,index) {
            /*全选拒绝*/
            if($scope.master&&$scope.master == true){
                for(var i=0;i<$scope.toReviewItems.length;i++){
                    $scope.toReviewItems[i].reviewState = 2;/*拒绝的状态变成2*/
                    $scope.toReviewItems[i].rejectReason = $scope.reasonLists[index].reasonText;
                    noArr.push($scope.toReviewItems[i]);
                    $scope.masterheader = false;
                    $scope.changeRight(null);
                }
                storageUtils.session.setItem('_reviewNo_',noArr);
                $scope.toReviewItems = [];/*删除待审核的*/
                $scope.masterheader = false
            }else{
                var result = []
                /*没全选状态下点击next/通过*/
                for(var i=0;i<$scope.toReviewItems.length;i++){
                    if($scope.toReviewItems[i].checkState == true) {
                        console.log($scope.toReviewItems[i].nickName+'拒绝');
                        $scope.toReviewItems[i].reviewState = 2;/*通过的状态变成2*/
                        $scope.toReviewItems[i].rejectReason = $scope.reasonLists[index].reasonText;
                        noArr.push($scope.toReviewItems[i]);
                        $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                        i--;
                    }
                }
                result = $scope.toReviewItems;
                $scope.toReviewItems = result;
                if($scope.toReviewItems.length>0){
                    $scope.changeRight($scope.toReviewItems[0],0);

                }else{
                    $scope.toReview = {}
                }
                storageUtils.session.setItem('_reviewNo_',noArr);
            }
                $scope.showrejCover = false;

        }
        $scope.subotherReason = function (e) {
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    /*全选拒绝*/
                    if($scope.master&&$scope.master == true){
                        for(var i=0;i<$scope.toReviewItems.length;i++){
                            $scope.toReviewItems[i].reviewState = 2;/*拒绝的状态变成2*/
                            $scope.toReviewItems[i].rejectReason = $scope.otherReason;
                            noArr.push($scope.toReviewItems[i]);
                            $scope.master = false;
                            $scope.changeRight(null);
                        }
                        storageUtils.session.setItem('_reviewNo_',noArr);
                        $scope.toReviewItems = [];/*删除待审核的*/
                    }else{
                        var result = [];
                        /*没全选状态下点击next/通过*/
                        for(var i=0;i<$scope.toReviewItems.length;i++){
                            if($scope.toReviewItems[i].checkState == true) {
                                console.log($scope.toReviewItems[i].nickName+'拒绝');
                                $scope.toReviewItems[i].reviewState = 2;/*通过的状态变成2*/
                                $scope.toReviewItems[i].rejectReason = $scope.otherReason;
                                noArr.push($scope.toReviewItems[i]);
                                $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                                i--;
                            }
                        }
                        result = $scope.toReviewItems;
                        $scope.toReviewItems = result;
                        if($scope.toReviewItems.length>0){
                            $scope.changeRight($scope.toReviewItems[0],0);

                        }else{
                            $scope.toReview = {}
                        }
                        storageUtils.session.setItem('_reviewNo_',noArr);
                    }

                    console.log($scope.otherReason);

                    $scope.showrejCover = false;
                }
            }
        };

        $scope.showrejCoverFn = function () {
            $scope.showrejCover = true
        }

    }])
})