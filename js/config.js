/**
 * Created by 轶卓 on 14-5-14.
 * 通用的，全局都要加载的函数库的设置
 */

//config.min对外公开，里面没有注释，故注释在此：
//config.min.js并不压缩，考虑以后存在合并压缩的情况，config与config.min分开
//并且，config为所有项目共享，考虑到兼容性，不能与全局变量和php有数据交互

require.config({
    baseUrl: "js",
    paths: {
        //所有模块都在这里定义路径，因为只要没有依赖并不会加载，所以没有关系
        //zepto及相关
        jquery:"libs/zepto/zepto",
        selector:"libs/zepto/selector",
        rsvp:'libs/zepto/rsvp-latest',
        rsvpajax:'libs/zepto/rsvp-ajax',
        //backbone及相关
        backbone:"libs/backbone/backbone",
        underscore:"libs/underscore/underscore",
        text: 'libs/backbone/text',
        //页面切换
        slider:'libs/slider/pageslider',
        //iscroll 5.0
        iscroll:'libs/iscroll/iscroll'
    },
    //版本控制，开发环境不需要
    version: {

    },
    //压缩后缀
    compressedPostfix: '',
    //压缩例外，不压缩的在此定义，main文件可以重写覆盖，暂时只支持模块的
    compressedException: [],
    //基础依赖在这里定义，main文件增加其他依赖
    //！！！！！！！此处定义的模块为全局，对应的js文件不能进行合并压缩！！！！！！！
    shim: {
        jquery: {
            exports: "Zepto"
        },
        backbone: {
            deps: ['jquery', 'underscore', 'selector'],
            exports: 'Backbone'
        }
    }
});