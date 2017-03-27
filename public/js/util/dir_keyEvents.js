/**
 * Created by 73951 on 2017/3/23.
 */
define(['app'], function (app) {
    app.directive('keyEvents',[function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                //debugger;
                element.on('click', function (event) {

                    $(document).ready(function(){
                        $(document).bind("keyup", keyUpevents);
                    });
                    function keyUpevents(e) {
                        var kc = window.event?e.keyCode:e.which;
                        console.log(kc);
                        if(kc == 187 || kc == 107){
                            $('.tr_Right_fallow').trigger('click')
                        }else if(kc == 97 || kc == 49){//小键盘1 或者 大键盘1
                            $('#reson_detail0').trigger('click')
                        }else if(kc == 98 || kc == 50){//小键盘2 或者 大键盘2
                            $('#reson_detail1').trigger('click')
                        }else if(kc == 99 || kc == 51){
                            scope.showrejCover = true
                            $('#orderReason').trigger('keyup')
                        }

                    }
                });
            }

        }

    }])
})