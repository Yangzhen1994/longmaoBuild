/**
 * Created by 73951 on 2017/3/17.
 */
define(['app','storageUtils'], function (app,storageUtils,serverService) {
    return  app.controller('ReviewOkCtrl',['$scope','$rootScope','serverService',function ($scope,$rootScope,serverService) {
        var reiewFlag = storageUtils.session.getItem('_FLAG_');
        if(reiewFlag){
            storageUtils.session.removeItem('_FLAG_');
            window.location = '#/reviewDetail/reviewDetail/tab3'
        }

        var reviwid = storageUtils.session.getItem('_reviewList_');
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

        if(searchCheckBydate){
            if(searchCheckBydate.rows.length>0&&searchCheckBydate.rows[0].status == 2){
                window.location = '#/reviewDetail/reviewDetail/tab1';
            }
            if(searchCheckBydate.rows.length>0&&searchCheckBydate.rows[0].status == 4){
                window.location = '#/reviewDetail/reviewDetail/tab3';
            }
            if(searchCheckBydate.rows.length>0&&searchCheckBydate.rows[0].status == 3){
                $scope.reviewOkItems = searchCheckBydate.rows;
                $scope.reviewOk = $scope.reviewOkItems[0].data;
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
                        id:reviwid,
                        uid:$scope.reviewuserID,
                        date:$scope.subTime,
                        status:3,
                        page:index,
                        rows:10,
                    };
                    serverService.getReviewList(data)
                            .then(function (data) {
                                $scope.reviewOkItems = data.result.rows;
                                if($scope.reviewOkItems && $scope.reviewOkItems.length>0){
                                    $scope.reviewOk = $scope.reviewOkItems[0].data;
                                    serverService.getInfoData({uid:$scope.reviewOkItems[0].uid,tid:$scope.reviewOkItems[0].id})
                                            .then(function (data) {
                                                $scope.reviewOk[0].amount = data.result.amount
                                                $scope.reviewOk[0].check_fail = data.result.check_fail
                                                $scope.reviewOk[0].invited = data.result.invited
                                                $scope.reviewOk[0].regist_time = data.result.regist_time
                                                $scope.reviewOk[0].task_check_fail =data.result.task_check_fail
                                            })
                                }else{return}
                                $scope.reviewOk.forEach(function (item,index) {
                                    if(item.type == 5){
                                        window.x = item.x;
                                        window.y = item.y;
                                    }
                                })

                            })


                };
                $scope.reviewOk.forEach(function (item,index) {
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
                //$scope.reviewOk = $scope.reviewOkItems[0].data;
                //复选框的初值
                $scope.flag = false;

                $scope.masterItem = false;
                $scope.all= function (master) {
                    $scope.masterItem = master;

                    for(var i=0;i<$scope.reviewOkItems.length;i++){
                        $scope.reviewOkItems[i].checkState=master;
                    }
                    //$scope.currentIndex = $scope.reviewOkItems.length
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
                        serverService.getInfoData({uid:item.uid,tid:item.id})
                                .then(function (data) {
                                    $scope.reviewOk = item.data;
                                    $scope.reviewOk[0].amount = data.result.amount
                                    $scope.reviewOk[0].check_fail = data.result.check_fail
                                    $scope.reviewOk[0].invited = data.result.invited
                                    $scope.reviewOk[0].regist_time = data.result.regist_time
                                    $scope.reviewOk[0].task_check_fail =data.result.task_check_fail

                                    $scope.reviewOk.forEach(function (item,index) {
                                        if(item.type == 5){
                                            window.x = item.x;
                                            window.y = item.y;
                                        }
                                    })

                                })
                    }else{
                        $scope.reviewOk = {}
                    }
                    $scope.changeColor = index;
                    $scope.currentIndex = index;
                };
                $scope.changeRight($scope.reviewOkItems[0],0)
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
        }

        /******************/
        var reviwid = storageUtils.session.getItem('_reviewList_');
        serverService.getReviewList({
            id:reviwid,
            uid:$scope.reviewuserID,
            date:$scope.subTime,
            status:3,
            page:1,
            rows:10,
        }).then(function (data) {
            console.log(data);
            $scope.reviewOkItems = data.result.rows;
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
                    id:reviwid,
                    uid:$scope.reviewuserID,
                    date:$scope.subTime,
                    status:3,
                    page:index,
                    rows:10,
                };
                serverService.getReviewList(data)
                        .then(function (data) {
                            $scope.reviewOkItems = data.result.rows;
                            if($scope.reviewOkItems && $scope.reviewOkItems.length>0){
                                $scope.reviewOk = $scope.reviewOkItems[0].data;
                                serverService.getInfoData({uid:$scope.reviewOkItems[0].uid,tid:$scope.reviewOkItems[0].id})
                                        .then(function (data) {
                                            $scope.reviewOk[0].amount = data.result.amount
                                            $scope.reviewOk[0].check_fail = data.result.check_fail
                                            $scope.reviewOk[0].invited = data.result.invited
                                            $scope.reviewOk[0].regist_time = data.result.regist_time
                                            $scope.reviewOk[0].task_check_fail =data.result.task_check_fail
                                        })
                            }else{return}
                            $scope.reviewOk.forEach(function (item,index) {
                                if(item.type == 5){
                                    window.x = item.x;
                                    window.y = item.y;
                                }
                            })

                        })


            };
            if($scope.reviewOkItems && $scope.reviewOkItems.length>0){
                $scope.reviewOk = $scope.reviewOkItems[0].data;
                //$scope.changeRight($scope.reviewOkItems[0].data,0)
                serverService.getInfoData({uid:$scope.reviewOkItems[0].uid,tid:$scope.reviewOkItems[0].id})
                        .then(function (data) {
                            $scope.reviewOk[0].amount = data.result.amount
                            $scope.reviewOk[0].check_fail = data.result.check_fail
                            $scope.reviewOk[0].invited = data.result.invited
                            $scope.reviewOk[0].regist_time = data.result.regist_time
                            $scope.reviewOk[0].task_check_fail =data.result.task_check_fail
                        })
            }else{return}



            $scope.reviewOk.forEach(function (item,index) {
                if(item.type == 5){
                    window.x = item.x;
                    window.y = item.y;
                }
            })


            window.initOk = function () {
                map = new BMap.Map("cc_map");            // 创建Map实例
                var point = new BMap.Point( window.x,window.y); // 创建点坐标
                map.centerAndZoom(point,16);
                map.enableScrollWheelZoom();// 启用滚轮放大缩小


            };

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
                //$scope.currentIndex = $scope.reviewOkItems.length
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
                    serverService.getInfoData({uid:item.uid,tid:item.id})
                            .then(function (data) {
                                $scope.reviewOk = item.data;
                                $scope.reviewOk[0].amount = data.result.amount
                                $scope.reviewOk[0].check_fail = data.result.check_fail
                                $scope.reviewOk[0].invited = data.result.invited
                                $scope.reviewOk[0].regist_time = data.result.regist_time
                                $scope.reviewOk[0].task_check_fail =data.result.task_check_fail

                                $scope.reviewOk.forEach(function (item,index) {
                                    if(item.type == 5){
                                        window.x = item.x;
                                        window.y = item.y;
                                    }
                            })

                    })
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