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
    return  app.controller('reviewCtrl',['$rootScope','$scope','serverService',function ($rootScope,$scope, $timeout,serverService) {
        $('.left').css('height',738);
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
        $scope.items = [
            {
                id:'r001',
                title:'很长的名字意',
                state:'1',
                totalCount:'500',
                currentCount:'23',
                downLine:'12/02 12:12:12',
                belongTo:'小明',
                reviewCount:100
                //1reviewCount:$rootScope.data[0].a
            },
            {
                id:'r002',
                title:'名字1',
                state:'2',
                totalCount:'500',
                currentCount:'23',
                downLine:'12/02 12:12:12',
                belongTo:'小明',
                reviewCount:'111'
            }
        ]
        $scope.items.forEach(function (item,index) {
            if(item.state == 1){
                item.state = '正在进行';
            }else if(item.state == 2){
                item.state = '正在进行2';
            }
        });
        $scope.turnToReviewDetail = function(index){
            storageUtils.session.setItem('_reviewList_',$scope.items[index].id);
            window.location = '#/reviewDetail'
        }



        /**导出**/
        $scope.export = function (item,index) {

            console.log(item)
        }
        /*导入*/
        $scope.file_upload = function (data,obj) {
            //console.log(data[0]);
            var index = obj.id.substr(-1)
            //console.log($scope.items[index])
        }



        /***reveiewSearch**/
        $scope.reveiewSearch = function () {
            console.log($scope.searchReviewContent)
        }
    }]);
})