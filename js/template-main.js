/**
 * Created by 轶卓 on 14-5-14.
 * 店铺装修入口
 * 因为backbone会加载jquery模块，所以将zepto定义为jquery
 * 这个文件负责加载config，并且定义该项目所需要全局工具函数
 */
'use strict';

//根据配置加载压缩或未压缩的config
require(["config"+cfg.combo_infix_name], function() {
    require.config({
        //todo-start：覆盖或定义本地版本号，这里写个例子，在此控制js的版本
        version: {
            'src/routers/shop/shop-router': '20140520',
            defaultVersion: '20140529'
        },
        //todo-end：覆盖或定义本地版本号，这里写个例子，在此控制js的版本
        //todo-start：定义本项目所需js库的依赖关系
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
        //todo-end：定义本项目所需js库的依赖关系
    });


    require([
        'backbone',
        'slider',
        //todo-start: 加载你自己的路由文件
        'src/routers/template/template-router',
        //todo-end: 加载你自己的路由文件
        'rsvpajax',
        'common'
    ], function (Backbone, slider, router) {
        //去掉$_GET中的action和time_code, 其他的直接用
        $_GET = _.omit($_GET, ['time_code', 'action']);
        //封装通用的ajax请求函数，用来合并通用参数（经考虑，暂时放在这里，以后可以移到common下

        //todo-start：重写的ajax请求方法，包括了RSVP和自动增加参数，如果不需要或自己实现可删掉
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
        //todo-end：重写的ajax请求方法，包括了RSVP和自动增加参数，如果不需要或自己实现可删掉

        //todo-start：转场动画初始化，如项目没有特别要求建议保留
        window.pageSlider = new PageSlider($("#frame"));
        //todo-end：转场动画初始化，如项目没有特别要求建议保留

        //启动路由
        new router();
        Backbone.history.start();
    });
});




