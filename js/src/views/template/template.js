/**
 * Created by 轶卓 on 14-5-14.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    //todo-start:加载你所需要的模块及html模板
    'text!src/tpl/template/template.tpl'//,
    //'src/models/template/template',
    //'iscroll'
    //todo-end:加载你所需要的模块
], function ($, _, Backbone, pageTpl/*, myModel, myTemplate, iScroll*/) {
    'use strict';

    var view = Backbone.View.extend({
        el: 'body',
        template: _.template(pageTpl),
        events: {
        },
        //todo-start:new view以后会先运行initialize，剩下的靠自己写了
        initialize: function () {
            this.render();
        },
        render: function() {
            //一开始，为页面滑动render一个容器，所有该页面的新内容，均放在这个新容器中
            pageSlider.slidePage($(this.template()));

        }
        //todo-start:new view以后会先运行这个函数，剩下的靠自己写了
    });

    return view;
});
