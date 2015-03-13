/**
 * Created by 轶卓 on 14-5-14.
 * 店铺装修入口
 * 因为backbone会加载jquery模块，所以将zepto定义为jquery
 * 这个文件负责加载config，并且定义该项目所需要全局工具函数
 */
'use strict';

//根据配置加载压缩或未压缩的config
require(["../config"+cfg.combo_infix_name], function() {
    require.config({
        version: {
            defaultVersion: '20140814'
        },
        shim: {
            selector:{
                deps: ['jquery']
            },
            rsvpajax:{
                deps: ['jquery', 'rsvp']
            },
            rsvp: {
                exports: 'RSVP'
            }
        }
    });


    require([
        'backbone',
        'slider',
        'src/routers/iwant/iwant-router',
        'libs/3rd/spin',
        'rsvpajax',
        'common'
    ], function (Backbone, slider, router, spin) {

        var opts = {
            lines: 12, // The number of lines to draw
            length: 3, // The length of each line
            width: 2, // The line thickness
            radius: 5, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        };
        var target = $('.action_loading')[0];
        var spinner = new spin(opts).spin(target);

        //去掉$_GET中的action和time_code, 其他的直接用
        $_GET = _.omit($_GET, ['time_code', 'action']);
        //封装通用的ajax请求函数，用来合并通用参数（经考虑，暂时放在这里，以后可以移到common下
        //调用ajax，不需要显示loading的接口名单
        var noLoading = ['iwant_get_message_list', 'iwant_get_original_list', 'iwant_get_user_original_list',
                        'iwant_get_topic_list', 'iwant_get_review_list', 'iwant_get_new_message_flag'];

        $.Pajax = function(para) {
            return new RSVP.Promise(function(resolve, reject){
                para.success = function(data){
                    $('.action_loading').hide();
                    if(data.errorCode == 96) {
                        location.href = cfg.login_link;
                    }
                    resolve(data);
                }
                para.error = function(xhr){
                    $('.action_loading').hide();
                    reject(Error(xhr.statusText));
                }
                if(noLoading.indexOf(para.data.action) < 0) {
                    $('.action_loading').show();
                }

                $.ajax(para);
            });
        }
        window.ajax_request = function(data) {
            //直接将从客户端获得的，去掉了action和time_code的GET参数与接口参数合并
            var ajData = _.extend(data,$_GET)
            if(ajData.action && cfg.actionCodes[ajData.action]) {
                ajData.time_code = cfg.actionCodes[ajData.action];
            }
            var ajaxRequest = $.Pajax({
                url: cfg.mapi_url,
                type: "GET",
                data: ajData,
                dataType: "json"
            });
            return ajaxRequest;
        }

        $.loadTemplate = function(url){
            return new RSVP.Promise(function(resolve, reject) {
                require([url], function(template){
                    resolve(template);
                }, function(err){
                    reject(err);
                });
            });
        }

        window.showError = function(errMsg) {
            var err = "服务器被外星人劫持了，等待解救";
            if(errMsg){
                err = errMsg.replace(/\\n/g,"<br/>");
            }
            $('#error_block').html(err).show();
            setTimeout(function(){
                $('#error_block').hide();
            }, 5000);
        }
        window.pageSlider = new PageSlider($("#frame"));
        //启动路由
        new router();
        Backbone.history.start();
    });
});




