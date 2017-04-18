/**
 * Created by 73951 on 2017/3/16.
 */

/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('taskListCtrl',['$rootScope','$scope','$timeout','serverService',
        function ($rootScope,$scope, $timeout,serverService) {

        //$('.left').css('height',738);

        storageUtils.session.removeItem('editData');
        storageUtils.session.removeItem('_TaskId_');
        storageUtils.session.removeItem('_newTaskid_');
        storageUtils.session.removeItem('_oldStep_');
        storageUtils.session.removeItem('_component_');
        storageUtils.session.removeItem('_comIndex_');
        storageUtils.session.removeItem('_componentId_');

        $rootScope.userName = '张三丰';//用户名
        $rootScope.userId = '1212112';//id
        $rootScope.balance = '1211.21';//余额
        //$rootScope.data = [{a:100}]
        $scope.chooseType = '';
        $scope.state = '';
        $scope.selected = '';
        $scope.data = {
            id:'',
            title:'',
            pid:'',
            poi_id:'',
            status:'',
            device:0,
            user:0,
            page:1,
            rows:20,
            show_nocheck:1
        };
        var dataArr = [];
        /*上来显示任务*/
        serverService.getAllTask($scope.data)
                .then(function (data) {
                    $rootScope.taskLists = data.result.rows
                    $scope.items = data.result.rows;
                    $scope.items.forEach(function (item,index) {
                        item.title = item.title.replace(/&nbsp;/g,'')
                    })


                    $rootScope.totalCount = data.result.total;
                    $rootScope.pageIndex = 1;
                    $rootScope.pageTotal = Math.ceil($scope.totalCount/20);
                    $rootScope.toPage = function (index) {
                        if(index<1){
                            index = 1
                        }
                        if(index>$rootScope.pageTotal){
                            index--;
                            $rootScope.pageIndex = index  ;
                        }
                        $rootScope.pageIndex = index;
                        var data = {
                            id:'',
                            title:'',
                            pid:'',
                            poi_id:'',
                            status:'',
                            device:0,
                            user:0,
                            page:index,
                            rows:20,
                            show_nocheck:1
                        };
                        serverService.getAllTask(data)
                                .then(function (data) {
                                    $rootScope.taskLists = data.result.rows
                                    $scope.items = data.result.rows;
                                    $scope.items.forEach(function (item,index) {
                                        item.title = item.title.replace(/&nbsp;/g,'')
                                    })
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
                                    $scope.stateItems = [
                                        {state:'未上线'},
                                        {state:'已上线'},
                                        {state:'已过期'}
                                    ];
                                    $scope.deviceItems = [
                                        {deviceType:'Android'},
                                        {deviceType:'IOS'},
                                    ];
                                    $scope.belongToUserItems = [
                                        {belongTo:'归属用户'},
                                    ];
                                })
                    };

                   console.log($scope.items)
                    $scope.setChoose = function (type) {
                        $scope.chooseType = type;
                        /**绑定id name 或者 poiid**/
                        switch (type){
                            case 1:{
                                //alert('renwuID');
                                $scope.searchByTaskId = true;
                                $scope.searchByTaskName = false;
                                $scope.searchByPoiId = false;
                                break;
                            }
                            case 2:{
                                //alert('renwuName');
                                $scope.searchByTaskId = false;
                                $scope.searchByTaskName = true;
                                $scope.searchByPoiId = false;
                                break;
                            }
                            case 3:{
                                //alert('poiID');
                                $scope.searchByTaskId = false;
                                $scope.searchByTaskName = false;
                                $scope.searchByPoiId = true;
                                break;
                            }
                        }
                    }
                    $scope.turnTo = function () {
                    }
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
                    /*正则匹配数字*/
                    $scope.testNum = new RegExp("/d");
                    /***changeSelect**/
                    $scope.stateItems = [
                        {state:'未上线'},
                        {state:'已上线'},
                        {state:'已过期'}
                    ];
                    $scope.deviceItems = [
                        {deviceType:'Android'},
                        {deviceType:'IOS'},
                    ];
                    $scope.belongToUserItems = [
                        {belongTo:'归属用户'},
                    ];
                    /**状态筛选*/
                    $scope.upStateshow = function () {

                        //console.log($scope.taskState.state)//正在进行
                        if($scope.taskState == null){
                            //window.location.reload();
                            $scope.items.forEach(function (item) {
                               item.show ='';
                            })
                            return
                        }else{
                            $scope.items.forEach(function (item) {
                                if(item.statustext.substr(-10,3) != $scope.taskState.state){
                                    item.show = true
                                }else{
                                    item.show = ''
                                }
                            })
                        }

                        //console.log($scope.items)
                    };
                    /**设备筛选*/
                    $scope.upDeviceshow = function () {
                        if($scope.deviceType == null){
                            //window.location.reload();
                            $scope.items.forEach(function (item) {
                                item.show ='';
                            })
                            return
                        }else{
                            if($scope.deviceType.deviceType == 'Android'){
                                $scope.items.forEach(function (item) {
                                    console.log(item.device)
                                    if(item.device == 1){
                                        item.show = ''
                                    }else{
                                        item.show = true
                                    }
                                })
                            }
                            if($scope.deviceType.deviceType == 'IOS'){
                                var flag2 = 2;
                                $scope.items.forEach(function (item) {
                                    if(item.device == flag2){
                                        item.show = ''
                                    }else{
                                        item.show = true
                                    }
                                })
                            }

                        }
                    }

                    $scope.upUsershow = function () {
                        //console.log($scope.belongUser.belongTo)
                        if($scope.belongUser == null){
                            //window.location.reload();
                            serverService.getAllTask({
                                id:'',
                                title:'',
                                pid:'',
                                poi_id:'',
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
                                        item.line = '上线'
                                    }else if(item.status == 2){

                                        item.line = '下线'
                                    }else if(item.status == 3){

                                        item.line = '上线'
                                    }

                                });
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
                            return
                        }
                        serverService.getAllTask({
                            id:'',
                            title:'',
                            pid:'',
                            poi_id:'',
                            status:'',
                            device:0,
                            user:1,
                            page:1,
                            rows:200,
                            show_nocheck:1
                        }).then(function (data) {
                            $scope.items = data.result.rows;
                            console.log($scope.items);
                            $scope.items.forEach(function (item,index) {
                                if(item.status == 1){
                                    item.line = '上线'
                                }else if(item.status == 2){

                                    item.line = '下线'
                                }else if(item.status == 3){

                                    item.line = '上线'
                                }

                            });
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

                        //console.log($scope.items)
                    };
                    $scope.turntoSelf = function () {
                       //window.location.reload();
                        $scope.taskState = null;
                        $scope.deviceType = null;
                        $scope.belongUser = null;
                        serverService.getAllTask({
                            id:'',
                            title:'',
                            pid:'',
                            poi_id:'',
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
                                    item.line = '上线'
                                }else if(item.status == 2){

                                    item.line = '下线'
                                }else if(item.status == 3){

                                    item.line = '上线'
                                }

                            });
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
                        $scope.items.forEach(function (item) {
                            item.show =''
                        })
                        $scope.searhContent = ''
                    }
                    /**search**/
                    $scope.taskSearch = function () {
                        /*任务Id*/
                        if($scope.searchByTaskId == true){
                            $scope.items.forEach(function (item) {
                                //console.log(item.id)
                                if(item.id != $scope.searhContent*1){
                                    item.show = true;
                                }
                            })
                        }
                        /**任务名字**/
                        if( $scope.searchByTaskName == true){
                            $scope.items.forEach(function (item) {
                                if(item.title.indexOf($scope.searhContent)==-1){
                                    //console.log(item.title);
                                    item.show = true;
                                }
                            })
                        }
                        /**poi_id**/
                        if( $scope.searchByPoiId == true ){
                            serverService.getAllTask({
                                id:'',
                                title:'',
                                pid:'',
                                poi_id:$scope.searhContent,
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
                                        item.line = '上线'
                                    }else if(item.status == 2){

                                        item.line = '下线'
                                    }else if(item.status == 3){

                                        item.line = '上线'
                                    }

                                });
                            })
                        }
                        console.log($scope.searhContent)
                    }


                    /***下线 编辑*/
                    $scope.downLine = function (index) {
                        serverService.getUpdownLine($scope.items[index].id)
                                .then(function (result) {
                                    if(result.code == 200){
                                        alert('操作成功')
                                        window.location.reload()
                                    }else{
                                        alert('操作失败请查看余额是否充足')
                                    }
                                })
                    }
                    $scope.editTask = function (index) {
                        console.log($scope.items[index].id)
                        serverService.getDatajson($scope.items[index].id)
                        .then(function (result) {
                            console.log(result)
                            storageUtils.session.setItem('editData',result)
                            window.location = '#/addTask'
                        })
                        //

                    };

        })

    }]);
})