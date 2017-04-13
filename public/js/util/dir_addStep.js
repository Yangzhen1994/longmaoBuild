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
                $scope.showText = function (index) {
                    $('.showText').css('display','block');
                    var tempArr = []
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    serverService.getComponent(taskId)
                            .then(function (data) {
                                //console.log(data)
                                //把凭证信息存入到session
                                storageUtils.session.setItem('_component_', data.result);
                                var componentList = storageUtils.session.getItem('_component_');
                                if (componentList && componentList != null) {
                                    componentList.forEach(function (item, index) {
                                        if (item.status == 1 && !item.tips_text) {
                                            tempArr.push({id: item.id, order: item.order})
                                        }
                                    })
                                }
                                for (var i = 0; i < $scope.stepItems[index].component.length; i++) {
                                    if ((!$scope.stepItems[index].component[i].tips_text || $scope.stepItems[index].component[i].tips_text == ' ') && $scope.stepItems[index].component[i].status == 1) {
                                        //$scope.$emit('isText',true)
                                        //$scope.stepItems[index].component[i].isText = true
                                        $scope.stepItems[index].component[i].tips_text = '请输入提示文本若请无需请删除';
                                        $('#delete' + i).css('display', 'block');
                                        for (var j = 0; j < tempArr.length; j++) {
                                            if ($scope.stepItems[index].component[i].order == tempArr[j].order) {
                                                $scope.stepItems[index].component[i].id = tempArr[j].id;
                                                $scope.stepItems[index].component[i].task_id = taskId;
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
                            })
                };

                /*文本凭证*/
                $scope.textProof = function (index) {
                    var saved = storageUtils.session.getItem('_saved_');
                    if (!saved) {
                        alert('请先保存任务步骤');
                        return
                    }
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
                        tips_text:'',
                        tips_image:''
                    }
                    $scope.stepItems[index].component.push(data);
                    $scope.componentItems.push(data);
                    $scope.showText(index)
                    /*serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    //storageUtils.session.setItem('_DRAG_',true)
                                    //window.location = '#/reviewList';
                                    serverService.getComponent(taskId)
                                            .then(function (data) {
                                                console.log(data)
                                                //把凭证信息存入到session
                                                storageUtils.session.setItem('_component_', data.result);
                                            })
                                }
                            })*/
                }
                /*图片凭证*/
                $scope.showOtherType = function () {
                    $scope.typePhoto = true
                    $scope.typeCamera = true
                }
                $scope.imgProof = function (index, type) {
                    var saved = storageUtils.session.getItem('_saved_');
                    if (!saved) {
                        alert('请先保存任务步骤');
                        return
                    }
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
                        tips_text:'',
                        tips_image:''
                    };
                    if (type == 3) {
                        data.type = 3
                    }
                    if (type == 4) {
                        data.type = 4
                    }
                    $scope.stepItems[index].component.push(data);
                    $scope.componentItems.push(data);
                    $scope.showText(index)
                    $scope.typePhoto = false;
                    $scope.typeCamera = false;
                    /*serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    serverService.getComponent(taskId)
                                            .then(function (data) {
                                                console.log(data)
                                                //把凭证信息存入到session
                                                storageUtils.session.setItem('_component_', data.result);
                                            })
                                }
                            })*/
                    /* $scope.$emit('addImgProof');*/
                };
                /*位置凭证*/
                $scope.posProof = function (index) {
                    //alert('位置凭证')
                    var saved = storageUtils.session.getItem('_saved_');
                    if (!saved) {
                        alert('请先保存任务步骤');
                        return
                    }
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
                        tips_text:'',
                        tips_image:''
                    }
                    $scope.stepItems[index].component.push(data)
                    $scope.componentItems.push(data);
                    $scope.showText(index)
                    // serverService.submitComponent(data)
                    //         .then(function (data) {
                    //             if (data.code == 200) {
                    //                 serverService.getComponent(taskId)
                    //                         .then(function (data) {
                    //                             console.log(data)
                    //                             //把凭证信息存入到session
                    //                             storageUtils.session.setItem('_component_', data.result);
                    //                         })
                    //             }
                    //         })
                };
                /*录音凭证*/
                $scope.audioProof = function (index) {
                    var saved = storageUtils.session.getItem('_saved_');
                    if (!saved) {
                        alert('请先保存任务步骤');
                        return
                    }
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
                    $scope.showText(index)
                    /*serverService.submitComponent(data)
                            .then(function (data) {
                                if (data.code == 200) {
                                    serverService.getComponent(taskId)
                                            .then(function (data) {
                                                console.log(data)
                                                //把凭证信息存入到session
                                                storageUtils.session.setItem('_component_', data.result);
                                            })
                                }
                            })*/
                };
                /*显示文本*/

                /*显示图片*/
                /*$scope.showImg = function (index) {
                    $('#stempItem' + index).find('.delCircle').css('display', 'block');
                    var tempArr = []
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    serverService.getComponent(taskId)
                            .then(function (data) {
                                //console.log(data)
                                //把凭证信息存入到session
                                storageUtils.session.setItem('_component_', data.result);
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
                                            if ($scope.stepItems[index].component[i].order == tempArr[j].order) {
                                                $scope.stepItems[index].component[i].id = tempArr[j].id;
                                                $scope.stepItems[index].component[i].task_id = taskId;
                                                /!*serverService.submitComponent($scope.stepItems[index].component[i])
                                                        .then(function (data) {
                                                            if (data.code == 200) {

                                                                // storageUtils.session.setItem('_DRAG_',true);
                                                                // window.location = '#/reviewList';
                                                            }
                                                        })*!/
                                                continue
                                            }

                                        }

                                    }

                                }
                            })
                    //storageUtils.session.setItem('_DRAG_',true)
                    //window.location = '#/reviewList';
                };*/

                /*
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
                 })*/
                /***步骤的模板编辑*/
                $scope.stepItems.forEach(function (item,index) {
                    if(!item.oldSteps.title){
                        item.oldSteps.title=''
                    }
                    if(!item.oldSteps.desc){
                        item.oldSteps.desc=''
                    }
                    if(!item.oldSteps.url){
                        item.oldSteps.url=''
                    }
                })
                $scope.showtitle = function (index) {
                    $('#imgUrl'+index+'steptitle').children('input').eq('-1').css('display','block')
                    $('#imgUrl'+index+'steptitle').children('input').eq('-1').blur(function () {
                        $(this).css('display','none')
                    })
                }
                $scope.showdesc = function (index) {
                    $('#imgUrl'+index+'stepdesc').children('textarea').eq('-1').css('display','block')
                    $('#imgUrl'+index+'stepdesc').children('textarea').eq('-1').blur(function () {
                        $(this).css('display','none')
                    })
                }
                /*$scope.showtitle = function (index) {
                    $('#imgUrl'+index+'title').children('input').eq('-1').css('display','block')
                    $('#imgUrl'+index+'title').children('input').eq('-1').blur(function () {
                        $(this).css('display','block')
                    })
                }*/
                /*显示步骤的图片*/
                $scope.showImg = function (index) {
                    stepItems[index].oldSteps.images_list.push('123')
                }
            }
        }

    }])
})