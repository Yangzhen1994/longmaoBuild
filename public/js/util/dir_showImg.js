/**
 * Created by 73951 on 2017/3/22.
 */
/**
 * Created by 73951 on 2017/3/15.
 */
/**
 * 浏览器端数据存在的工具模块
 */
define(['app','storageUtils'], function (app,storageUtils) {
    app.directive('showimgModule',['serverService',function (serverService) {
        return {
            restrict: "EA",
            templateUrl: 'tpls/showImg.html',
            link:function (scope,el,attr) {
                scope.stepIndex = el.parents('ul')[0].id.substr(-1,1)
                if(scope.images.indexOf('http://')==-1){
                    el.find('img').eq(0).src = '../img/moduleImg/ic_add_a_photo_black_24dp.png'
                }


                el.find('img').eq(0).on('mouseenter',function (e) {
                    e.stopPropagation();
                    var imgIndex = $(this).attr('id');
                    imgIndex = imgIndex.substr(-1,1)
                    function sys_file_sdk_qiniu_token(file) {
                        var token = $.ajax({
                            url: 'http://manager.test.shandianshua.com/sdk/qiniu/token.json',
                            method: 'POST',
                            xhrFields: {
                                withCredentials: true
                            },
                            data: {bucket: 'totoro-task'},
                            dataType: 'json',
                            async: false,
                        }).responseText;

                        return jQuery.parseJSON(token).result;
                    }

                    /*function showPreview (file) {

                            var image = new Image();
                            image.style.width = '100%';
                            image.style.height = '100%';

                            var preloader = new mOxie.Image();
                            preloader.onload = function() {
                                preloader.downsize( 300, 300 );
                                image.setAttribute( "src", preloader.getAsDataURL() );
                                $('#preview'+stepIndex+imgIndex).append(image);
                                $('#preview'+stepIndex+imgIndex).css('display','block')
                            };
                            preloader.load( file.getSource() );


                    }*/
                    var hashArr = []
                    var uploader = Qiniu.uploader({
                        runtimes: 'html5,html4',
                        browse_button: 'step'+scope.stepIndex+'img'+imgIndex,
                        container: 'stepContainer'+scope.stepIndex+'img'+imgIndex,
                        //drop_element: 'sys-file-dialog-list'+comIndex,
                        max_file_size: '100mb',
                        //dragdrop: true,
                        chunk_size: '5mb',
                        multi_selection: true,
                        get_new_uptoken: true,
                        uptoken_func: sys_file_sdk_qiniu_token,
                        domain: ' http://task.totoro.cdn.shandianshua.com',
                        unique_names: true,
                        auto_start: true,
                        init: {
                            'FilesAdded': function(up, files) {

                                    // 文件添加进队列后，处理相关的事情
                                    alert('添加了文件');
                                    console.log(files
                                    );
                                   /* for (var i = 0; i < files.length; i++) {


                                        showPreview (files[i]);
                                    }*/
                                //$('#sys-file-dialog-upload-btn'+scope.stepIndex+comIndex).attr("src",'../img/moduleImg/ic_add_a_photo_black_24dp.png');

                            },
                            'BeforeUpload': function(up, file) {
                                // 每个文件上传前，处理相关的事情

                                alert('准备上传')
                            },
                            'UploadProgress': function(up, file) {
                                // 每个文件上传时，处理相关的事情
                            },
                            'FileUploaded': function(up, file, info) {
                                console.log(file)
                                console.log(info);

                                hashArr.push(jQuery.parseJSON(info));
                                console.log(hashArr);
                                /*$.ajax({
                                    url:'http://manager.test.shandianshua.com/sys/file/save.json',
                                    method:'POST',
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    data:{
                                        space:'',
                                        key:file.id,
                                        title:file.name,
                                        name:file.target_name,
                                        type:file.type?file.type:file.title.replace(/^[^\.]+\./,''),
                                        size:file.size
                                    },
                                    dataType:'json',
                                    async:false
                                })*/
                                // 每个文件上传成功后，处理相关的事情
                                // 其中info是文件上传成功后，服务端返回的json，形式如：
                                // {
                                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                //    "key": "gogopher.jpg"
                                //  }
                                // 查看简单反馈
                                var domain = up.getOption('domain');
                                var res = jQuery.parseJSON(info);
                                var str = '';
                                str+=domain+"/"+res.key;
                                 //var sourceLink = domain +"/"+ res.key+'\n'; //获取上传成功后的文件的Url
                                //console.log(sourceLink);
                                //scope.stepItems[stepIndex].component[comIndex].tips_image = str
                                //console.log(scope.stepItems[stepIndex].component[comIndex]);
                                //scope.stepItems[stepIndex].oldSteps.tips_image = str
                                /*$('step'+scope.stepIndex+'img'+imgIndex).attr('src',str)*/
                                scope.stepItems[scope.stepIndex].oldSteps.images_list[imgIndex] = str
                                scope.stepItems[scope.stepIndex].oldSteps.images += str+'\r'
                            },
                            'Error': function(up, err, errTip) {
                                //上传出错时，处理相关的事情
                                console.log(err)
                            },
                            'UploadComplete': function() {
                                //队列文件处理完毕后，处理相关的事情
                                var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                                //scope.stepItems[stepIndex].component[comIndex].task_id = taskId
                                //serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                            },
                            'Key': function(up, file) {
                                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                // 该配置必须要在unique_names: false，save_key: false时才生效
                                var key = "";
                                // do something with key here
                                return key
                            }
                        }
                    })
                    //console.log(uploader)
                })



                el.find('img').eq(-1).click(function (e) {
                    /*alert(1);
                    return*/
                    e.stopPropagation()
                    var delimgIndex = $(this).attr('id');
                    delimgIndex = delimgIndex.substr(-1,1)
                    //scope.componentItems[comIndex].tips_text = ' ';
                    //scope.componentItems[comIndex].isText = ' ';
                   // scope.stepItems[stepIndex].component[comIndex].isText = ' ';
                    var taskId = storageUtils.session.getItem('_TaskId_') || storageUtils.session.getItem('_newTaskid_')
                    scope.stepItems[scope.stepIndex].oldSteps.images_list.splice(delimgIndex,1)
                    /*serverService.submitComponent(scope.stepItems[stepIndex].component[comIndex])
                            .then(function (data) {
                                if(data.code == 200){
                                   //storageUtils.session.setItem('_DRAG_',true);
                                    //window.location = '#/reviewList';
                                    $('#imgWrap'+stepIndex+comIndex).css('display','none')
                                }
                            })*/
                    $(this).css('display','none')
                })
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
