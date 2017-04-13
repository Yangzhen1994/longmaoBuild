/**
 * Created by 73951 on 2017/4/13.
 */
/**
 * Created by 73951 on 2017/3/23.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('showsteptextModule',['serverService',function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/showstepText.html',
            link:function (scope,el,attr) {
                el.click(function () {
                    el.find('textarea').eq(0).css('display','block')
                })
                el.find('textarea').eq(0).blur(function () {
                    $(this).css('display','none')
                })
            },
            controller:function ($scope) {

                /* $scope.deleteOne = function (e,index) {
                 e.stopPropagation()
                 console.log($scope.componentItems)
                 $scope.componentItems[index].tips_text = ' '
                 $scope.componentItems[index].isText = false
                 serverService.submitComponent($scope.componentItems[index])
                 .then(function (data) {
                 /!*if(data.code == 200){
                 storageUtils.session.setItem('_component_',$scope.componentItems)
                 }*!/
                 })
                 //storageUtils.session.setItem('_DRAG_',true)
                 //window.location = '#/reviewList';
                 }*/
            }
        }

    }])
})