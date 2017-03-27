/**
 * Created by 73951 on 2017/3/17.
 */

define(['app','storageUtils',], function (app,storageUtils,serverService) {
    return  app.controller('reviewDetailCtrl',['$scope','$timeout','serverService',function ($scope, $timeout,serverService) {
        var reviwid = storageUtils.session.getItem('_reviewList_');
        $scope.reviewId = reviwid;
        $scope.chooseType = '';
        $scope.tabSelected = 0;
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
        }
        $scope.items = [{
            subTime:'12:00'
        },{
            subTime:'13:00'
        }]
    }]);
})