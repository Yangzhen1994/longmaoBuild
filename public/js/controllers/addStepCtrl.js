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
            $timeout(function () {
                $('.left').css('height',$('.newStep').innerHeight()+17)
            },100)


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
                            storageUtils.session.setItem('_saved_',true);
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
        },600)





        //$scope.flagIndex = 0
        /*$scope.sortableOptions = {
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

                         /!*  $('.temp_md_ul').sortable( "refresh" );
                            $( ".selector" ).sortable( "refreshPositions" );*!/

                        }
        };*/
                    $scope.step_upload = function (obj) {
                        $scope.step_upload = function (obj) {
                            //获取到 步骤index
                            // event.stopPropagation()
                            var stepIndex= obj.parentNode.parentNode.parentNode.parentNode.id.substr(-1,1)
                            var stepImgList = $('#imgUrl'+stepIndex).find('p').eq(0).find('img');
                            console.log(stepImgList)
                            for(var i= 0;i<stepImgList.length;i++){
                                stepImgList[i].setAttribute('id','step'+stepIndex+'Img'+i);
                                var div = document.createElement('div');
                                div.id = 'step'+stepIndex+'ImgContainer'+i
                                $('#imgUrl'+stepIndex).find('p').eq(0).prepend(div);
                                function sys_file_sdk_qiniu_token(file) {
                                    var token = $.ajax({
                                        url: 'http://manager.test.shandianshua.com/sdk/qiniu/token.json',
                                        method: 'POST',
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        data: {bucket: 'totoro-task'},
                                        dataType: 'json',
                                        async: false,
                                    }).responseText;

                                    return jQuery.parseJSON(token).result;
                                }

                                function showPreview (file) {

                                }
                                var hashArr = []
                                var uploader = Qiniu.uploader({
                                    runtimes: 'html5,html4',
                                    browse_button: 'step'+stepIndex+'Img'+i,
                                    container: 'step'+stepIndex+'ImgContainer'+i,
                                    //drop_element: 'sys-file-dialog-list'+comIndex,
                                    max_file_size: '100mb',
                                    //dragdrop: true,
                                    chunk_size: '5mb',
                                    multi_selection: true,
                                    get_new_uptoken: true,
                                    uptoken_func: sys_file_sdk_qiniu_token,
                                    domain: ' http://task.totoro.cdn.shandianshua.com',
                                    unique_names: true,
                                    auto_start: true,
                                    init: {
                                        'FilesAdded': function(up, files) {

                                            /*// 文件添加进队列后，处理相关的事情
                                             alert('添加了文件');
                                             console.log(files
                                             );
                                             for (var i = 0; i < files.length; i++) {


                                             showPreview (files[i]);
                                             }
                                             $('#sys-file-dialog-upload-btn'+scope.stepIndex+comIndex).attr("src",'../img/moduleImg/ic_add_a_photo_black_24dp.png');*/

                                        },
                                        'BeforeUpload': function(up, file) {
                                            // 每个文件上传前，处理相关的事情

                                            alert('准备上传')
                                        },
                                        'UploadProgress': function(up, file) {
                                            // 每个文件上传时，处理相关的事情
                                        },
                                        'FileUploaded': function(up, file, info) {
                                            // 每个文件上传成功后，处理相关的事情
                                            // 其中info是文件上传成功后，服务端返回的json，形式如：
                                            // {
                                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                            //    "key": "gogopher.jpg"
                                            //  }
                                            // 查看简单反馈
                                            var domain = up.getOption('domain');
                                            var res = jQuery.parseJSON(info);
                                            var str = ''
                                            for(var i=0;i<hashArr.length;i++){
                                                str += domain+"/"+hashArr[i].key+'\n'
                                            }
                                            console.log(info)
                                            //var sourceLink = domain +"/"+ res.key+'\n'; //获取上传成功后的文件的Url
                                            //console.log(sourceLink);
                                            //scope.stepItems[stepIndex].component[comIndex].tips_image = str
                                            //console.log(scope.stepItems[stepIndex].component[comIndex]);


                                        },
                                        'Error': function(up, err, errTip) {
                                            //上传出错时，处理相关的事情
                                            console.log(err)
                                        },
                                        'UploadComplete': function() {
                                            //队列文件处理完毕后，处理相关的事情

                                        },
                                        'Key': function(up, file) {
                                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                            // 该配置必须要在unique_names: false，save_key: false时才生效
                                            var key = "";
                                            // do something with key here
                                            return key
                                        }
                                    }
                                })
                            }

                        }
                    }
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
                        //var imagesArr = []

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
                            if(!data.title){
                                data.title = ' ';
                            }


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
                            data.skip = 0;//默认设置成否：可以跳过
                            data.status = 1
                            console.log(data);
                            storageUtils.session.setItem('_savedStepIndex_',i);
                            serverService.saveStep(data)
                                    .then(function (data) {
                                        if(data.code == 200){
                                            console.log('保存成功');
                                            var index = storageUtils.session.getItem('_savedStepIndex_');
                                            console.log($scope.stepItems[index].component)
                                            storageUtils.session.removeItem('_oldStep_');
                                            storageUtils.session.removeItem('_TaskId_');
                                            storageUtils.session.removeItem('_newTaskid_');
                                            storageUtils.session.setItem('_saved_',true);
                                            window.location.reload()

                                        }
                                    });
                            imagesStr = '';
                        }



                       // serverService.getStepById(storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_'))
                        //window.location.reload()

                    }

    }]);
})