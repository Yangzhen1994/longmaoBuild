/**
 * Created by 73951 on 2017/3/23.
 */
define(['app'], function (app) {
    app.directive('showtextModule',[function () {
        return {
            restrict: "EA",
            templateUrl: 'tpls/showText.html',
            link:function (scope,el,attr) {
                el.click(function () {
                    el.find('input').eq(0).css('visibility','visible');
                });
                el.find('input').blur(function () {
                    this.style.visibility = 'hidden'
                });


            },
            controller:function ($scope) {
                $scope.showText = '点我编辑你的文本';
                $scope.deleteOne = function (e,data) {
                    e=event||window.event;
                    e.stopPropagation();
                    $scope.$emit('deleteOneShowText',data);
                }
            }
        }

    }])
})