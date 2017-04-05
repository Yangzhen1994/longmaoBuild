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

            }
        }

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
        $scope.areaItems = [
            {
                area:'全国'
            },
            {
                area:'北京市'
            },
            {
                area:'上海市'
            },
            {
                area:'广东省广州市'
            },
            {
                area:'广东省东莞市'
            },
            {
                area:'广东省深圳市'
            },
            {
                area:'江苏省'
            },
            {
                area:'湖北市'
            },
        ]
        /*上线版本*/
        $scope.versionItems = [
            {
                version:'android'
            },
            {
                version:'ios'
            }
        ];
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
        }
        //审核时间转换
        $scope.changeReviewTime = function () {
            $scope.reviewTimeDay = Math.ceil($scope.task.max_check_time*1/24)
        };
        $scope.changeReviewTime();
        //保存本页
        $scope.ntsavePage = function () {
             editTask = storageUtils.session.setItem('editData',$scope.task);
             console.log($scope.task);
             serverService.submitSavePage($scope.task)
                     .then(function (data) {
                         if(data.code == 200){
                             alert('保存成功');
                             storageUtils.session.setItem('_newTaskid_',data.result)
                             storageUtils.session.removeItem('editData');
                             window.location ='#/addStep'
                         }else{
                             alert('有错误')
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