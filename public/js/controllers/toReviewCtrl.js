/**
 * Created by 73951 on 2017/3/17.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('toReviewCtrl',['$rootScope','$scope','$timeout','$window','serverService','mapService',function ($rootScope,$scope,$timeout,$window,serverService,mapService) {
        var reviwid = storageUtils.session.getItem('_reviewList_');
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
            $scope.otherReason ='';



            $scope.changeRight = function (item,index) {
                if(item && item.data){
                    serverService.getInfoData({uid:item.uid,tid:item.id})
                            .then(function (data) {
                                $scope.toReview = item.data;
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



        /*function loadMapAPI(containterId, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://api.map.baidu.com/api?v=2.0&ak=VcN7gumC0Wnn475XXWr4FeoyF5YYOVGC&callback=" + callback;
            document.getElementById(containterId).appendChild(script);
        }*/
        serverService.getReviewList({id:reviwid,
        uid:'',
        date:'',
        status:2,
        page:1,
        rows:100,
        })
                .then(function (data) {

                    $scope.toReviewItems = data.result.rows;
                    $rootScope.totalCount = data.result.total;
                    $rootScope.pageIndex = 1;
                    $rootScope.pageTotal = Math.ceil($scope.totalCount / 100);
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
                            uid:'',
                            date:'',
                            status:2,
                            page:index,
                            rows:100,
                        };
                        serverService.getReviewList(data)
                                .then(function (data) {
                                    $scope.toReviewItems = data.result.rows;
                                    if($scope.toReviewItems && $scope.toReviewItems.length>0){

                                        $scope.toReview = $scope.toReviewItems[0].data;
                                        $scope.changeRight($scope.toReviewItems[0].data,0);
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

                    /*var map;

                    window.init = function () {
                        map = new BMap.Map("cc_map");            // 创建Map实例
                        var point = new BMap.Point($scope.toReview.x, $scope.toReview.y); // 创建点坐标
                        map.centerAndZoom(point,15);
                        // map.enableScrollWheelZoom();// 启用滚轮放大缩小
                        /!*****初始化列表**********!/


                    }

                    loadMapAPI('mapDiv',init)*/
                    $scope.toReview.forEach(function (item,index) {
                        if(item.type == 5){
                            window.x = item.x;
                            window.y = item.y;
                        }
                    })


                    window.init = function () {
                        map = new BMap.Map("cc_map");            // 创建Map实例
                        var point = new BMap.Point( window.x,window.y); // 创建点坐标
                        map.centerAndZoom(point,16);
                        map.enableScrollWheelZoom();// 启用滚轮放大缩小


                    }
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
                                        $scope.toReview[0].amount = data.result.amount
                                        $scope.toReview[0].check_fail = data.result.check_fail
                                        $scope.toReview[0].invited = data.result.invited
                                        $scope.toReview[0].regist_time = data.result.regist_time
                                        $scope.toReview[0].task_check_fail =data.result.task_check_fail

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