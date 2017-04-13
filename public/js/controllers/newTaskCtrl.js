/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return app.controller('newTaskCtrl',['$scope','$timeout','serverService', function ($scope, $timeout,serverService) {
        $('.left').css('height',738);

        var editTask = storageUtils.session.getItem('editData');


        if(editTask){
            $scope.task = editTask;
            console.log($scope.task)
        }else{
            $scope.task = {
                title:'',
                desc:'',
                num:'',
                start_time:'',
                end_time:'',
                task_free_num:'',
                share_award:'',
                amount:'',
                max_check_time:'',
                max_submit_time:'',
                order:'',
                max_submit:'',
                tag_id:'',
                region_filter:''
            }
        }
        serverService.getSelectData()
                .then(function (data) {
                    $scope.areaItems = data.result;
                    $scope.areaItems.push({
                        value:'全国',
                        code:''
                    })
                    $scope.areaItems.forEach(function (item,index) {
                        if(item.code ==  $scope.task.region_filter){
                            $scope.currentArea =item.value;
                        }
                    })
                    if(!$scope.task.region_filter || $scope.task.region_filter ==''){
                        $scope.currentArea ='全国';
                    }
                })
        $scope.newtaskTitle = '请输入标题';
        $scope.newTaskCount = '任务个数';
        $scope.isshow = false;
        $scope.redOne = '点我试一下';
        /*格式title*/
        //$scope.title = $scope.task.title.replace(/&nbsp/g,'');
        //$scope.title = $scope.title.replace(/;/g,'');
        //console.log($scope.title)
        /*格式num*/
        //$scope.taskNum = $scope.task.num.split(';')[3];
        //$scope.remainTask = 1*$scope.taskNum - $scope.task.num.split('>')[1].split('<')[0]*1;
        //console.log($scope.task.num.split(';')[0]*1)
        /*格式amount*/
        //$scope.amount = $scope.task.amount.replace(/元/g,'')
        /*$scope.task = {
            newtaskTitle:'请输入标题',
            newtaskCount:'',
            summary: '龙猫最赚钱的任务就是特工任务。他是这样\n做的: \n 1.点领取任务按钮领取这个任务; \n 2.领取完毕按着要求一步步做任务; \n 3.提交凭证交给龙猫 \n 4.龙猫审核通过后钱就加到你余额了！',
            sharePrice: '',
            startTime: '',
            endTime:'',
            price:'',//单价
            reviewTime:'',//最长审核时间
            userGetTime:'',//用户领取时间
            maxSubCount:'',//最大提交次数
            showArea:'',//显示区域
            lineVersion:'',//上线版本
            showOther:'',//显示顺序
        };*/




        /*日历*/
        /*地区*/

        /*上线版本*/
        if($scope.task.device == 0){
            $scope.deviceType = '全部'
        }else if($scope.task.device == 1){
            $scope.deviceType = 'android';
            if($scope.task.android_version){
                $scope.deviceType = 'android'+android_version
            }
        }else if($scope.task.device == 2){
            $scope.deviceType = 'ios'
        }
        /*任务分类*
        /
         */
        if($scope.task.tag_id == 0){
            $scope.tagType = '其他任务'
        }else if($scope.task.tag_id == 6){
            $scope.tagType = 'APP体验'
        }else if($scope.task.tag_id == 5){
            $scope.tagType = '数据采集'
        }else if($scope.task.tag_id == 4){
            $scope.tagType = '数据标注'
        }else if($scope.task.tag_id == 3){
            $scope.tagType = '市场调研'
        }else if($scope.task.tag_id == 7){
            $scope.tagType = '线下任务'
        }
        $scope.versionItems = [
            {
                version:'全部'
            },
            {
                version:'android'
            },
            {
                version:'ios'
            }
        ];

        $scope.tagItems = [
            {
                tagItem:'APP体验'
            },
            {
                tagItem:'数据采集'
            },
            {
                tagItem:'数据标注'
            },
            {
                tagItem:'市场调研'
            },
            {
                tagItem:'线下任务'
            },
            {
                tagItem:'其他任务'
            }
        ];
        //任务分类
        $scope.changeTag = function () {
            if($scope.taskTag.tagItem == 'APP体验'){
                //alert(1)
                $scope.task.tag_id = 6
            }
            if($scope.taskTag.tagItem == '数据采集'){
                //alert(1)
                $scope.task.tag_id = '5'
            }
            if($scope.taskTag.tagItem == '数据标注'){
                //alert(1)
                $scope.task.tag_id = '4'
            }
            if($scope.taskTag.tagItem == '市场调研'){
                //alert(1)
                $scope.task.tag_id = '3'
            }
            if($scope.taskTag.tagItem == '线下任务'){
                //alert(1)
                $scope.task.tag_id = '7'
            }
            if($scope.taskTag.tagItem == '其他任务'){
                //alert(1)
                $scope.task.tag_id = '0'
            }
        }

        //假设仅仅安卓对应状态 吗 为 0
        $scope.changelineVersion = function () {
            if($scope.lineVersion.version == 'android'){
                //alert(1)
                $scope.task.device = '1'
            }
            if($scope.lineVersion.version == 'ios'){
                //alert(1)
                $scope.task.device = '2'
            }
            if($scope.lineVersion.version == '全部'){
                //alert(1)
                $scope.task.device = '0'
            }
        }
        //审核时间转换
        $scope.changeReviewTime = function () {
            $scope.reviewTimeDay = Math.ceil($scope.task.max_check_time*1/24)
        };
        $scope.changeReviewTime();
        //保存本页
        $scope.ntsavePage = function () {
            $scope.areaItems.forEach(function (item,index) {
                if (!$scope.showArea || $scope.showArea == null) {
                    if (item.value == $scope.currentArea) {
                        $scope.task.region_filter = item.code;
                    }
                } else if($scope.showArea){
                    if (item.value == $scope.showArea.value) {
                        $scope.task.region_filter = item.code;
                    }
                }


            });
            $scope.task.order = 100;
             editTask = storageUtils.session.setItem('editData',$scope.task);
             console.log($scope.task);
             serverService.submitSavePage($scope.task)
                     .then(function (data) {
                         if(data.code == 200){
                             alert('保存成功');
                             if($scope.task.id){
                                 //把当前的id存入session
                                 storageUtils.session.setItem('_TaskId_',$scope.task.id);
                                 //获取当前任务的凭证信息
                                 var oldtaskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
                                 if(oldtaskId && oldtaskId != null){
                                     serverService.getComponent(oldtaskId)
                                             .then(function (data) {
                                                 console.log(data)
                                                 //把凭证信息存入到session
                                                 storageUtils.session.setItem('_component_',data.result);
                                             })
                                 }


                             }else{
                                 storageUtils.session.setItem('_newTaskid_',data.result)
                             }
                             window.location ='#/addStep'


                         }else{
                             alert('请检查信息是否填写完整~')
                         }
                     })

           /* id:
            title:test
            desc:33
            amount:0.1
            num:1
            start_time:2017-03-29 16:28
            end_time:2017-03-29 16:28
            max_check_time:1.00
            max_submit_time:1.00
            order:1
            max_submit:1
            region_filter:
            tag_id:1
            poi_id:
            max_distance:
            short_desc:
            device:0
            android_version:
            ios_version:
            is_reward:1
            can_share:
             share_award:
             share_title:
              share_content:
               share_icon:*/
        };
        //下一页
        $scope.ntnextPage = function () {
            //
            /*var editTask = storageUtils.session.getItem('editData');
            if(!editTask){
                alert('要先保存才能下一项哦');
                return
            }*/

            /*if(!$scope.task.id){*/

                $scope.ntsavePage()
            //}
            //$scope.ntsavePage()
            //把当前的id存入session
            storageUtils.session.setItem('_TaskId_',$scope.task.id);
            //获取当前任务的凭证信息
            var oldtaskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_');
            if(oldtaskId && oldtaskId != null){
                serverService.getComponent(oldtaskId)
                        .then(function (data) {
                            console.log(data)
                            //把凭证信息存入到session
                            storageUtils.session.setItem('_component_',data.result);
                        })
            }

            window.location = '#/addStep'

        };
        //上一页
        $scope.ntprePage = function () {
            //操作
            storageUtils.session.removeItem('editData');
            window.location = '#/taskList'
        }


        //资费说明
        $scope.priceDesc = false;
        $scope.showPriceDesc = function () {
            $scope.priceDesc = ! $scope.priceDesc
        }
       /*if(dragsort){
             storageUtils.session.removeItem('_DRAG_')
             $scope.ntnextPage()
         }*/
    }])
})