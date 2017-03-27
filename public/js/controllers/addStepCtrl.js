/**
 * Created by 73951 on 2017/3/21.
 */
define(['app','storageUtils'], function (app,storageUtils) {
    return  app.controller('addStepCtrl',['$scope','Upload','$timeout','serverService',function ($scope,Upload,$timeout,serverService) {
        $('.left').css('height',846);
        $scope.stepCount = 0;
        $scope.stepItems = [{
            showValue:1,
            index:$scope.stepCount+1
        }];

        /*添加模板*/
        $scope.addStepModule = function (index) {
            $scope.stepItems.push({
                showValue: 1,
                index:index+1
            })
            $scope.stepCount ++;
            $('.left').css('height',$('.newStep').innerHeight()+627)
        };
        $scope.removeStep = function(index){

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
        };



        $scope.sortableOptions = {
            // 数据有变化
            update: function (e, ui) {
                console.log("update");
                //需要使用延时方法，否则会输出原始数据的顺序，可能是BUG
            },

            // 完成拖拽动作
            stop: function (e, ui) {
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
            console.log(newResult);
        }

    }]);
})