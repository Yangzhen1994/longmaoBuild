/**
 * Created by 73951 on 2017/3/22.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * 浏览器端数据存在的工具模块
 */
define(['app'], function (app) {
    app.directive('showimgModule',[function () {
        return {
            restrict: "EA",
            templateUrl: 'tpls/showImg.html',
            link:function (scope,el,attr) {
                el.click(function () {
                    el.find('section').eq(0).css('visibility','visible');
                    //console.log(el.find('input').eq(0).text())
                });
                //inutfile
                /*el.find('#upFile').eq(0).change(function (e) {
                    e = event || window.event;
                    e.stopPropagation();
                    console.log(this.files)
                    var f = this.files;
                    for(i = 0;i<f.length;i++){

                    }

                })
*/

            }
        }

    }])
})
