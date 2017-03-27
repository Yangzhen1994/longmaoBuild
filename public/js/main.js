/**
 * 入口文件
 * 2014-11-30 mon
 */
(function (window) {
    'use strict';

    require.config({

        //基本路径
        baseUrl: "js/",

        //模块标识名与模块路径映射
        paths: {
            //库
            "angular" : "libs/angular",
            "angular-route" : "libs/angular-route",
            'angular-ui-route':'libs/angular-ui-router',

            'ui-sortable':'libs/sortable',
            'ng-file-upload':'libs/ng-file-upload.min',
            //服务
            "serverService" : "services/serverService",

            //控制器
            "app" : "controllers/app",
            "headerCtrl":"controllers/headerCtrl",
            "newTaskCtrl":"controllers/newTaskCtrl",
            "taskListCtrl":"controllers/taskListCtrl",
            "reviewCtrl":"controllers/reviewCtrl",
            "reviewDetailCtrl":"controllers/reviewDetailCtrl",
            "toReviewCtrl":"controllers/toReviewCtrl",
            "ReviewOkCtrl":"controllers/ReviewOkCtrl",
            "ReviewNoCtrl":"controllers/ReviewNoCtrl",
            "toReviewDetailCtrl":"controllers/toReviewDetailCtrl",
            "addStepCtrl":"controllers/addStepCtrl",
            "textProofCtrl":"controllers/textProofCtrl",
            "posProofCtrl":"controllers/posProofCtrl",
            "showImgCtrl":"controllers/showImgCtrl",
            //路由
            "route" : "routes/appRoute",

            //工具
            'storageUtils' : 'util/storageUtils',
            'changeLeftNav' : 'util/changeLeftNav',
            'dir_textProof' : 'util/dir_textProof',
            'dir_imgProof' : 'util/dir_imgProof',
            'dir_laydate' : 'util/dir_laydate',
            'dir_addStep' : 'util/dir_addStep',
            'dir_posProof' : 'util/dir_posProof',
            'dir_showImg' : 'util/dir_showImg',
            'dir_showText' : 'util/dir_showText',
            'dir_keyEvents' : 'util/dir_keyEvents',
        },

        /*
         配置不兼容AMD的模块
         exports : 指定导出的模块名
         deps  : 指定所有依赖的模块的数组
         */
        shim: {
            'angular': {
                exports: 'angular'
            },
            'angular-route':{
                deps: ["angular"],
                exports: 'angular-route'
            },
            'angular-ui-route':{
                deps: ["angular"],
                exports: 'angular-ui-route'
            },
            'ui-sortable':{
                deps: ["angular"],
                exports: 'ui-sortable'
            },
            'ui-bootstrap':{
                deps: ["angular"],
                exports: 'ui-bootstrap'
            },
            'ng-file-upload':{
                deps: ["angular"],
                exports: 'ng-file-upload'
            }
        }
    });

    require(['angular','angular-route','angular-ui-route','ui-sortable','ng-file-upload','app','route','storageUtils',
            'dir_textProof','dir_imgProof','dir_laydate','dir_addStep','dir_posProof','dir_showImg','dir_showText','dir_keyEvents','headerCtrl','newTaskCtrl','taskListCtrl',
            'reviewCtrl','reviewDetailCtrl', "toReviewCtrl", "ReviewOkCtrl", "ReviewNoCtrl",
                "toReviewDetailCtrl",'addStepCtrl','textProofCtrl','posProofCtrl','showImgCtrl','changeLeftNav','serverService'],
        function (angular){
            angular.bootstrap(document,["dcApp"]);
        }
    );
})(window)