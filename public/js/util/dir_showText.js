/**
 * Created by 73951 on 2017/3/23.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('showtextModule',['serverService',function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/showText.html',
            link:function (scope,el,attr) {
                scope.stepIndex = $(this).parents('li')[1].id.substr(-1,1);
                el.click(function () {
                    el.find('input').eq(0).css('visibility','visible');
                    //scope.isText = true;
                    //console.log(scope.isText)
                });
                /*el.find('input').change(function () {
                    if($(this).val() == ''){
                        el.find('input').eq(0).css('visibility','visible');
                        el.find('input').eq(0).focus();
                    }
                })*/
                el.find('input').blur(function () {
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    //scope.isText = false;
                    this.style.visibility = 'hidden';
                    if($(this).parents('li')[0].id.length == 16){
                        var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                    }else
                    if($(this).parents('li')[0].id.length == 15){
                        var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                    }else{
                        //alert($(this).parents('li')[0].id)
                        var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                    }
                    var stepIndex = $(this).parents('li')[1].id.substr(-1,1);
                    console.log(stepIndex)
                    scope.stepItems[stepIndex].component[comIndex].task_id = taskId
                    /*serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                            .then(function () {

                            })*/
                    //serverService.submitComponent(scope.componentItems[comIndex])
                });
                el.find('img').click(function (e) {
                    e.stopPropagation()
                    console.log($(this).parents('li'))
                    if($(this).parents('li')[0].id.length == 16){
                        var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                    }else
                    if($(this).parents('li')[0].id.length == 15){
                        var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                    }else{
                        //alert($(this).parents('li')[0].id)
                        var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                    }
                    var stepIndex = $(this).parents('li')[1].id.substr(-1,1);
                    //scope.componentItems[comIndex].tips_text = ' ';
                    //scope.componentItems[comIndex].isText = ' ';
                    scope.stepItems[stepIndex].component[comIndex].tips_text = ' ';
                    scope.stepItems[stepIndex].component[comIndex].isText = ' ';
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    scope.stepItems[stepIndex].component[comIndex].task_id = taskId
                    //$(this).parents('.showText').eq(0).css('display','none');
                    $(this).css('display','none')
                    scope.$apply();
                    /*serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                            .then(function (data) {
                                if(data.code == 200){

                                }
                            })*/
                    //
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