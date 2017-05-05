/**
 * Created by 73951 on 2017/3/17.
 */

define(['app','storageUtils','serverService'], function (app,storageUtils,serverService) {
    return  app.controller('reviewNoCtrl',['$scope','$rootScope','$timeout','serverService',function ($scope,$rootScope,$timeout,serverService) {
        var reviewFlag = storageUtils.session.getItem('_FLAG_');
        if(reviewFlag){
            storageUtils.session.removeItem('_FLAG_');
            window.location = '#/reviewDetail/reviewDetail/tab1';
            return;
        }
        var searchCheckBydate = storageUtils.session.getItem('searchCheckBydate');
        if(searchCheckBydate){
            if(searchCheckBydate.rows.length>0 && searchCheckBydate.rows[0].status == 4){
                $scope.reviewNoItems = searchCheckBydate.rows;
                $scope.reviewNo = $scope.reviewNoItems[0].data;
                $scope.changeColor = 0;
                $scope.currentIndex = 0;
                $scope.reviewNo.forEach(function (item,index) {
                    if(item.type == 5){
                        window.x = item.x;
                        window.y = item.y;
                    }
                });
                window.initNo = function () {
                    map = new BMap.Map("cc_map");            // 创建Map实例
                    var point = new BMap.Point( window.x,window.y); // 创建点坐标
                    map.centerAndZoom(point,16);
                    map.enableScrollWheelZoom();// 启用滚轮放大缩小
                };
                //复选框的初值
                $scope.flag = false;
                $scope.masterItem = false;
                $scope.all= function (master) {
                    $scope.masterItem = master;
                    for(var i=0;i<$scope.reviewNoItems.length;i++){
                        $scope.reviewNoItems[i].checkState=master;
                    }
                    //$scope.currentIndex = $scope.reviewNoItems.length
                };
                $scope.cancelOne = function (ev,x,index) {
                    ev  = event || window.event;
                    if(ev && ev.stopPropagation){
                        ev.stopPropagation()
                    }
                    $scope.reviewNoItems[index].checkState = x;
                    for(var i=0;i<$scope.reviewNoItems.length;i++){
                        if(!$scope.reviewNoItems[i].checkState){
                            $scope.masterHeader = false;
                            $scope.flag = false;
                            return false
                        }else{
                            $scope.flag = true;
                        }
                    }
                };
                $scope.changeRight = function (item,index) {
                    console.log(item.data)
                    if(item && item.data){
                        serverService.getInfoData({uid:item.uid,tid:item.id})
                            .then(function (data) {
                                $scope.reviewNo = item.data;
                                if($scope.reviewNo.length == 0){
                                    $scope.reviewNo.push({})
                                }
                                $scope.reviewNo[0].amount = data.result.amount;
                                $scope.reviewNo[0].check_fail = data.result.check_fail;
                                $scope.reviewNo[0].invited = data.result.invited;
                                $scope.reviewNo[0].regist_time = data.result.regist_time;
                                $scope.reviewNo[0].task_check_fail =data.result.task_check_fail;
                                $scope.reviewNo.forEach(function (item,index) {
                                    if(item.type == 5){
                                        window.x = item.x;
                                        window.y = item.y;
                                    }
                                })
                            })
                    }else{
                        $scope.reviewNo = {}
                    }
                    $scope.changeColor = index;
                    $scope.currentIndex = index;
                };
                $scope.changeRight($scope.reviewNoItems[0],0);
                $scope.next = function () {
                    $scope.currentIndex ++;
                    if($scope.currentIndex >= $scope.reviewNoItems.length ){
                        $scope.currentIndex = $scope.reviewNoItems.length - 1
                    }
                    $scope.changeRight($scope.reviewNoItems[$scope.currentIndex], $scope.currentIndex)
                }
                $scope.prev = function () {
                    $scope.currentIndex --;
                    if($scope.currentIndex < 0 ){
                        $scope.currentIndex = 0
                    }
                    $scope.changeRight($scope.reviewNoItems[$scope.currentIndex], $scope.currentIndex)
                };
                $scope.rnRightAllow = function (e) {
                    /*全选通过*/
                    e.stopPropagation();
                    if(confirm('确认通过?')){
                        if($scope.master&&$scope.master == true){
                            for(var i=0;i<$scope.reviewNoItems.length;i++){
                                serverService.check(
                                        {
                                            ids:$scope.reviewNoItems[i].cid,
                                            status:1
                                        }
                                )
                                        .then(function (data) {
                                            if(data.result.success ==1){
                                                storageUtils.session.setItem('_NotoAllow_',true)
                                            }else{
                                                storageUtils.session.setItem('_NotoAllow_',false)
                                            }
                                        });
                                //okArr.push($scope.reviewNoItems[i]);
                                $scope.masterHeader = false;
                                $scope.masterItem = false;
                                $scope.changeRight(null);
                            }
                            //storageUtils.session.setItem('_reviewOk_',okArr);
                            $scope.reviewNoItems = [];/*删除待审核的*/
                            $scope.masterHeader = false;
                            $timeout(function () {
                                if(storageUtils.session.getItem('_NotoAllow_')== 'true'){
                                    alert('操作成功')
                                    storageUtils.session.removeItem('_NotoAllow_')
                                }
                            },100);
                            storageUtils.session.setItem('_reviewNo_',$scope.reviewNoItems);
                        }else{
                            /*没全选状态下点击next/通过*/
                            var result = [];
                            for(var i=0;i<$scope.reviewNoItems.length;i++){
                                if($scope.reviewNoItems[i].checkState == true) {
                                    serverService.check({ids:$scope.reviewNoItems[i].cid,
                                        status:1
                                    }).then(function (data) {
                                        if(data.result.success ==1){
                                            storageUtils.session.setItem('_NotoAllow_',true)
                                        }
                                    });

                                    //okArr.push($scope.reviewNoItems[i]);
                                    $scope.reviewNoItems.splice(i, 1);/*删除待审核的*/
                                    i--;
                                }
                            }
                            $timeout(function () {
                                if(storageUtils.session.getItem('_NotoAllow_') == 'true'){
                                    alert('操作成功')
                                    storageUtils.session.removeItem('_NotoAllow_')
                                }
                            },100)
                            result = $scope.reviewNoItems;
                            $scope.reviewNoItems = result;
                            if($scope.reviewNoItems.length>0){
                                $scope.changeRight($scope.reviewNoItems[0],0);
                            }else{
                                $scope.toReview = {}
                            }
                            //storageUtils.session.setItem('_reviewOk_',okArr);
                        }
                    }

                };
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
                            data.status = 2;
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
                                $scope.reviewNoItems = resData.result.rows;
                                $scope.changeRight($scope.reviewNoItems[0],0)
                            })
                };
                storageUtils.session.removeItem('searchCheckBydate');
                return
            }
        }
        
        /************/
        if($scope.reviewUserId&&$scope.chooseType == 2){
            $scope.reviewUserId = ''
        }
        var reviewId = storageUtils.session.getItem('_reviewList_');
        serverService.getReviewList({
            id:reviewId,
            uid:$scope.reviewUserId,
            date:$scope.subTime,
            status:4,
            page:1,
            rows:10
        }).then(function (data) {
            console.log(data);
            $scope.reviewNoItems = data.result.rows;
            if($scope.reviewNoItems && $scope.reviewNoItems.length>0){
                $scope.reviewNo = $scope.reviewNoItems[0].data;
                if($scope.reviewNo.length == 0){
                    $scope.reviewNo.push({})
                }
                serverService.getInfoData({uid:$scope.reviewNoItems[0].uid,tid:$scope.reviewNoItems[0].id})
                    .then(function (data) {
                        $scope.reviewNo[0].amount = data.result.amount;
                        $scope.reviewNo[0].check_fail = data.result.check_fail;
                        $scope.reviewNo[0].invited = data.result.invited;
                        $scope.reviewNo[0].regist_time = data.result.regist_time;
                        $scope.reviewNo[0].task_check_fail =data.result.task_check_fail
                    })
            }else{return}

            $scope.reviewNo.forEach(function (item,index) {
                if(item.type == 5){
                    window.x = item.x;
                    window.y = item.y;
                }
            });
            window.initNo = function () {
                map = new BMap.Map("cc_map");            // 创建Map实例
                var point = new BMap.Point( window.x,window.y); // 创建点坐标
                map.centerAndZoom(point,16);
                map.enableScrollWheelZoom();// 启用滚轮放大缩小
            };
            $scope.changeColor = 0;
            $scope.currentIndex = 0;
            //复选框的初值
            $scope.flag = false;
            $scope.masterItem = false;
            $scope.all= function (master) {
                $scope.masterItem = master;
                for(var i=0;i<$scope.reviewNoItems.length;i++){
                    $scope.reviewNoItems[i].checkState=master;
                }
                //$scope.currentIndex = $scope.reviewNoItems.length
            };
            $scope.cancelOne = function (ev,x,index) {
                ev  = event || window.event;
                if(ev && ev.stopPropagation){
                    ev.stopPropagation()
                }
                $scope.reviewNoItems[index].checkState = x;
                for(var i=0;i<$scope.reviewNoItems.length;i++){

                    if(!$scope.reviewNoItems[i].checkState){
                        $scope.masterHeader = false;
                        $scope.flag = false;
                        return false
                    }else{
                        $scope.flag = true;
                    }
                }
            };
            $scope.changeRight = function (item,index) {
                console.log(item.data)
                if(item && item.data){
                    serverService.getInfoData({uid:item.uid,tid:item.id})
                        .then(function (data) {
                            $scope.reviewNo = item.data;
                            if($scope.reviewNo.length == 0){
                                $scope.reviewNo.push({})
                            }
                            $scope.reviewNo[0].amount = data.result.amount;
                            $scope.reviewNo[0].check_fail = data.result.check_fail;
                            $scope.reviewNo[0].invited = data.result.invited;
                            $scope.reviewNo[0].regist_time = data.result.regist_time;
                            $scope.reviewNo[0].task_check_fail =data.result.task_check_fail;
                            $scope.reviewNo.forEach(function (item,index) {
                                if(item.type == 5){
                                    window.x = item.x;
                                    window.y = item.y;
                                }
                            })

                        })
                }else{
                    $scope.reviewNo = {}
                }
                $scope.changeColor = index;
                $scope.currentIndex = index;
            }
            $scope.next = function () {
                $scope.currentIndex ++;
                if($scope.currentIndex >= $scope.reviewNoItems.length ){
                    $scope.currentIndex = $scope.reviewNoItems.length - 1
                }
                $scope.changeRight($scope.reviewNoItems[$scope.currentIndex], $scope.currentIndex)
            }
            $scope.prev = function () {
                $scope.currentIndex --;
                if($scope.currentIndex < 0 ){
                    $scope.currentIndex = 0
                }
                $scope.changeRight($scope.reviewNoItems[$scope.currentIndex], $scope.currentIndex)
            };
            $scope.rnRightAllow = function (e) {
                e.stopPropagation();
                /*全选通过*/
                if(confirm('确认通过?')){
                    if($scope.master&&$scope.master == true){
                        for(var i=0;i<$scope.reviewNoItems.length;i++){
                            serverService.check({ids:$scope.reviewNoItems[i].cid,
                                status:1
                            })
                                    .then(function (data) {
                                        if(data.result.success ==1){
                                            storageUtils.session.setItem('_NotoAllow_',true)
                                        }else{
                                            storageUtils.session.setItem('_NotoAllow_',false)
                                        }
                                    });
                            //okArr.push($scope.reviewNoItems[i]);
                            $scope.masterHeader = false;
                            $scope.masterItem = false;
                            $scope.changeRight(null);
                        }
                        //storageUtils.session.setItem('_reviewOk_',okArr);
                        $scope.reviewNoItems = [];/*删除待审核的*/
                        $scope.masterHeader = false;
                        $timeout(function () {
                            if(storageUtils.session.getItem('_NotoAllow_') == 'true'){
                                alert('操作成功');
                                storageUtils.session.removeItem('_NotoAllow_')
                            }
                        },100);
                        storageUtils.session.setItem('_reviewNo_',$scope.reviewNoItems);
                    }else{
                        /*没全选状态下点击next/通过*/
                        var result = [];
                        for(var i=0;i<$scope.reviewNoItems.length;i++){
                            if($scope.reviewNoItems[i].checkState == true) {
                                serverService.check({ids:$scope.reviewNoItems[i].cid,
                                    status:1
                                }).then(function (data) {
                                    if(data.result.success ==1){
                                        storageUtils.session.setItem('_NotoAllow_',true)
                                    }else{
                                        storageUtils.session.setItem('_NotoAllow_',false)
                                    }
                                });
                                //okArr.push($scope.reviewNoItems[i]);
                                $scope.reviewNoItems.splice(i, 1);/*删除待审核的*/
                                i--;
                            }
                        }
                        $timeout(function () {
                            if(storageUtils.session.getItem('_NotoAllow_') == 'true'){
                                alert('操作成功');
                                storageUtils.session.removeItem('_NotoAllow_')
                            }
                        },100);
                        result = $scope.reviewNoItems;
                        $scope.reviewNoItems = result;
                        if($scope.reviewNoItems.length>0){
                            $scope.changeRight($scope.reviewNoItems[0],0);
                        }else{
                            $scope.toReview = {}
                        }
                        //storageUtils.session.setItem('_reviewOk_',okArr);
                    }
                }

            };

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
                        data.status = 2;
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
                            $scope.reviewNoItems = resData.result.rows;
                            $scope.changeRight($scope.reviewNoItems[0],0)
                        })
            };
        })
    }])
});