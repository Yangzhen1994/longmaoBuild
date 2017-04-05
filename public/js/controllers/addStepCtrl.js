/**
 * Created by 73951 on 2017/3/21.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('addStepCtrl',['$scope','Upload','$timeout','serverService',function ($scope,Upload,$timeout,serverService) {
       $('.left').css('height',846);
        //获取当前任务id
        var taskId = storageUtils.session.getItem('_TaskId_');
        var newtaskId = storageUtils.session.getItem('_newTaskid_');
        //var oldStep = storageUtils.session.getItem('_oldStep_');

        //delete/
        $scope.removeStep = function(index){
            $scope.stepItems[index].oldSteps.status = 0;
            if(!$scope.stepItems[index].oldSteps.task_id){
                $scope.stepItems[index].oldSteps.task_id = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
            }

            if(!$scope.stepItems[index].oldSteps.order){
                $scope.stepItems[index].oldSteps.order = $scope.stepItems.length - index;
            }
            var data = $scope.stepItems[index].oldSteps;
            $scope.stepItems.splice(index,1);
            $scope.stepCount --;
            for(var i = index;i<$scope.stepItems.length; i++){
                $scope.stepItems[i].index --
            }
            //同步height
            $('.left').css('height',Math.round($('.newStep').innerHeight()/2)+432);
            if(0 == $scope.stepCount){
                $('.left').css('height',846);
            }
           // console.log($scope.stepItems[index].oldSteps);
            serverService.saveStep(data).then(function(data){
                if(data.code == 200){

                }
            })



        };
        /*添加模板*/
        var usingArr = []
        $scope.stepItems = []
        $scope.addStepModule = function (old) {

                $scope.stepItems.push({
                    showValue:1,
                    index:$scope.stepCount+1,
                    oldSteps:$scope.oldSteps[old],
                    component:[],
                });

                if (!$scope.stepItems[$scope.stepItems.length-1].oldSteps) {
                    $scope.stepItems[$scope.stepItems.length-1].oldSteps = {}
                    $scope.stepItems[$scope.stepItems.length-1].oldSteps.images_list = ['']
                } else if ($scope.stepItems[$scope.stepItems.length-1].oldSteps.images_list == null || $scope.stepItems[$scope.stepItems.length-1].oldSteps.images_list.length == 0) {
                    $scope.stepItems[$scope.stepItems.length-1].oldSteps.images_list = ['']
                }


                //对status为0 的 进行 过滤
                var testStep = $scope.stepItems[old] || $scope.stepItems[$scope.stepItems.length-1]
                if(testStep.oldSteps.status == 1 || testStep.oldSteps.status == 1 ){
                   usingArr.push(testStep);
                }
            $scope.stepCount ++;//同步步骤编号顺序
            $('.left').css('height',$('.newStep').innerHeight()+627)

        };
        /*if(taskId == 'undefined' && !newtaskId){
            alert('请新建或至少选择一个任务编辑');
            window.location.reload()
        }*/
        //$scope.stepCount = 0;
        /*新建步骤*/
        if(newtaskId && newtaskId != 'undefined'){
            serverService.getStepById(newtaskId)
                    .then(function (data) {
                        console.log(data.result);
                        $scope.stepCount = 0;

                        $scope.oldSteps = [{
                            images_list:['']
                        },
                            {
                                images_list:['']
                            }];
                        return
                    })
        }

        //ajax getStepById
        if(taskId && taskId != 'undefined'){
            serverService.getStepById(taskId)
                    .then(function (data) {
                        console.log(data.result);
                        if(data.result.length == 0){
                            alert('还没有步骤请添加');
                            $scope.stepCount = 0;

                            $scope.oldSteps = [{
                                images_list:['']
                            },
                                {
                                    images_list:['']
                                }];
                        }else{
                            $scope.oldSteps = data.result;
                            //存入seesion
                            storageUtils.session.setItem('_oldStep_',$scope.oldSteps);
                            var oldStep = storageUtils.session.getItem('_oldStep_');

                            $scope.stepCount = 0;
                            if(oldStep && oldStep.length>0){
                                for(var i = 0;i<oldStep.length;i++){
                                    $scope.addStepModule(i);
                                }
                                $scope.stepItems = usingArr
                            }
                        }
                        console.log(data.result);

                    })

        }

        //获取到凭证信息

        $timeout(function () {
            var resultArr = []
            var componentMsg = storageUtils.session.getItem('_component_');
            if(componentMsg && componentMsg!=null){
                $scope.componentItems = componentMsg;
                for(var c=0 ;c<$scope.componentItems.length;c++){
                    for(var step=0;step<$scope.stepItems.length;step++){
                        if($scope.componentItems[c].step_id == $scope.stepItems[step].oldSteps.id){
                            $scope.stepItems[step].component.push(
                                    $scope.componentItems[c]
                            )
                        }
                    }
                }
            }else{
                $scope.componentItems  = [];
            }
        },100)





        //$scope.flagIndex = 0
        $scope.sortableOptions = {
                        // 数据有变化
                        start:function (e,ui) {
                            oldPosition = ui.item[0].offsetTop
                            console.log(ui)
                            console.log(ui.item[0].offsetTop)
                        },
                        change:function (e,ui) {
                            newPosition = ui.item[0].offsetTop;
                            if(newPosition<oldPosition){
                                var num = Math.ceil((oldPosition - newPosition) / ui.item[0].clientHeight)
                                console.log(ui.item[0].id.substr(-1,1))//当前拖拽的index
                                var comIndex = ui.item[0].id.substr(-1,1)
                                $scope.componentItems[comIndex].order += (num);
                                serverService.submitComponent($scope.componentItems[comIndex])
                                        .then(function (data) {
                                            if(data.code == 200){

                                            }
                                        })
                            }
                            if(newPosition>oldPosition){
                                var num = Math.ceil((newPosition - oldPosition) / ui.item[0].clientHeight);
                                var comIndex = ui.item[0].id.substr(-1,1);
                                $scope.componentItems[comIndex].order -= (num);
                                serverService.submitComponent($scope.componentItems[comIndex])
                                        .then(function (data) {
                                            if(data.code == 200){

                                            }
                                        })
                            }
                            console.log(ui.item[0].offsetTop)
                        },
                        update: function (e, ui) {
                            console.log("update");
                            // console.log(e);
                            // console.log(ui)


                            //需要使用延时方法，否则会输出原始数据的顺序，可能是BUG
                        },

                        // 完成拖拽动作
                        stop: function (e, ui) {
                            console.log(ui.item[0].offsetTop)
                            $scope.flagindex ++
                            storageUtils.session.setItem('_DRAG_',true);
                            //storageUtils.session.setItem('_component_',$scope.componentItems);
                            window.location = '#/reviewList';

                         /*  $('.temp_md_ul').sortable( "refresh" );
                            $( ".selector" ).sortable( "refreshPositions" );*/

                        }
                    };

                    /*上一项 保存任务*/
                    $scope.asprePage = function () {
                        //操作
                        window.location = '#/addTask'
                    };
                    $scope.picFileArr = []
                    $scope.$on('pic',function(event,data) {
                        $scope.picFileArr.push(data);
                        //父级能得到值
                    });
                    $scope.$on('delPic',function(index) {
                        $scope.picFileArr.splice(index,1);
                        //console.log($scope.picFileArr)
                        //父级能得到值
                    });
                    $scope.$on('deleteImgTop',function () {
                        var picLength = $scope.picFileArr.length;

                    })

                    $scope.assaveTask = function () {
                        var middleViewList = $('.middleView');
                        //console.log($scope.picFileArr)


                        middleViewList = Array.from(middleViewList);
                        $scope.result = []
                        middleViewList.forEach(function (item,index) {
                            var liLists = item.getElementsByTagName('li');
                            for(var i=0;i<liLists.length;i++){
                                $scope.result.push(liLists[i].innerText)
                            }
                        });

                        $scope.result.forEach(function (item,index) {
                            if((typeof item =='string')){
                                $scope.result[index] = item.replace(/[\r\n]/g, "");
                                $scope.result[index] = item.replace(/(^\s*)|(\s*$)/g, "")
                            }
                        });
                        for(var r=0;r<$scope.result.length;r++){
                            if($scope.result[r] == ''){
                                $scope.result.splice(r,1);
                                r--;
                            }
                        }
                        var newResult = $scope.result.concat($scope.picFileArr);
                        //console.log(newResult);
                        /**id:
                         title:1
                         desc:1
                         url:
                         images:
                         order:1
                         skip:0
                         status:1
                         task_id:1226*/
                        var imagesArr = []

                        var imagesStr = ''
                        // $.each(images,function (index,item) {
                        //     imagesStr += (item.value+'\n')
                        // });
                        // console.log(imagesStr)
                        //console.log($scope.middleItems);




                        for(var i= 0 ;i<$scope.stepItems.length;i++){
                            console.log($scope.stepItems[i].oldSteps);
                            var images = document.getElementById('imgUrl'+i);
                            var imagesItem = images.querySelectorAll('.imgUrl');
                            $.each(imagesItem,function (index,item) {
                                imagesStr += (item.value+'\n')
                            });
                            var data = $scope.stepItems[i].oldSteps;
                            data.images = imagesStr;
                            if(!data.order){
                                data.order = $scope.stepItems.length - i -1;
                            }

                            data.task_id = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
                            if(!data.id){
                                data.id = ''
                            }
                            if(!data.url){
                                data.url = ''
                            }
                            data.skip = 0;
                            data.status = 1
                            console.log(data);
                            serverService.saveStep(data)
                                    .then(function (data) {
                                        if(data.code == 200){
                                            console.log('保存成功');

                                            storageUtils.session.removeItem('_oldStep_');
                                            storageUtils.session.removeItem('_TaskId_');
                                            storageUtils.session.removeItem('_newTaskid_');

                                            window.location.reload()

                                        }
                                    });
                            imagesStr = '';
                        }
                        //window.location.reload()


                        /***点击图片凭证***/
                        $scope.$on('toStepItems',function () {
                            alert(1)
                        })


                        $scope.$on('isText',function (data) {
                            alert(data)
                            $scope.isText = data
                        })
                    }

    }]);
})