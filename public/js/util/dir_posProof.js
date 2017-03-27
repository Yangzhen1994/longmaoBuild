/**
 * Created by 73951 on 2017/3/21.
 */
define(['app'], function (app) {
    app.directive('posproofModule',[function () {
        return {
            restrict: "EA",
            templateUrl: 'tpls/posproof.html',
            link:function (scope,el,attr) {
                el.click(function () {
                    el.find('.posEdit').eq(0).css('visibility','visible')
                })
                el.find('.posSub').eq(0).click(function (e) {
                    e = event || window.event;
                    e.stopPropagation();
                    el.find('.posEdit').eq(0).css('visibility','hidden')
                })



            }
        }

    }])
})
