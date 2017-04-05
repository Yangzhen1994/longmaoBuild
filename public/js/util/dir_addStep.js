/**
 * Created by 73951 on 2017/3/21.
 */
/**
 * Created by 73951 on 2017/3/20.
 */
/**
 *
 */
define(['app', 'storageUtils'], function (app, storageUtils) {
    app.directive('stepModule', [function () {
        return {
            restrict: "EA",

            templateUrl: 'tpls/stepModule.html',
            controller: function ($scope, serverService) {
                console.log($scope.oldSteps);

                /*$scope.stepModules.forEach(function (item) {
                 console.log(item.title)
                 });*/

                $scope.middleItems = [];
                /*文本凭证*/
                $scope.textProof = function (index) {

                    storageUtils.session.setItem('_comIndex_', index)
                    //console.log($scope.stepItems[index].component)
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 1,
                        task_id: taskId,
                    }
                    $scope.stepItems[index].component.push(data);
                    $scope.componentItems.push(data);

                    serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    storageUtils.session.setItem('_DRAG_',true)
                                    window.location = '#/reviewList';
                                }
                            })
                }
                /*图片凭证*/
                $scope.imgProof = function (index) {
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 2,
                        task_id: taskId,
                    }
                    $scope.stepItems[index].component.push(data);
                    $scope.componentItems.push(data);
                    serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    storageUtils.session.setItem('_DRAG_',true)
                                    window.location = '#/reviewList';
                                }
                            })
                    /* $scope.$emit('addImgProof');*/
                };
                /*位置凭证*/
                $scope.posProof = function (index) {
                    //alert('位置凭证')
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 5,
                        task_id: taskId,
                    }
                    $scope.stepItems[index].component.push(data)
                    $scope.componentItems.push(data);
                    serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    storageUtils.session.setItem('_DRAG_',true)
                                    window.location = '#/reviewList';
                                }
                            })
                };
                /*录音凭证*/
                $scope.audioProof = function (index) {
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    var data = {
                        id: '',
                        order: 10000 - $scope.componentItems.length,
                        regex: '',
                        regex_name: null,
                        status: 1,
                        step_id: $scope.stepItems[index].oldSteps.id,
                        type: 6,
                        task_id: taskId,
                    }
                    $scope.stepItems[index].component.push(data)
                    $scope.componentItems.push(data);
                    serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    storageUtils.session.setItem('_DRAG_',true)
                                    window.location = '#/reviewList';
                                }
                            })
                };
        /*显示文本*/
        $scope.showText = function (index) {
            //alert(index)
            //alert('显示文本')
            //alert(index)
            var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
            for(var i=0;i<$scope.stepItems[index].component.length;i++){
                if((!$scope.stepItems[index].component[i].tips_text || $scope.stepItems[index].component[i].tips_text == ' ') && $scope.stepItems[index].component[i].status == 1){
                    $scope.stepItems[index].component[i].tips_text = '提示文本';
                    $('#delete'+i).css('display','block')
                    serverService.submitComponent($scope.stepItems[index].component[i])
                }

            }
            storageUtils.session.setItem('_DRAG_',true)
            window.location = '#/reviewList';



            /*$('#stempItem' + index).find('.delCircle').css('display', 'block')
            var tempArr = []
            var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
            var componentList = storageUtils.session.getItem('_component_');
            if (componentList && componentList != null) {
                componentList.forEach(function (item, index) {
                    if (item.status == 1 && !item.tips_text) {
                        tempArr.push({id: item.id, order: item.order})
                    }
                })
            }
            console.log(tempArr)
            for(var i=0;i<$scope.stepItems[index].component.length;i++){
                if((!$scope.stepItems[index].component[i].tips_text || $scope.stepItems[index].component[i].tips_text == ' ') && $scope.stepItems[index].component[i].status == 1){
                    $scope.stepItems[index].component[i].tips_text = '提示文本';
                    $scope.stepItems[index].component[i].isText = true;
                    for (var j = 0; j < tempArr.length; j++) {
                        if ($scope.stepItems[index].component[i].order = tempArr[j].order) {
                            $scope.stepItems[index].component[i].id = tempArr[j].id;
                            var flag = i
                            serverService.submitComponent($scope.stepItems[index].component[flag])
                                    .then(function (data) {
                                        if (data.code == 200) {

                                            // storageUtils.session.setItem('_DRAG_',true);
                                            // window.location = '#/reviewList';
                                        }
                                    })

                        }

                    }
                    $('#delete'+i).css('display','block')

                }

            }*/
            //storageUtils.session.setItem('_DRAG_',true)
           // window.location = '#/reviewList';


            //storageUtils.session.setItem('_DRAG_',true)
            //window.location = '#/reviewList';
        };
        /*显示图片*/
        $scope.showImg = function (index) {
            $('#stempItem' + index).find('.delCircle').css('display', 'block');
            var tempArr = []
            var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
            var componentList = storageUtils.session.getItem('_component_');
            if (componentList && componentList != null) {
                componentList.forEach(function (item, index) {
                    if (item.status == 1 && !item.tips_image) {
                        tempArr.push({id: item.id, order: item.order})
                    }
                })
            }
            for (var i = 0; i < $scope.stepItems[index].component.length; i++) {
                if ((!$scope.stepItems[index].component[i].tips_image || $scope.stepItems[index].component[i].tips_image == ' ') && $scope.stepItems[index].component[i].status == 1) {
                    //$scope.$emit('isText',true)
                    //$scope.stepItems[index].component[i].isText = true
                    $scope.stepItems[index].component[i].tips_image = true;
                    $('#delete' + i).css('display', 'block');
                    for (var j = 0; j < tempArr.length; j++) {
                        if ($scope.stepItems[index].component[i].order = tempArr[j].order) {
                            $scope.stepItems[index].component[i].id = tempArr[j].id;
                            serverService.submitComponent($scope.stepItems[index].component[i])
                                    .then(function (data) {
                                        if (data.code == 200) {

                                            // storageUtils.session.setItem('_DRAG_',true);
                                            // window.location = '#/reviewList';
                                        }
                                    })
                            continue
                        }

                    }

                }

            }
            //storageUtils.session.setItem('_DRAG_',true)
            //window.location = '#/reviewList';
        };
                $scope.$on('deleteOneShowText', function (data) {
                    //console.log(data)
                    for (var i = 0; i < $scope.middleItems.length; i++) {
                        if ($scope.middleItems[i] == data.targetScope.middleItem) {
                            $scope.middleItems.splice(i, 1)
                        }
                    }
                });
                $scope.$on('deleteImg', function (data) {
                    for (var i = 0; i < $scope.middleItems.length; i++) {
                        if ($scope.middleItems[i] == data.targetScope.middleItem) {
                            $scope.middleItems.splice(i, 1)
                        }
                    }
                    $scope.$emit('deleteImgTop')
                });

                $scope.$on('addImgProof', function () {
                    console.log($scope.stepItems)
                })
            }
        }

    }])
})