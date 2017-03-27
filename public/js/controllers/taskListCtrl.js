/**
 * Created by 73951 on 2017/3/16.
 */

/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
define(['app'], function (app) {
    return  app.controller('taskListCtrl',['$rootScope','$scope','$timeout','serverService',function ($rootScope,$scope, $timeout,serverService) {
        $('.left').css('height',738);
        $rootScope.userName = '张三丰';//用户名
        $rootScope.userId = '1212112';//id
        $rootScope.balance = '1211.21';//余额
        //$rootScope.data = [{a:100}]
        $scope.chooseType = '';
        $scope.state = '';
        $scope.selected = '';
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
        $scope.items = [
            {
                id:'001',
                title:'很长的名字意',
                state:'1',
                totalCount:'500',
                currentCount:'23',
                downLine:'12/02 12:12:12',
                belongTo:'小明',
                deviceType:'Android7.0',
                show:true
            },
            {
                id:'002',
                title:'名字1',
                state:'2',
                totalCount:'500',
                currentCount:'23',
                downLine:'12/02 12:12:12',
                belongTo:'小红',
                deviceType:'Android6.0',
                show:true
            },
        ];
        $scope.items.forEach(function (item,index) {
            if(item.state == 1){
                item.state = '正在进行';
            }else if(item.state == 2){
                item.state = '正在进行2';
            }
        });
        /***changeSelect**/
        $scope.stateItems = [
            {state:'正在进行'},
            {state:'正在进行2'}
        ];
        $scope.belongToUserItems = [
            {belongTo:'小明'},
            {belongTo:'小红'},
        ]
        $scope.upStateshow = function () {
            //console.log($scope.taskState.state)//正在进行
            if($scope.taskState == null){
                //window.location.reload();
                $scope.items.forEach(function (item) {
                   item.show =true
                })
                return
            }
            $scope.items.forEach(function (item) {
                if(item.state != $scope.taskState.state){
                    item.show = false
                }else{
                    item.show = true
                }
            })
            //console.log($scope.items)
        };



        $scope.upUsershow = function () {
            //console.log($scope.belongUser.belongTo)
            if($scope.belongUser == null){
                //window.location.reload();
                $scope.items.forEach(function (item) {
                    item.show =true
                })
                return
            }
            $scope.items.forEach(function (item) {
                if(item.belongTo != $scope.belongUser.belongTo){
                    item.show = false
                }else{
                    item.show = true
                }
            })
            //console.log($scope.items)
        };
        $scope.turntoSelf = function () {
           //window.location.reload();
            $scope.items.forEach(function (item) {
                item.show =true
            })
        }
        /**search**/
        $scope.taskSearch = function () {
            console.log($scope.searhContent)
        }


        /***下线 编辑*/
        $scope.downLine = function (index) {
            console.log(index);
            console.log($scope.items[index]);
        }
        $scope.editTask = function (index) {
            console.log(index);
            console.log($scope.items[index]);
        };
    }]);
})