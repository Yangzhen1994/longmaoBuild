/**
 * Created by 73951 on 2017/3/17.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
define(['app','storageUtils',], function (app,storageUtils,serverService) {
    return  app.controller('reviewCtrl',['$rootScope','$scope','$timeout','serverService',function ($rootScope,$scope, $timeout,serverService) {
        $('.left').css('height',738);
        storageUtils.session.removeItem('_reviewList_');
        var drag = storageUtils.session.getItem('_DRAG_');
        if(drag){
            //storageUtils.session.removeItem('_component_');
            storageUtils.session.removeItem('_DRAG_');
            var oldtaskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
            serverService.getComponent(oldtaskId)
                    .then(function (data) {
                        console.log(data)
                        //把凭证信息存入到session
                        storageUtils.session.setItem('_component_',data.result);
                        window.location ='#/addStep'
                    })




        }
        /*显示审核*/
        serverService.getAllTask({
            id:'',
            title:'',
            pid:'',
            poi_id:'',
            status:'',
            device:0,
            user:0,
            page:1,
            rows:200,
            show_nocheck:1
        })
                .then(function (data) {
                    console.log(data);
                    var checkArr = []
                    data.forEach(function (item,index) {
                        /*if(item.nocheck_nums>0){*/
                            checkArr.push(item)
                       /* }*/
                    })
                    $scope.items = checkArr;
                    $scope.items.forEach(function (item,index) {
                        item.title = item.title.replace(/&nbsp;/g,'')
                    })
                    $scope.setChoose = function (type) {
                        $scope.chooseType = type;
                        /**绑定id name 或者 poiid**/
                        switch (type){
                            case 1:{
                                //alert('renwuID');
                                $scope.reviewsearchByTaskId = true;
                                $scope.reviewsearchByTaskName = false;
                                $scope.reviewsearchByPoiId = false;
                                break;
                            }
                            case 2:{
                                //alert('renwuName');
                                $scope.reviewsearchByTaskId = false;
                                $scope.reviewsearchByTaskName = true;
                                $scope.reviewsearchByPoiId = false;
                                break;
                            }
                            case 3:{
                                //alert('poiID');
                                $scope.reviewsearchByTaskId = false;
                                $scope.reviewsearchByTaskName = false;
                                $scope.reviewsearchByPoiId = true;
                                break;
                            }
                        }
                    }
                    /*$scope.items.forEach(function (item,index) {
                        if(item.status == 2){
                            item.state = '未审核'
                        }
                    });*/
                    $scope.items.forEach(function (item,index) {
                        if(item.status == 1){
                            //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                            item.endTime = item.end_time;
                            //alert(item.endTime)
                            item.line = '上线'
                        }else if(item.status == 2){
                            //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                            item.endTime = item.end_time;
                            item.line = '下线'
                        }else if(item.status == 3){
                            item.endTime = item.end_time.split('>')[1].substr(0,19)
                            item.line = '上线'
                        }

                    });
                    var reviewArr = [];
                    $scope.turnToReviewDetail = function(index){
                        storageUtils.session.setItem('_reviewList_',$scope.items[index].id);
                        window.location = '#/reviewDetail'
                    }



                    /**导出**/
                    $scope.exportStates = [
                        {exportState:'待审核'},//2
                        {exportState:'未提交'},//1
                        {exportState:'审核成功'},//3
                        {exportState:'审核失败'},//4
                    ]

                    $scope.export = function (item,index) {
                        item.exportshow = true
                        var data = {
                            id:item.id,
                            uid:'',
                            date:'',
                            status:2,
                            page:1,
                            rows:100
                        }
                        $scope.chooseState = function () {
                            if($scope.exportState.exportState == '待审核'){
                                //alert(1)
                                data.status = 2
                            }
                            if($scope.exportState.exportState == '未提交'){
                                //alert(1)
                                data.status = 1
                            }
                            if($scope.exportState.exportState == '审核成功'){
                                //alert(1)
                                data.status = 3
                            }
                            if($scope.exportState.exportState == '审核失败'){
                                //alert(1)
                                data.status = 4
                            }
                            serverService.getReviewList(data)
                                    .then(function (data) {
                                        item.exportshow = false
                                        data.result.rows.forEach(function (item1,index) {
                                            if(item1.id == item.id){
                                                item.submit_time = item1.submit_time;
                                                var data = {
                                                    uid:item1.uid,
                                                    tid:item.id,
                                                    date:item.submit_time.substr(0,10),
                                                    status:2,
                                                    tip:1
                                                };
                                                var url = 'http://manager.test.shandianshua.com/totoro/task/expimp/export/check/data.html?id='+data.tid+'&uid='+data.uid+'&date='+data.date+'&status=2&tip=1'
                                                window.open(url)
                                            }
                                        })
                                    })
                        }


                        //console.log(item)

                        /*serverService.exportReview(data)
                                .then(function (data) {
                                    console.log(data)
                                })*/


                    }
                    /*导入*/
                    $scope.file_upload = function (obj) {
                        var index = obj.id.substr(-1,1) || obj.id.substr(-2,2)
                        console.log(index)
                        var str = '#totoro-task-check-file-form'+index
                        console.log(str);
                        console.log(new FormData($(str)[0]))
                       /* console.log(data)
                        console.log(data[0]);*/
                        $.ajax({
                            url: 'http://manager.test.shandianshua.com/totoro/task/expimp/import/check/data.json',
                            type: 'POST',
                            dataType: 'json',
                            xhrFields: {
                                withCredentials: true
                            },
                            data: new FormData($(str)[0]),
                            contentType: false,
                            processData: false,
                            success: function(data) {
                                if(data.code === '200') {
                                    alert('提交成功')
                                }
                            }

                        });
                        //var index = obj.id.substr(-1)
                        //console.log($scope.items[index])
                        /*serverService.importReview(data[0])
                                .then(function (data) {
                                    console.log(data)
                                })*/
                    }



                    /***reveiewSearch**/
                    $scope.reveiewSearch = function () {
                        /*任务Id*/
                        if($scope.reviewsearchByTaskId  == true){
                            $scope.items.forEach(function (item) {
                                //console.log(item.id)
                                if(item.id != $scope.searchReviewContent*1){
                                    item.show = true;
                                }
                            })
                        }
                        /**任务名字**/
                        if( $scope.reviewsearchByTaskName == true){
                            $scope.items.forEach(function (item) {
                                if(item.title.indexOf($scope.searchReviewContent)==-1){
                                    //console.log(item.title);
                                    item.show = true;
                                }
                            })
                        }
                        /**poi_id**/
                        if( $scope.reviewsearchByPoiId == true ){
                            serverService.getAllTask({
                                id:'',
                                title:'',
                                pid:'',
                                poi_id:$scope.searchReviewContent,
                                status:'',
                                device:0,
                                user:0,
                                page:1,
                                rows:200
                            }).then(function (result) {
                                $scope.items = result;
                                console.log($scope.items);
                                $scope.items.forEach(function (item,index) {
                                    if(item.status == 1){
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        //alert(item.endTime)
                                        item.line = '上线'
                                    }else if(item.status == 2){
                                        //item.endTime = item.end_time.split('-')[0].substr(-4,4)}}-{{item.end_time.split('-')[1].substr(0,2)}}-{{item.end_time.split('-')[2].substr(0,2)}} {{item.end_time.split(':')[0].substr(-2,2)}}:{{item.end_time.split(':')[1].substr(0,2)}}:{{item.end_time.split(':')[1].substr(0,2)
                                        item.endTime = item.end_time;
                                        item.line = '下线'
                                    }else if(item.status == 3){
                                        item.endTime = item.end_time.split('>')[1].substr(0,19)
                                        item.line = '上线'
                                    }

                                });
                            })
                        }
                        console.log($scope.searchReviewContent)
                    }




                })

    }]);
})