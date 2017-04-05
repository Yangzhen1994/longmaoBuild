/**
 * Created by 73951 on 2017/3/17.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('toReviewCtrl',['$rootScope','$scope','$timeout','$window','serverService','mapService',function ($rootScope,$scope,$timeout,$window,serverService,mapService) {
        var searchCheckBydate = storageUtils.session.getItem('searchCheckBydate');
        console.log(searchCheckBydate)
        if(searchCheckBydate && searchCheckBydate[0].status == 3){
            window.location = '#/reviewDetail/reviewDetail/tab2';
            return
        }
        if(searchCheckBydate){
            $scope.toReviewItems = searchCheckBydate;
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
                    //console.log($scope.toReviewItems[i].checkState)
                    if(!$scope.toReviewItems[i].checkState){
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
                        serverService.check({ids:$scope.toReviewItems[i].cid,
                            status:1
                        })
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
                            serverService.check({ids:$scope.toReviewItems[i].cid,
                                status:1
                            }).then(function (data) {
                                if(data.success == 1){
                                    alert('操作成功')
                                }
                            })

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
                var data = {ids:$scope.toReviewItems[i].cid,
                    status:0,
                    message:3,
                    extmessage:'',
                    reason:$scope.reasonLists[index].reasonText
                }
                if(index == 0){
                    data.message == 3
                }
                if(index == 1){
                    data.message == 2
                }
                /*全选拒绝*/
                if($scope.master&&$scope.master == true){
                    for(var i=0;i<$scope.toReviewItems.length;i++){
                        serverService.check(data).then(function (data) {

                        })

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
                            /*$scope.toReviewItems[i].reviewState = 2;/!*通过的状态变成2*!/
                             $scope.toReviewItems[i].rejectReason = $scope.reasonLists[index].reasonText;
                             noArr.push($scope.toReviewItems[i]);*/
                            serverService.check(data).then(function (data) {

                            })
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
                                /* $scope.toReviewItems[i].reviewState = 2;/!*拒绝的状态变成2*!/
                                 $scope.toReviewItems[i].rejectReason = $scope.otherReason;
                                 noArr.push($scope.toReviewItems[i]);*/
                                serverService.check({ids:$scope.toReviewItems[i].cid,
                                    status:0,
                                    message:1,
                                    extmessage:$scope.otherReason
                                }).then(function (data) {

                                })
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
                                    //console.log($scope.toReviewItems[i].nickName+'拒绝');
                                    // $scope.toReviewItems[i].reviewState = 2;/*通过的状态变成2*/
                                    //$scope.toReviewItems[i].rejectReason = $scope.otherReason;
                                    // noArr.push($scope.toReviewItems[i]);
                                    serverService.check({ids:$scope.toReviewItems[i].cid,
                                        status:0,
                                        message:1,
                                        extmessage:$scope.otherReason
                                    }).then(function (data) {});

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
            };
            storageUtils.session.removeItem('searchCheckBydate');
            return
        }

        serverService.getReviewList({toReviewNum:'',id:'',
        uid:'',
        date:'',
        status:2,
        page:1,
        rows:100,
        })
                .then(function (data) {

                    $scope.toReviewItems = data.result.rows;
                    $scope.toReview = $scope.toReviewItems[0].data;
                    console.log($scope.toReview);
                    $timeout(function () {

                    },2000)

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
                            //console.log($scope.toReviewItems[i].checkState)
                            if(!$scope.toReviewItems[i].checkState){
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
                                serverService.check({ids:$scope.toReviewItems[i].cid,
                                    status:1
                                })
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
                                    serverService.check({ids:$scope.toReviewItems[i].cid,
                                                        status:1
                                    }).then(function (data) {
                                        if(data.success == 1){
                                            alert('操作成功')
                                        }
                                    })

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
                        var data = {ids:$scope.toReviewItems[index].cid,
                            status:0,
                            message:3,
                            extmessage:'',
                            reason:$scope.reasonLists[index].reasonText
                        }
                        if(index == 0){
                            data.message == 3
                        }
                        if(index == 1){
                            data.message == 2
                        }
                        /*全选拒绝*/
                        if($scope.master&&$scope.master == true){
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                serverService.check(data).then(function (data) {

                                })

                                $scope.masterheader = false;
                                $scope.changeRight(null);
                            }
                            storageUtils.session.setItem('_reviewNo_',noArr);
                            $scope.toReviewItems = [];/*删除待审核的*/
                            $scope.masterheader = false
                        }else{
                            var result = []

                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                if($scope.toReviewItems[i].checkState == true) {
                                    console.log($scope.toReviewItems[i].nickName+'拒绝');
                                    /*$scope.toReviewItems[i].reviewState = 2;/!*通过的状态变成2*!/
                                    $scope.toReviewItems[i].rejectReason = $scope.reasonLists[index].reasonText;
                                    noArr.push($scope.toReviewItems[i]);*/
                                    serverService.check(data).then(function (data) {

                                    })
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
                                       /* $scope.toReviewItems[i].reviewState = 2;/!*拒绝的状态变成2*!/
                                        $scope.toReviewItems[i].rejectReason = $scope.otherReason;
                                        noArr.push($scope.toReviewItems[i]);*/
                                        serverService.check({ids:$scope.toReviewItems[i].cid,
                                            status:0,
                                            message:1,
                                            extmessage:$scope.otherReason
                                        }).then(function (data) {

                                        })
                                        $scope.master = false;
                                        $scope.changeRight(null);
                                    }
                                    storageUtils.session.setItem('_reviewNo_',noArr);
                                    $scope.toReviewItems = [];/*删除待审核的*/
                                }else{
                                    var result = [];

                                    for(var i=0;i<$scope.toReviewItems.length;i++){
                                        if($scope.toReviewItems[i].checkState == true) {
                                            //console.log($scope.toReviewItems[i].nickName+'拒绝');
                                           // $scope.toReviewItems[i].reviewState = 2;/*通过的状态变成2*/
                                            //$scope.toReviewItems[i].rejectReason = $scope.otherReason;
                                           // noArr.push($scope.toReviewItems[i]);
                                            serverService.check({ids:$scope.toReviewItems[i].cid,
                                                status:0,
                                                message:1,
                                                extmessage:$scope.otherReason
                                            }).then(function (data) {});

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
                })
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



    }])
})