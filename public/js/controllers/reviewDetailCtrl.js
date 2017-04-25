/**
 * Created by 73951 on 2017/3/17.
 */

define(['app','storageUtils',], function (app,storageUtils,serverService) {
    return  app.controller('reviewDetailCtrl',['$scope','$rootScope','$timeout','serverService',function ($scope,$rootScope,$timeout,serverService) {
        $timeout(function () {
            $('.left').height($('.right').height())
        },100)
        var reviwid = storageUtils.session.getItem('_reviewList_');
        $scope.reviewId = reviwid;
        $scope.chooseType = '';
        $scope.tabSelected = 0;
        $scope.subTime = '';
        $scope.setChoose = function (type) {
            $scope.chooseType = type
        }
        var atab1 = $('.tabs_header_1');
        atab1.click(function () {
            window.location = '#/reviewDetail/reviewDetail/tab1'
        });

        atab1.trigger('click');
        atab1.off('click');
        $scope.changeTabBorder = function (index) {
            $scope.tabSelected = index
        };
       /* $scope.changeTime = function () {
            $scope.$apply()
        }*/
        $scope.clearTime = function () {
            $scope.subTime = ''
        }
        $scope.searchCheckBydate = function () {
            if(!$scope.reviewuserID){
                alert('输入不能为空');
                return
            }
            if(!$scope.chooseType){
                alert('请选择搜索类别');
                return
            }
            var data0 = {
                id:storageUtils.session.getItem('_reviewList_'),
                uid:'',
                date:$scope.subTime,
                status:'',
                page:1,
                rows:10,
            };
            if($scope.chooseType == 1){
                data0.uid = $scope.reviewuserID

            }
            if($scope.chooseType == 2){
                data0.id = $scope.reviewuserID
                storageUtils.session.setItem('_reviewList_',data0.id);
                $scope.reviewId = data0.id
            }
            if($scope.tabSelected == 0){
                data0.status = 2;//待审核
                $scope.resmasg = '此任务的待审核'
            }
            if($scope.tabSelected == 1){
                data0.status = 3;//审核成功
                $scope.resmasg = '此任务的审核成功'
            }
            if($scope.tabSelected == 2){
                data0.status = 4;//审核失败
                $scope.resmasg = '此任务的审核失败'
            }
            console.log(data0)
            serverService.getReviewList(data0).then(function (data) {
                console.log(data)
                if(data.result.rows && data.result.rows.length>0){
                   storageUtils.session.setItem('searchCheckBydate',data.result);

                   //$scope.$broadcast('searchCheckBydate',data)
                    if(data.result.rows[0].status == 3){
                        //$scope.subTime = '';

                        window.location = '#/reviewDetail/reviewDetail/tab1'
                        return
                    }

                   window.location = '#/reviewDetail/reviewDetail/tab2'
                }else{
                    alert($scope.resmasg+'无');
                    //$scope.subTime = '';
                    //$scope.reviewuserID = '';
                    storageUtils.session.setItem('searchCheckBydate',data.result);
                    if($scope.tabSelected == 0){
                        storageUtils.session.setItem('_FLAG_',true)
                        window.location = '#/reviewDetail/reviewDetail/tab3'

                    }
                    if($scope.tabSelected == 1){
                        storageUtils.session.setItem('_FLAG_',true)
                        window.location = '#/reviewDetail/reviewDetail/tab1'

                    }
                    if($scope.tabSelected == 2){
                        storageUtils.session.setItem('_FLAG_',true)
                        window.location = '#/reviewDetail/reviewDetail/tab2'

                    }



                }
                $scope.subTime = ''
            })
        }
    }]);
})