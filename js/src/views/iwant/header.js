/**
 * Created by 魏汉清 on 2014/8/19.
 * common header view 如页面有特殊的header ,用replaceWith自行替换
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!src/tpl/iwant/header.tpl'
], function ($, _, Backbone,headerTpl) {
    'use strict';

    var view = Backbone.View.extend({
        el: 'body',
        template: _.template(headerTpl),
        events: {
        },
        initialize: function (data) {
            $("header").replaceWith(headerTpl);
            this.render();
        },
        render: function() {
            //一开始，为页面滑动render一个容器，所有该页面的新内容，均放在这个新容器中
            pageSlider.slidePage($(this.template()));

        }
    });

    return view;
});