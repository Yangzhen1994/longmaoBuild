define(['app'], function (app) {

    app.factory('serverService', ['$http','$q', function($http,$q) {
        function getAllTask(data) {
            var defer = $q.defer();
            data.show_nocheck = 1;
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/list.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                        defer.resolve(data.result.rows)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function getDatajson(id) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/data.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:{id:id},
                success: function (data) {
                    defer.resolve(data.result)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function submitSavePage(obj) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/save.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:obj,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function getStepById(id) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/steps/list.json?task_id=';
            $.ajax({
                type: "POST",
                url: url+id,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function getUpdownLine(id) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/status.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:{id:id},
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        function getReviewList(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/check/list.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*导出*/
        function exportReview(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/expimp/export/check/data.html';
            $.ajax({
                type: "GET",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                params:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*导入excel*/
        function importReview(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/expimp/import/check/data.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Content-Type":'multipart/form-data',
                },
                //contentType:'multipart/form-data',
                //enctype: 'multipart/form-data',
                //全部data
                data:data,
                //ContentType: 'application/vnd.ms-excel',
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*审核通过*/
        function check(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/check/check.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /*save step*/
        function saveStep(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/steps/save.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /***凭证***/
        /*
        * id:
         type:1 文本 2图片 5 定位 6 音频
         tips_text:1
         tips_image:
         compress:1
         regex:
         options:
         options_other:0
         order:1
         step_id:3987
         status:1
         task_id:1232
        *
        *
        *
        *
        *
        *
        *
        *
        * */

        function submitComponent(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/component/save.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                data:data,
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /**获取凭证*/
        function getComponent(taskId){
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/task/component/list.json?task_id=';
            $.ajax({
                type: "POST",
                url: url+taskId,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        /**获取下拉菜单*/

        function getSelectData() {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/sys/dict/options.json?key=DICT.COMMON.REGEXP.IPREGEXP';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }

        //获取历史被拒等
        function getInfoData(data) {
            var defer = $q.defer();
            var url = 'http://manager.test.shandianshua.com/totoro/task/check/user/info.json';
            $.ajax({
                type: "POST",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                data:data,
                //全部data
                success: function (data) {
                    defer.resolve(data)
                },
                error: function (data) {
                    console.error(data)
                }
            })
            return defer.promise
        }
        return {getSelectData,getAllTask,getDatajson,submitSavePage,getStepById,getUpdownLine,
            getReviewList,exportReview,importReview,check,saveStep,submitComponent,getComponent,getInfoData};
    }])
})
