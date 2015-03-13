/**
 * Created by 轶卓 on 14-5-14.
 */
/**
 * Created by 轶卓 on 14-3-19.
 * 我的当当的路由
 */
/*global define*/
define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var Workspace = Backbone.Router.extend({
        //todo-start: 定义你自己的路由
        routes: {
            '':'loadView'
        },
        //todo-end: 定义你自己的路由

        //todo-start: 定义你自己的路由处理函数
        loadView: function() {
            require(['src/views/template/template'], function(PageView){
                new PageView();
            });
        }
        //todo-end: 定义你自己的路由处理函数
    });

    return Workspace;
});
