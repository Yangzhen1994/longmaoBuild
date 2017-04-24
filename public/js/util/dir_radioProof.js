/**
 * Created by 73951 on 2017/4/24.
 */
/**
 * Created by 73951 on 2017/3/21.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('radioproofModule',['serverService',function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/radioProof.html',
            link:function (scope,el,attr) {
                if(el.parents('li')[0].id.length == 16){
                    var comIndex0 = el.parents('li')[0].id.substr(-3, 3);

                }else
                if(el.parents('li')[0].id.length == 15){
                    var comIndex0 = el.parents('li')[0].id.substr(-2, 2);

                }else{
                    //alert($(this).parents('li')[0].id)
                    var comIndex0 = el.parents('li')[0].id.substr(-1, 1);
                }
                scope.stepIndex = el.parents('ul')[0].id.substr(-1,1);
                scope.optionsArr = scope.stepItems[scope.stepIndex].component[comIndex0].options.split('\n')
                //scope.optionItems = componentItem.options.split('\n');
                scope.changeOptions = function (index) {
                    if(el.parents('li')[0].id.length == 16){
                        var comIndex = el.parents('li')[0].id.substr(-3, 3);

                    }else
                    if(el.parents('li')[0].id.length == 15){
                        var comIndex = el.parents('li')[0].id.substr(-2, 2);

                    }else{
                        //alert($(this).parents('li')[0].id)
                        var comIndex = el.parents('li')[0].id.substr(-1, 1);
                    }
                    console.log(comIndex)
                    var optionsArr = scope.stepItems[scope.stepIndex].component[comIndex].options.split('\n');
                    optionsArr[index] = $('#input'+scope.stepIndex+index).val()
                    scope.stepItems[scope.stepIndex].component[comIndex].options = optionsArr.join('\n')
                }
                el.find('img').eq(-1).click(function (e) {
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
                    if(scope.stepItems[stepIndex].component[comIndex].id){
                        var toDel = scope.stepItems[stepIndex].component[comIndex];
                        toDel.task_id = storageUtils.session.getItem('_TaskId_');
                        if(toDel.tips_text == '点击输入内容'){
                            toDel.tips_text = ' '
                        }
                        serverService.submitComponent(toDel)
                    }


                    scope.stepItems[stepIndex].component.splice(comIndex,1)

                    scope.$apply();
                    /* scope.stepItems[stepIndex].component[comIndex].status = 0;

                     var toDel = scope.stepItems[stepIndex].component[comIndex];
                     console.log(toDel)

                     var comId = storageUtils.session.getItem('_component_');
                     if(comId.length>0){
                     toDel.id = comId[comIndex].id;
                     }
                     toDel.task_id = storageUtils.session.getItem('_TaskId_');
                     scope.stepItems[stepIndex].component.splice(comIndex,1);
                     scope.$apply();*/
                    /*if(toDel.tips_text == '点击输入内容'){
                     toDel.tips_text = ' '
                     }
                     for(var i = 0;i<comId.length;i++){
                     if(comId[i].order ==  toDel.order){
                     comId[i].status = 0;
                     comId[i].task_id = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
                     if(comId[i].tips_text == '点击输入内容'){
                     comId[i].tips_text = ' '
                     }
                     serverService.submitComponent(comId[i])
                     }
                     }
                     serverService.submitComponent(toDel)
                     .then(function (data) {
                     if (data.code == 200) {
                     //storageUtils.session.setItem('_DRAG_',true);
                     //window.location = '#/reviewList';
                     }
                     });*/
                })

            },

        }

    }])
})