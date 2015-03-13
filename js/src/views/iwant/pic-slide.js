/**
 * Created by 轶卓 on 14-8-18.
 * 自制图片滚动查看
 */


define([
    'jquery',
    'underscore',
    'backbone',
    'text!src/tpl/iwant/pic-slide.tpl',
    '../../../libs/zepto/touch',
    'iscroll'
], function ($, _, Backbone, pageTpl) {
    'use strict';

    var view = Backbone.View.extend({
        el: 'body',
        template: _.template(pageTpl),
        myScroll: false,
        events: {
            'tap .bg black': 'close',
            'tap .big_pic': 'close',
            'swipeLeft #slide-pic': 'swipeLeft',
            'swipeRight #slide-pic': 'swipeRight'
        },
        close: function(){
            this.undelegateEvents();
            history.back();
            //$('#slide-pic').remove();
        },
        swipeLeft: function() {
            //下一张
            //已经是最后一张
            var current = $('#slide-pic .center');
            if(current.next().length <= 0) {
                return;
            }
            this.myScroll.scrollTo(0,0);
            var next = current.next();
            current.removeClass('center').addClass('left');
            next.removeClass('right').addClass('center');
            var onDot = $('.dot .on');
            onDot.removeClass('on');
            onDot.next().addClass('on');
            this.loadImg(next);

        },
        swipeRight: function() {
            var current = $('#slide-pic .center');
            if(current.prev().length <= 0) {
                return;
            }
            this.myScroll.scrollTo(0,0);
            var prev = current.prev();
            current.removeClass('center').addClass('right');
            prev.removeClass('left').addClass('center');
            var onDot = $('.dot .on');
            onDot.removeClass('on');
            onDot.prev().addClass('on');
            this.loadImg(prev);
        },

        initialize: function (data) {
            this.undelegateEvents();
            this.delegateEvents(this.events);
            data.innerHeight = window.innerHeight;
            this.render(data);
            //$('#line_height').css('line-height',window.innerHeight+'px');
        },
        render: function(data) {

            //一开始，为页面滑动render一个容器，所有该页面的新内容，均放在这个新容器中
            $('body').append(this.template(data));
            this.loadImg();
            this.myScroll = new IScroll('.show_area', {scrollX: false,scrollY: true, useTransform:false});
        },

        loadImg: function(element){
            var that = this;
            setTimeout(function(){
                if(element){
                    var currentImg = element.find('img');
                } else {
                    var currentImg = $('#slide-pic .center img');
                }

                //如果已经load过，则只刷新高度
                if(currentImg.hasClass('img_loaded')){
                    that.refreshHeight(currentImg);
                } else {
                    //lazyLoad开始
                    var src = currentImg.attr('imgsrc');
                    var img = new Image();
                    img.onload = function () {
                        img.onload = null;
                        that.loadedimg(currentImg)
                    };
                    img.src = src;
                }

            },0);
        },
        loadedimg: function(imgobj){
            var imgsrc=imgobj.attr('imgsrc');
            var parent = imgobj.parent();
            var loadedImg = document.createElement('img');
            loadedImg.src = imgsrc;
            loadedImg.setAttribute('class','img_loaded');
            parent[0].appendChild(loadedImg);
            imgobj.remove();
            var that = this;
            setTimeout(function(){
                that.refreshHeight($(loadedImg));
            }, 100);

        },
        refreshHeight: function(currentImg){
            $('.pic_wrap').height(currentImg.height());
            if(this.myScroll){
                this.myScroll.refresh();
            } else {
                this.myScroll = new IScroll('.show_area', {scrollX: false,scrollY: true,useTransform:false});
            }

        }
    });

    return view;
});
