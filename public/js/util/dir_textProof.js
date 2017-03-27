/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * 浏览器端数据存在的工具模块
 */
define(['app'], function (app) {
     app.directive('textproofModule',[function () {
            return {
                restrict: "EA",
                templateUrl: 'tpls/textProof.html',
                link:function (scope,el,attr) {
                    var slideInput = document.getElementById('slideInput');
                    el.on('click',function () {
                        //scope.isshow = true;
                        el.find('input').eq(0).css('visibility','visible')
                        el.find('input').eq(0).on('blur',function () {
                            $(this).css('visibility','hidden');
                        })
                    })



                }
            }

    }])
})
