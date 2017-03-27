/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
define(['app'], function (app) {
    return app.controller('newTaskCtrl',['$scope','$timeout','serverService', function ($scope, $timeout,serverService) {
        $('.left').css('height',738);
        $scope.newtaskTitle = '请输入标题';
        $scope.newTaskCount = '任务个数';
        $scope.isshow = false;
        $scope.redOne = '点我试一下';
        $scope.task = {
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
        };




        /*日历*/
        /*地区*/
        $scope.areaItems = [
            {
                area:'全国'
            }
        ]
        /*上线版本*/
        $scope.versionItems = [
            {
                version:'仅安卓'
            },
            {
                version:'ios'
            }
        ];
        //假设仅仅安卓对应状态 吗 为 0
        $scope.changelineVersion = function () {
            if($scope.task.lineVersion.version == '仅安卓'){
                //alert(1)
                $scope.task.lineVersion = '0'
            }
        }
        //审核时间转换
        $scope.reviewTimehour = '';
        $scope.changeReviewTime = function () {
            $scope.task.reviewTime = Math.ceil($scope.reviewTimehour*1/24)
        }
        //保存本页
        $scope.ntsavePage = function () {

        };
        //下一页
        $scope.ntnextPage = function () {
            //
            window.location = '#/addStep'
        };
        //上一页
        $scope.ntprePage = function () {
            //操作
            window.location = '#/taskList'
        }


        //资费说明
        $scope.priceDesc = false;
        $scope.showPriceDesc = function () {
            $scope.priceDesc = ! $scope.priceDesc
        }
    }])
})