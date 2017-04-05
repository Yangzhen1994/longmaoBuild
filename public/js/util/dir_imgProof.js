/**
 * Created by 73951 on 2017/3/15.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('imgproofModule',['serverService',function (serverService) {
        return {
            restrict: "EA",

            templateUrl: 'tpls/imgProof.html',
            link:function (scope,el,attr) {
                var slideInput = document.getElementById('slideInput');
                /*el.on('click',function () {
                 //scope.isshow = true;
                 el.find('input').eq(0).css('visibility','visible')
                 el.find('input').eq(0).on('blur',function () {
                 $(this).css('visibility','hidden');
                 })
                 })*/
                el.click(function (e) {
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

                    //scope.stepItems[stepIndex].component[comIndex].isText = ' ';



                    // console.log(scope.stepItems[stepIndex].component)


                    //$(this).css('display', 'none')


                })

            }
        }

    }])
})