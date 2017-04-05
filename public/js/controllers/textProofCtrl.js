/**
 * Created by 73951 on 2017/3/22.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('textProofCtrl',['$scope','serverService',function ($scope,serverService) {

        /*$scope.textProofemit = function () {
            $scope.$emit('textProof',$scope.moniInput)

        }*/
        /*$scope.deleteTextProof = function (e,index) {
            //console.log(angular.element('#delete'+index))
            //console.log($scope.stepItems)
            var length = $scope.componentItems.length;
            $scope.componentItems[index].status = 0;

            serverService.submitComponent($scope.componentItems[index])
                    .then(function (data) {
                        if(data.code == 200){
                            storageUtils.session.setItem('_component_',$scope.componentItems)
                        }
                    })

            $scope.componentItems.splice(index,1);
            /!*$scope.stepItems[stepTempIndex].component.forEach(function (item, index) {
                if(item.status == 0){
                    $scope.stepItems[stepTempIndex].component.splice(index,1);

                }
            })*!/
            /!*$scope.stepItems.forEach(function (item,index) {
                item.component.forEach(function (citem,cindex) {
                    if(citem.status == 0){
                        item.component.splice(cindex,1)
                    }
                })
            })*!/
            storageUtils.session.setItem('_DRAG_',true)
            window.location = '#/reviewList';
        }*/
    }])
})