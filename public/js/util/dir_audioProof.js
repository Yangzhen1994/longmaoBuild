/**
 * Created by 73951 on 2017/3/21.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('audioproofModule',['serverService',function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/audioProof.html',
            link:function (scope,el,attr) {
                    el.click(function () {
                        el.find('textarea').eq(0).css('visibility','visible');
                        el.find('textarea').eq(0).on('click',function (e) {
                            e = window.event || event;
                            e.stopPropagation()
                        })
                    })



                    el.find('textarea').eq(0).on('blur',function () {
                        $(this).css('visibility','hidden');
                        if($(this).parents('li')[0].id.length == 16){
                            var comIndex = $(this).parents('li')[0].id.substr(-3, 3);

                        }else
                        if($(this).parents('li')[0].id.length == 15){
                            var comIndex = $(this).parents('li')[0].id.substr(-2, 2);

                        }else{
                            //alert($(this).parents('li')[0].id)
                            var comIndex = $(this).parents('li')[0].id.substr(-1, 1);
                        }
                        var stepIndex = $(this).parents('li')[1].id.substr(-1, 1);
                        var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                        scope.stepItems[stepIndex].component[comIndex].task_id = taskId
                        serverService.submitComponent( scope.stepItems[stepIndex].component[comIndex])

                    })
                    el.find('img').eq(0).click(function (e) {
                        //alert(1)
                        var img = el.find('img')
                        e.stopPropagation();
                        console.log(img.parents('li'));
                        if(img.parents('li')[0].id.length == 16){
                            var comIndex = img.parents('li')[0].id.substr(-3, 3);

                        }else
                        if(img.parents('li')[0].id.length == 15){
                            var comIndex = img.parents('li')[0].id.substr(-2, 2);

                        }else{
                            //alert($(this).parents('li')[0].id)
                            var comIndex = img.parents('li')[0].id.substr(-1, 1);
                        }

                        //comIndex = comIndex -1
                        var stepIndex = img.parents('li')[1].id.substr(-1, 1);
                        //scope.componentItems[comIndex].status = 0;
                        //scope.componentItems[comIndex].isText = ' ';
                        //console.log(scope.stepItems[stepIndex].component)
                        //alert(comIndex)
                        scope.stepItems[stepIndex].component[comIndex].status = 0;

                        var toDel = scope.stepItems[stepIndex].component[comIndex];
                        console.log(toDel)

                        var comId = storageUtils.session.getItem('_component_');
                         toDel.id = comId[comIndex].id
                         toDel.task_id = storageUtils.session.getItem('_TaskId_');
                        scope.stepItems[stepIndex].component.splice(comIndex,1)
                        for(var i = 0;i<comId.length;i++){
                            if(comId[i].order ==  toDel.order){
                                comId[i].status = 0;
                                serverService.submitComponent(comId[i])
                            }
                        }
                        serverService.submitComponent(toDel)
                                .then(function (data) {
                                    if (data.code == 200) {
                                        //storageUtils.session.setItem('_DRAG_',true);
                                        //window.location = '#/reviewList';
                                    }
                                });
                    })

            },

        }

    }])
})