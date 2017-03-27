define(['app'], function (app) {

    app.factory('serverService', ['$http','$q', function($http,$q) {

        /*
        发送验证码
         */
        function sendCode(phone) {
            var def = $q.defer();
            $http.get('/sendcode?phone='+phone)
                .success(function (result) {
                    def.resolve(result);
                });
            return def.promise;
        }

        /*
        登陆
         */
        function login(user) {
            var def = $q.defer();
            $http({
                method : 'POST',
                url : '/login',
                data : user
            })
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function (result) {
                    def.reject(result);
                });
            return def.promise;
        }

        /*
        提交意见反馈
         */
        function feedback(feedback) {
            var def = $q.defer();
            $http({
                method: 'GET',
                url : '/feedback',
                params : {data:feedback}
            })
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function () {
                    def.reject();
                });
            return def.promise;
        }

        /*
        获取当前用户的所有的地址列表
         */
        function getAddrsByUserId(userId) {
            var def = $q.defer();
            $http.get('/getAddrsByUserId?userId='+userId)
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function () {
                    alert('获取地址列表失败!');
                });
            return def.promise;
        }

        /*
        删除指定地址
         */
        function deleteAddr(id) {
            var def = $q.defer();
            $http.get('/deleteAddr?_id='+id)
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function () {
                    alert('删除地址失败!');
                });
            return def.promise;
        }

        /*
        添加地址
         */
        function insertAddr(address) {
            var def = $q.defer();
            $http({
                method : 'GET',
                url : '/insertAddr',
                params : {address:address}
            })
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function (result) {
                    alert('保存地址失败');
                });

            return def.promise;
        }

        /*
         更新地址
         */
        function updateAddr(address) {
            var def = $q.defer();
            $http({
                method : 'GET',
                url : '/updateAddr',
                params : {address:address}
            })
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function (result) {
                    alert('更新地址失败');
                });
            return def.promise;
        }

        /*
        得到首页轮播图数据
         */
        function getBanners() {
            var def = $q.defer();
            $http.get('/index/banners')
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function () {
                    alert('获取轮播图失败');
                });
            return def.promise;
        }

        /*
        得到菜品列表,店铺和地址数据
         */
        function getHomeData() {
            var def = $q.defer();
            $http.get('/index/data')
                .success(function (result) {
                    def.resolve(result);
                })
                .error(function () {
                    alert('获取轮播图失败');
                });
            return def.promise;
        }

        /*
        得到默认地址
         */
        function getDefaultAddr(userId) {
            var def = $q.defer();
            $http.get('/order/getNewestAddress?userId='+userId)
                .success(function (result) {
                    def.resolve(result);
                });
            return def.promise;
        }

        /*
        下单
         */
        function createOrder(order) {
            var def = $q.defer();
            $http({
                method : 'POST',
                url : '/order/createOrder',
                data : {"order" : order}
            }).success(function (result) {
                def.resolve(result);
            }).error(function () {
                alert('下单失败');
            });
            return def.promise;
        }

        return {sendCode:sendCode, login:login, feedback:feedback, getAddrsByUserId:getAddrsByUserId, deleteAddr:deleteAddr, insertAddr:insertAddr, updateAddr:updateAddr,
            getBanners:getBanners, getHomeData:getHomeData, getDefaultAddr:getDefaultAddr, createOrder:createOrder};
    }])
})
