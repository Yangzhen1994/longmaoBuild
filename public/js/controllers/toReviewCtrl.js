/**
 * Created by 73951 on 2017/3/17.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('toReviewCtrl',['$rootScope','$scope','$timeout','$window','serverService','mapService',function ($rootScope,$scope,$timeout,$window,serverService,mapService) {
        var reviewFlag = storageUtils.session.getItem('_FLAG_');
        if(reviewFlag){
            storageUtils.session.removeItem('_FLAG_');
            window.location = '#/reviewDetail/reviewDetail/tab2';
            return;
        }

        var reviewId = storageUtils.session.getItem('_reviewList_');
        var searchCheckBydate = storageUtils.session.getItem('searchCheckBydate');

        console.log(searchCheckBydate);
        if(searchCheckBydate){
            if(searchCheckBydate.rows.length>0 && searchCheckBydate.rows[0].status == 3 ){
                window.location = '#/reviewDetail/reviewDetail/tab2';
                return
            }
            if(searchCheckBydate.rows.length>0){
                $scope.closeCover = function (e) {
                    e.stopPropagation();
                    $scope.showRejCover = false
                };
                $scope.stopSub = function (e) {
                    e.stopPropagation();
                };
                $scope.toReviewItems = searchCheckBydate.rows;
                $scope.toReview = $scope.toReviewItems[0].data;
                $scope.checkedBox = 0;
                $scope.changeColor = 0;
                $scope.currentIndex = 0;
                $rootScope.totalCount = searchCheckBydate.total;
                $rootScope.pageIndex = 1;
                $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
                $rootScope.toPage = function (index) {
                    if (index < 1) {
                        index = 1
                    }
                    if (index > $rootScope.pageTotal) {
                        index--;
                        $rootScope.pageIndex = index;
                    }
                    $rootScope.pageIndex = index;

                    var data = {
                        id:reviewId,
                        uid:$scope.reviewUserId,
                        date:$scope.subTime,
                        status:2,
                        page:index,
                        rows:10,
                    };
                    serverService.getReviewList(data)
                        .then(function (data) {
                            $scope.toReviewItems = data.result.rows;
                            if($scope.toReviewItems && $scope.toReviewItems.length>0){
                                $scope.toReview = $scope.toReviewItems[0].data;
                                serverService.getInfoData({uid:$scope.toReviewItems[0].uid,tid:$scope.toReviewItems[0].id})
                                    .then(function (data) {
                                        $scope.toReview[0].amount = data.result.amount
                                        $scope.toReview[0].check_fail = data.result.check_fail
                                        $scope.toReview[0].invited = data.result.invited
                                        $scope.toReview[0].regist_time = data.result.regist_time
                                        $scope.toReview[0].task_check_fail =data.result.task_check_fail
                                    })
                            }else{return}
                            $scope.toReview.forEach(function (item,index) {
                                if(item.type == 5){
                                    window.x = item.x;
                                    window.y = item.y;
                                }
                            })

                        })
                };
                $scope.toReview.forEach(function (item,index) {
                    if(item.type == 5){
                        window.x = item.x;
                        window.y = item.y;
                    }
                });
                window.initOk = function () {
                    map = new BMap.Map("cc_map");            // 创建Map实例
                    var point = new BMap.Point( window.x,window.y); // 创建点坐标
                    map.centerAndZoom(point,16);
                    map.enableScrollWheelZoom();// 启用滚轮放大缩小
                };
                //复选框的初值
                $scope.flag = false;
                $scope.masterItem = false;
                $scope.otherReason ='';
                $scope.changeRight = function (item,index) {
                    if(item && item.data){
                        serverService.getInfoData({uid:item.uid,tid:item.id})
                            .then(function (data) {
                                $scope.toReview = item.data;
                                if($scope.toReview.length == 0){
                                    $scope.push({})
                                }
                                $scope.toReview[0].amount = data.result.amount;
                                $scope.toReview[0].check_fail = data.result.check_fail;
                                $scope.toReview[0].invited = data.result.invited;
                                $scope.toReview[0].regist_time = data.result.regist_time;
                                $scope.toReview[0].task_check_fail =data.result.task_check_fail;

                                $scope.toReview.forEach(function (item,index) {
                                    if(item.type == 5){
                                        window.x = item.x;
                                        window.y = item.y;
                                    }
                                })

                            })
                    }else{
                        $scope.toReview = {}
                    }
                    $scope.changeColor = index;
                    $scope.currentIndex = index;
                };
                $scope.changeRight($scope.toReviewItems[0],0)
                $scope.all= function (master) {

                    $scope.masterItem = master;

                    for(var i=0;i<$scope.toReviewItems.length;i++){
                        $scope.toReviewItems[i].checkState=master;
                    }
                    //$scope.currentIndex = $scope.toReviewItems.length;



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
                            $scope.masterHeader = false;
                            $scope.flag = false;
                            return false
                        }else{
                            $scope.masterHeader = true;
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
                    if(confirm('确认通过么?')){
                        if($scope.master&&$scope.master == true){
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                serverService.check({ids:$scope.toReviewItems[i].cid,
                                    status:1
                                })
                                        .then(function (data) {
                                            /*if(data.result.success == 1){
                                             alert('操作成功')
                                             }*/
                                            if(data.result.success == 1){
                                                storageUtils.session.setItem('_Allowed_',true)
                                            }else{
                                                storageUtils.session.setItem('_Allowed_',false)
                                            }
                                        });
                                okArr.push($scope.toReviewItems[i]);
                                $scope.masterHeader = false;
                                $scope.masterItem = false;
                                $scope.changeRight(null);
                            }
                            storageUtils.session.setItem('_reviewOk_',okArr);
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Allowed_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Allowed_');
                                    //操作成功后tab间切换实现刷新目的
                                    storageUtils.session.setItem('_toReviewChecked_',true);
                                    window.location = '/reviewDetail/reviewDetail/tab2';
                                }
                            },100);
                            $scope.toReviewItems = [];/*删除待审核的*/
                            $scope.masterHeader = false;
                            storageUtils.session.setItem('_reviewNo_',$scope.toReviewItems);

                        }else{
                            /*没全选状态下点击next/通过*/
                            var result = []
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                if($scope.toReviewItems[i].checkState == true) {
                                    serverService.check({ids:$scope.toReviewItems[i].cid,
                                        status:1
                                    }).then(function (data) {
                                        if(data.result.success == 1){
                                            storageUtils.session.setItem('_Allowed_',true)
                                        }else{
                                            storageUtils.session.setItem('_Allowed_',false)
                                        }
                                    })

                                    okArr.push($scope.toReviewItems[i]);
                                    $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                                    i--;
                                }
                            }
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Allowed_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Allowed_');
                                    //操作成功后tab间切换实现刷新目的
                                    storageUtils.session.setItem('_toReviewChecked_',true);
                                    window.location = '/reviewDetail/reviewDetail/tab2';
                                }
                            },100);
                            result = $scope.toReviewItems;
                            $scope.toReviewItems = result;
                            if($scope.toReviewItems.length>0){
                                $scope.changeRight($scope.toReviewItems[0],0);

                            }else{
                                $scope.toReview = {}
                            }
                            storageUtils.session.setItem('_reviewOk_',okArr);

                        }
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
                $scope.showRejCover = false;

                $scope.changeReasonBg = function (index) {
                    $scope.bg = index
                };
                $scope.subReason = function (e,index) {
                    if(confirm('确认拒绝么？')){
                        if(e){
                            e.stopPropagation()
                        }
                        var data = {ids:$scope.toReviewItems[index].cid,
                            status:0,
                            message:3,
                            extmessage:'',
                            reason:$scope.reasonLists[index].reasonText
                        }
                        if(index == 0){
                            data.message = 3;
                        }
                        if(index == 1){
                            data.message = 4;
                        }
                        /*全选拒绝*/
                        if($scope.master&&$scope.master == true){
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                data.ids = $scope.toReviewItems[i].cid
                                serverService.check(data).then(function (data) {
                                    if(data.result.success == 1){
                                        storageUtils.session.setItem('_Fail_',true)
                                    }else{
                                        storageUtils.session.setItem('_Fail_',false)
                                    }
                                });
                                $scope.masterHeader = false;
                                $scope.changeRight(null);
                            }
                            storageUtils.session.setItem('_reviewNo_',noArr);
                            $scope.toReviewItems = [];/*删除待审核的*/
                            $scope.masterHeader = false;
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Fail_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Fail_');
                                    //操作成功后tab间切换实现刷新目的
                                    storageUtils.session.setItem('_toReviewChecked_',true);
                                    window.location = '/reviewDetail/reviewDetail/tab2';
                                }
                            },100)

                        }else{
                            var result = []
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                if($scope.toReviewItems[i].checkState == true) {
                                    console.log($scope.toReviewItems[i].nickName+'拒绝');
                                    /*$scope.toReviewItems[i].reviewState = 2;/!*通过的状态变成2*!/
                                     $scope.toReviewItems[i].rejectReason = $scope.reasonLists[index].reasonText;
                                     noArr.push($scope.toReviewItems[i]);*/
                                    data.ids = $scope.toReviewItems[i].cid
                                    serverService.check(data).then(function (data) {
                                        if(data.result.success == 1){
                                            storageUtils.session.setItem('_Fail_',true)
                                        }else{
                                            storageUtils.session.setItem('_Fail_',false)
                                        }
                                    })
                                    $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                                    i--;
                                }
                            }
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Fail_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Fail_');
                                    //操作成功后tab间切换实现刷新目的
                                    storageUtils.session.setItem('_toReviewChecked_',true);
                                    window.location = '/reviewDetail/reviewDetail/tab2';
                                }
                            },100)
                            result = $scope.toReviewItems;
                            $scope.toReviewItems = result;
                            if($scope.toReviewItems.length>0){
                                $scope.changeRight($scope.toReviewItems[0],0);

                            }else{
                                $scope.toReview = {}
                            }
                            storageUtils.session.setItem('_reviewNo_',noArr);
                        }
                        $scope.showRejCover = false;
                    }


                };
                $scope.subOtherReason = function (e) {

                        if(e){
                            var keycode = window.event?e.keyCode:e.which;
                            if(keycode==13){
                                /*全选拒绝*/
                                if(confirm('确认拒绝么？')){
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
                                                if(data.result.success == 1){
                                                    storageUtils.session.setItem('_Fail_',true)
                                                }else{
                                                    storageUtils.session.setItem('_Fail_',false)
                                                }
                                            })
                                            $scope.master = false;
                                            $timeout(function () {
                                                if(storageUtils.session.getItem('_Fail_') == 'true'){
                                                    alert('操作成功');
                                                    $scope.otherReason = '';
                                                    storageUtils.session.removeItem('_Fail_');
                                                    //操作成功后tab间切换实现刷新目的
                                                    storageUtils.session.setItem('_toReviewChecked_',true);
                                                    window.location = '/reviewDetail/reviewDetail/tab2';
                                                }
                                            },100)
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
                                                }).then(function (data) {
                                                    if(data.result.success == 1){
                                                        storageUtils.session.setItem('_Fail_',true)
                                                    }else{
                                                        storageUtils.session.setItem('_Fail_',false)
                                                    }
                                                });
                                                $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                                                i--;
                                            }
                                        }
                                        $timeout(function () {
                                            if(storageUtils.session.getItem('_Fail_') == 'true'){
                                                alert('操作成功');
                                                $scope.otherReason = '';
                                                storageUtils.session.removeItem('_Fail_');
                                                //操作成功后tab间切换实现刷新目的
                                                storageUtils.session.setItem('_toReviewChecked_',true);
                                                window.location = '/reviewDetail/reviewDetail/tab2';
                                            }
                                        },100);
                                        result = $scope.toReviewItems;
                                        $scope.toReviewItems = result;
                                        if($scope.toReviewItems.length>0){
                                            $scope.changeRight($scope.toReviewItems[0],0);

                                        }else{
                                            $scope.toReview = {}
                                        }
                                        storageUtils.session.setItem('_reviewNo_',noArr);
                                    }
                                    $scope.showRejCover = false;
                                }


                                console.log($scope.otherReason);



                            }
                        }

                };

                $scope.showRejCoverFn = function () {
                    $scope.showRejCover = true
                };
                /*排序*/
                $scope.orderByTimes = function (num) {
                    var reviewId = storageUtils.session.getItem('_reviewList_');
                    if($scope.chooseType == 2){
                        $scope.reviewUserId = ''
                    }
                    var data = {
                        id:reviewId,
                        uid:$scope.reviewUserId,
                        date:$scope.subTime,
                        status:'',
                        page:1,
                        rows:10,
                        sort:'created_time',
                        order:'desc'
                    };
                    switch (num){
                        case 1:
                            data.sort = 'created_time';
                            data.order = 'asc';
                            break;
                        case 2:
                            data.sort = 'submit_time';
                            data.order = 'asc';
                            break;
                        case 3:
                            data.sort = 'surplus_check_time';
                            data.order = 'desc';
                            break;
                    };
                    if($scope.orderFlag){
                        data.order = 'desc';
                        if(num == 3){
                            data.order = 'asc';
                        }
                    }
                    switch ($scope.tabSelected){
                        case 0:
                            data.sort = 2;
                            break;
                        case 1:
                            data.status = 3;
                            break;
                        case 2:
                            data.status = 4;
                            break;
                    };

                    serverService.getReviewList(data)
                            .then(function (resData) {
                                $scope.orderFlag = !$scope.orderFlag;
                                $scope.toReviewItems = resData.result.rows;
                                $rootScope.totalCount = resData.result.total;
                                $rootScope.pageIndex = 1;
                                $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
                                $rootScope.toPage = function (index) {
                                    if (index < 1) {
                                        index = 1
                                    }
                                    if (index > $rootScope.pageTotal) {
                                        index--;
                                        $rootScope.pageIndex = index;
                                    }
                                    $rootScope.pageIndex = index;
                                    var paginationData = {
                                        id:reviewId,
                                        uid:$scope.reviewUserId,
                                        date:$scope.subTime,
                                        status:2,
                                        page:index,
                                        rows:10,
                                        order:data.order,
                                        sort:data.sort
                                    };
                                    serverService.getReviewList(paginationData)
                                            .then(function (data) {
                                                $scope.toReviewItems = data.result.rows;
                                                if($scope.toReviewItems && $scope.toReviewItems.length>0){
                                                    $scope.toReview = $scope.toReviewItems[0].data;
                                                    serverService.getInfoData(
                                                            {
                                                                uid:$scope.toReviewItems[0].uid,
                                                                tid:$scope.toReviewItems[0].id
                                                            }
                                                    )
                                                            .then(function (data) {
                                                                $scope.toReview[0].amount = data.result.amount;
                                                                $scope.toReview[0].check_fail = data.result.check_fail;
                                                                $scope.toReview[0].invited = data.result.invited;
                                                                $scope.toReview[0].regist_time = data.result.regist_time;
                                                                $scope.toReview[0].task_check_fail =data.result.task_check_fail;
                                                            })
                                                }else{return}

                                                $scope.toReview.forEach(function (item,index) {
                                                    if(item.type == 5){
                                                        window.x = item.x;
                                                        window.y = item.y;
                                                    }
                                                })

                                            })
                                };
                                $scope.changeRight($scope.toReviewItems[0],0)
                            })
                };
                storageUtils.session.removeItem('searchCheckBydate');
                return
            }
        }
        if($scope.reviewUserId&&$scope.chooseType == 2){
            $scope.reviewUserId = ''
        }
        serverService.getReviewList({
            id:reviewId,
            uid:$scope.reviewUserId,
            date:$scope.subTime,
            status:2,
            page:1,
            rows:10,
        })
            .then(function (data) {
                $scope.closeCover = function (e) {
                    e.stopPropagation();
                    $scope.showRejCover = false
                };
                $scope.stopSub = function (e) {
                    e.stopPropagation();
                };
                $scope.toReviewItems = data.result.rows;
                $rootScope.totalCount = data.result.total;
                $rootScope.pageIndex = 1;
                $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
                $rootScope.toPage = function (index) {
                    if (index < 1) {
                        index = 1
                    }
                    if (index > $rootScope.pageTotal) {
                        index--;
                        $rootScope.pageIndex = index;
                    }
                    $rootScope.pageIndex = index;
                    var data = {
                        id:reviewId,
                        uid:$scope.reviewUserId,
                        date:$scope.subTime,
                        status:2,
                        page:index,
                        rows:10,
                    };
                    serverService.getReviewList(data)
                        .then(function (data) {
                            $scope.toReviewItems = data.result.rows;
                            if($scope.toReviewItems && $scope.toReviewItems.length>0){
                                $scope.toReview = $scope.toReviewItems[0].data;
                                serverService.getInfoData(
                                        {
                                            uid:$scope.toReviewItems[0].uid,
                                            tid:$scope.toReviewItems[0].id
                                        }
                                    )
                                .then(function (data) {
                                    $scope.toReview[0].amount = data.result.amount;
                                    $scope.toReview[0].check_fail = data.result.check_fail;
                                    $scope.toReview[0].invited = data.result.invited;
                                    $scope.toReview[0].regist_time = data.result.regist_time;
                                    $scope.toReview[0].task_check_fail =data.result.task_check_fail;
                                })
                            }else{return}

                            $scope.toReview.forEach(function (item,index) {
                                if(item.type == 5){
                                    window.x = item.x;
                                    window.y = item.y;
                                }
                            })

                        })
                };
                if($scope.toReviewItems && $scope.toReviewItems.length>0){
                    $scope.toReview = $scope.toReviewItems[0].data;
                    serverService.getInfoData({uid:$scope.toReviewItems[0].uid,tid:$scope.toReviewItems[0].id})
                        .then(function (data) {
                            $scope.toReview[0].amount = data.result.amount;
                            $scope.toReview[0].check_fail = data.result.check_fail;
                            $scope.toReview[0].invited = data.result.invited;
                            $scope.toReview[0].regist_time = data.result.regist_time;
                            $scope.toReview[0].task_check_fail =data.result.task_check_fail;
                        })
                }else{return}
                $scope.toReview.forEach(function (item,index) {
                    if(item.type == 5){
                        window.x = item.x;
                        window.y = item.y;
                    }
                });
                window.init = function () {
                    map = new BMap.Map("cc_map");            // 创建Map实例
                    var point = new BMap.Point( window.x,window.y); // 创建点坐标
                    map.centerAndZoom(point,16);
                    map.enableScrollWheelZoom();// 启用滚轮放大缩小
                };
                console.log($scope.toReview);
                $scope.checkedBox = 0;
                $scope.changeColor = 0;
                $scope.currentIndex = 0;
                //复选框的初值
                $scope.flag = false;
                $scope.masterItem = false;
                $scope.otherReason ='';
                $scope.changeRight = function (item,index) {
                    if(item && item.data){
                        serverService.getInfoData({uid:item.uid,tid:item.id})
                            .then(function (data) {
                                $scope.toReview = item.data;
                                if($scope.toReview.length == 0){
                                    $scope.toReview.push({})
                                }
                                $scope.toReview[0].amount = data.result.amount;
                                $scope.toReview[0].check_fail = data.result.check_fail;
                                $scope.toReview[0].invited = data.result.invited;
                                $scope.toReview[0].regist_time = data.result.regist_time;
                                $scope.toReview[0].task_check_fail =data.result.task_check_fail;
                                $scope.toReview.forEach(function (item,index) {
                                    if(item.type == 5){
                                        window.x = item.x;
                                        window.y = item.y;
                                    }
                                })

                            })
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
                    //$scope.currentIndex = $scope.toReviewItems.length;
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
                            $scope.masterHeader = false;
                            $scope.flag = false;
                            return false
                        }else{
                            $scope.masterHeader = true;
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
                };
                $scope.prev = function () {
                    $scope.currentIndex --;
                    if($scope.currentIndex < 0 ){
                        $scope.currentIndex = 0
                    }
                    $scope.changeRight($scope.toReviewItems[$scope.currentIndex], $scope.currentIndex)
                }
                $scope.trRightAllow = function () {
                    /*全选通过*/
                    if(confirm('确认通过么？')){
                        if($scope.master&&$scope.master == true){
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                serverService.check({ids:$scope.toReviewItems[i].cid,
                                    status:1
                                })
                                        .then(function (data) {
                                            if(data.result.success == 1){
                                                storageUtils.session.setItem('_Allowed_',true)
                                            }else{
                                                storageUtils.session.setItem('_Allowed_',false)
                                            }
                                        });
                                okArr.push($scope.toReviewItems[i]);
                                $scope.masterHeader = false;
                                $scope.masterItem = false;
                                $scope.changeRight(null);
                            }
                            storageUtils.session.setItem('_reviewOk_',okArr);
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Allowed_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Allowed_')
                                }
                            },100);
                            $scope.toReviewItems = [];/*删除待审核的*/
                            $scope.masterHeader = false;
                            storageUtils.session.setItem('_reviewNo_',$scope.toReviewItems);
                        }else{
                            /*没全选状态下点击next/通过*/
                            var result = []
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                if($scope.toReviewItems[i].checkState == true) {
                                    serverService.check({ids:$scope.toReviewItems[i].cid,
                                        status:1
                                    }).then(function (data) {
                                        if(data.result.success == 1){
                                            storageUtils.session.setItem('_Allowed_',true)
                                        }else{
                                            storageUtils.session.setItem('_Allowed_',false)
                                        }
                                    });

                                    okArr.push($scope.toReviewItems[i]);
                                    $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                                    i--;
                                }
                            }
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Allowed_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Allowed_')
                                }
                            },100);
                            result = $scope.toReviewItems;
                            $scope.toReviewItems = result;
                            if($scope.toReviewItems.length>0){
                                $scope.changeRight($scope.toReviewItems[0],0);

                            }else{
                                $scope.toReview = {}
                            }
                            storageUtils.session.setItem('_reviewOk_',okArr);
                        }
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
                $scope.showRejCover = false;
                $scope.changeReasonBg = function (index) {
                    $scope.bg = index
                };
                $scope.subReason = function (e,index) {
                    if(confirm('确认拒绝么？')){
                        e.stopPropagation();
                        var data = {ids:$scope.toReviewItems[index].cid,
                            status:0,
                            message:3,
                            extmessage:'',
                            reason:$scope.reasonLists[index].reasonText
                        }
                        if(index == 0){
                            data.message = 3;
                        }
                        if(index == 1){
                            data.message = 4;
                        }
                        /*全选拒绝*/
                        if($scope.master&&$scope.master == true){
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                data.ids = $scope.toReviewItems[i].cid
                                serverService.check(data).then(function (data) {
                                    if(data.result.success == 1){
                                        storageUtils.session.setItem('_Fail_',true)
                                    }else{
                                        storageUtils.session.setItem('_Fail_',false)
                                    }
                                });

                                $scope.masterHeader = false;
                                $scope.changeRight(null);
                            }
                            storageUtils.session.setItem('_reviewNo_',noArr);
                            $scope.toReviewItems = [];/*删除待审核的*/
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Fail_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Fail_');
                                    //操作成功后tab间切换实现刷新目的
                                    storageUtils.session.setItem('_toReviewChecked_',true);
                                    window.location = '/reviewDetail/reviewDetail/tab2';
                                }
                            },100);
                            $scope.masterHeader = false
                        }else{
                            var result = []
                            for(var i=0;i<$scope.toReviewItems.length;i++){
                                if($scope.toReviewItems[i].checkState == true) {
                                    /*$scope.toReviewItems[i].reviewState = 2;/!*通过的状态变成2*!/
                                     $scope.toReviewItems[i].rejectReason = $scope.reasonLists[index].reasonText;
                                     noArr.push($scope.toReviewItems[i]);*/
                                    data.ids = $scope.toReviewItems[i].cid
                                    serverService.check(data).then(function (data) {
                                        if(data.result.success == 1){
                                            storageUtils.session.setItem('_Fail_',true)
                                        }else{
                                            storageUtils.session.setItem('_Fail_',false)
                                        }
                                    });
                                    $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                                    i--;
                                }
                            }
                            $timeout(function () {
                                if(storageUtils.session.getItem('_Fail_') == 'true'){
                                    alert('操作成功');
                                    storageUtils.session.removeItem('_Fail_');
                                    //操作成功后tab间切换实现刷新目的
                                    storageUtils.session.setItem('_toReviewChecked_',true);
                                    window.location = '/reviewDetail/reviewDetail/tab2';
                                }
                            },100);
                            result = $scope.toReviewItems;
                            $scope.toReviewItems = result;
                            if($scope.toReviewItems.length>0){
                                $scope.changeRight($scope.toReviewItems[0],0);

                            }else{
                                $scope.toReview = {}
                            }
                            storageUtils.session.setItem('_reviewNo_',noArr);
                        }
                        $scope.showRejCover = false;
                    }
                }
                $scope.subOtherReason = function (e) {
                    if(e){
                        var keycode = window.event?e.keyCode:e.which;
                        if(keycode==13){
                            /*全选拒绝*/
                            if(confirm('确认拒绝么？')){
                                if($scope.master&&$scope.master == true){
                                    for(var i=0;i<$scope.toReviewItems.length;i++){
                                        serverService.check({ids:$scope.toReviewItems[i].cid,
                                            status:0,
                                            message:1,
                                            extmessage:$scope.otherReason
                                        }).then(function (data) {
                                            if(data.result.success == 1){
                                                storageUtils.session.setItem('_Fail_',true)
                                            }else{
                                                storageUtils.session.setItem('_Fail_',false)
                                            }
                                        });
                                        $scope.master = false;
                                        $scope.changeRight(null);
                                    }
                                    storageUtils.session.setItem('_reviewNo_',noArr);
                                    $scope.toReviewItems = [];/*删除待审核的*/
                                    $timeout(function () {
                                        if(storageUtils.session.getItem('_Fail_') == 'true'){
                                            alert('操作成功');
                                            $scope.otherReason = '';
                                            storageUtils.session.removeItem('_Fail_');
                                            //操作成功后tab间切换实现刷新目的
                                            storageUtils.session.setItem('_toReviewChecked_',true);
                                            window.location = '/reviewDetail/reviewDetail/tab2';
                                        }
                                    },100);
                                }else{
                                    var result = [];
                                    for(var i=0;i<$scope.toReviewItems.length;i++){
                                        if($scope.toReviewItems[i].checkState == true) {
                                            serverService.check({ids:$scope.toReviewItems[i].cid,
                                                status:0,
                                                message:1,
                                                extmessage:$scope.otherReason
                                            }).then(function (data) {
                                                if(data.result.success == 1){
                                                    storageUtils.session.setItem('_Fail_',true)
                                                }else{
                                                    storageUtils.session.setItem('_Fail_',false)
                                                }
                                            });

                                            $scope.toReviewItems.splice(i, 1);/*删除待审核的*/
                                            i--;
                                        }
                                    }
                                    $timeout(function () {
                                        if(storageUtils.session.getItem('_Fail_') == 'true'){
                                            alert('操作成功');
                                            $scope.otherReason = '';
                                            storageUtils.session.removeItem('_Fail_');
                                            //操作成功后tab间切换实现刷新目的
                                            storageUtils.session.setItem('_toReviewChecked_',true);
                                            window.location = '/reviewDetail/reviewDetail/tab2';
                                        }
                                    },100);
                                    result = $scope.toReviewItems;
                                    $scope.toReviewItems = result;
                                    if($scope.toReviewItems.length>0){
                                        $scope.changeRight($scope.toReviewItems[0],0);

                                    }else{
                                        $scope.toReview = {}
                                    }
                                    storageUtils.session.setItem('_reviewNo_',noArr);
                                }
                                $scope.showRejCover = false;
                            }


                            console.log($scope.otherReason);



                        }
                    }
                };

                $scope.showRejCoverFn = function () {
                    $scope.showRejCover = true
                };
                /*排序*/
                $scope.orderByTimes = function (num) {
                    var reviewId = storageUtils.session.getItem('_reviewList_');
                    if($scope.chooseType == 2){
                        $scope.reviewUserId = ''
                    };
                    var data = {
                        id:reviewId,
                        uid:$scope.reviewUserId,
                        date:$scope.subTime,
                        status:'',
                        page:1,
                        rows:10,
                        sort:'created_time',
                        order:'desc'
                    };
                    switch (num){
                        case 1:
                            data.sort = 'created_time';
                            data.order = 'asc';
                            break;
                        case 2:
                            data.sort = 'submit_time';
                            data.order = 'asc';
                            break;
                        case 3:
                            data.sort = 'surplus_check_time';
                            data.order = 'desc';
                            break;
                    };
                    if($scope.orderFlag){
                        data.order = 'desc';
                        if(num == 3){
                            data.order = 'asc';
                        }
                    }
                    switch ($scope.tabSelected){
                        case 0:
                            data.sort = 2;
                            break;
                        case 1:
                            data.status = 3;
                            break;
                        case 2:
                            data.status = 4;
                            break;
                    };

                    serverService.getReviewList(data)
                        .then(function (resData) {
                            $scope.orderFlag = !$scope.orderFlag;
                            $scope.toReviewItems = resData.result.rows;
                            $scope.changeRight($scope.toReviewItems[0],0)
                            $rootScope.totalCount = resData.result.total;
                            $rootScope.pageIndex = 1;
                            $rootScope.pageTotal = Math.ceil($scope.totalCount / 10);
                            $rootScope.toPage = function (index) {
                                if (index < 1) {
                                    index = 1
                                }
                                if (index > $rootScope.pageTotal) {
                                    index--;
                                    $rootScope.pageIndex = index;
                                }
                                $rootScope.pageIndex = index;
                                var paginationData = {
                                    id:reviewId,
                                    uid:$scope.reviewUserId,
                                    date:$scope.subTime,
                                    status:2,
                                    page:index,
                                    rows:10,
                                    order:data.order,
                                    sort:data.sort
                                };
                                serverService.getReviewList(paginationData)
                                    .then(function (data) {
                                        $scope.toReviewItems = data.result.rows;
                                        if($scope.toReviewItems && $scope.toReviewItems.length>0){
                                            $scope.toReview = $scope.toReviewItems[0].data;
                                            serverService.getInfoData(
                                                    {
                                                        uid:$scope.toReviewItems[0].uid,
                                                        tid:$scope.toReviewItems[0].id
                                                    }
                                            )
                                            .then(function (data) {
                                                $scope.toReview[0].amount = data.result.amount;
                                                $scope.toReview[0].check_fail = data.result.check_fail;
                                                $scope.toReview[0].invited = data.result.invited;
                                                $scope.toReview[0].regist_time = data.result.regist_time;
                                                $scope.toReview[0].task_check_fail =data.result.task_check_fail;
                                            })
                                        }else{return}

                                        $scope.toReview.forEach(function (item,index) {
                                            if(item.type == 5){
                                                window.x = item.x;
                                                window.y = item.y;
                                            }
                                        })

                                    })
                            };
                        })
                };
            });
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