/**
 * Created by 73951 on 2017/3/17.
 */

define(['app','storageUtils',], function (app,storageUtils,serverService) {
    return  app.controller('reviewDetailCtrl',['$scope','$timeout','serverService',function ($scope, $timeout,serverService) {
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


        $scope.searchCheckBydate = function () {

            var data = {
                id:storageUtils.session.getItem('_reviewList_'),
                uid:'',
                date:$scope.subTime,
                status:'',
                page:1,
                rows:100,
            };
            if($scope.chooseType == 1){
                data.uid = $scope.reviewuserID
            }
            if($scope.chooseType == 2){
                data.id = $scope.reviewuserID
            }
            if($scope.tabSelected == 0){
                data.status = 2;//待审核
            }
            if($scope.tabSelected == 1){
                data.status = 3;//审核成功
            }
            if($scope.tabSelected == 2){
                data.status = 4;//审核失败
            }
            console.log(data)
            serverService.getReviewList(data).then(function (data) {
                console.log(data)
                if(data.result.rows && data.result.rows.length>0){
                   storageUtils.session.setItem('searchCheckBydate',data.result.rows);
                   //$scope.$broadcast('searchCheckBydate',data)
                    if(data.result.rows[0].status == 3){
                        $scope.subTime = ''
                        window.location = '#/reviewDetail/reviewDetail/tab1'
                        return
                    }

                   window.location = '#/reviewDetail/reviewDetail/tab2'
                }else{
                    alert('无')
                    $scope.subTime = ''
                }
                $scope.subTime = ''
            })
        }
    }]);
})