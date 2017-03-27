/**
 * Created by 73951 on 2017/3/22.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('textProofCtrl',['$scope','serverService',function ($scope,serverService) {
        $scope.moniInput = '请填写';
        /*$scope.textProofemit = function () {
            $scope.$emit('textProof',$scope.moniInput)
        }*/
    }])
})