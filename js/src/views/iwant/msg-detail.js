/**
 * Created by 轶卓 on 14-5-14.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!src/tpl/iwant/msg-detail.tpl',
    'text!src/tpl/iwant/header-normal.tpl',
    'src/views/iwant/pic-slide',
    'src/views/iwant/comment'
], function ($, _, Backbone, pageTpl, headerTpl, PicSlideView, CommentView) {
    'use strict';

    var view = Backbone.View.extend({
        el: 'body',
        template: _.template(pageTpl),
        originalsViewInstance: false,
        events: {
            //'tap .onepic' : 'showBigPic'
        },
        showBigPic: function(e){
            window.location.href = '#photo';
            window.photoActive = true;
            var target = $(e.currentTarget);
            var imgData = {};
            imgData.imgLength = target.parent().children('li').length;
            imgData.imgList = [];
            for(var i=0; i<imgData.imgLength; i++) {
                imgData.imgList.push(target.parent().children('li')[i].getAttribute('bigsrc'));
            }
            imgData.currentPic = target.attr('data-key');
            if(this.picSlide) {
                this.picSlide.myScroll = false;
                this.picSlide.initialize({imgData: imgData});
            } else {
                this.picSlide = new PicSlideView({imgData: imgData});
            }
        },
        initialize: function (data) {
            $('.loading').hide();
            this.undelegateEvents();
            $(window).off('scroll');
            this.message_id = data.msg_id;
            this.originalsViewInstance = data.originalsViewInstance;
            var header = _.template(headerTpl,{title: '详情'});
            $("header").replaceWith(header);
            var that = this;
            ajax_request({action: 'iwant_get_message_detail', message_id:this.message_id}).then(function(data){
                if(data.errorCode>0) {
                    showError(data.errorMsg);
                    return
                }
                data.search_link = cfg.search_link;
                that.render(data);
            }).mobiCatch(function(e){
                console.log(e);
            });
            window.scrollTo(0,0);
        },
        render: function(data) {
            pageSlider.slidePage($(this.template(data)));
            //准备comment
            var options = {};
            options.topic_detail_info={
                original_id: data.original_id,
                canShare: true,
                praise_count: data.praised_count,
                review_list: data.review_list,
                el: '.center #comment_detail_'+data.original_id
                //share_image:
            };
            if(data.is_delete == 1){
                options.topic_detail_info.canShare = false;
            }
            if(!_.isEmpty(data.image_list)) {
                options.topic_detail_info.share_image = data.image_list[0].big;
            } else {
                options.topic_detail_info.share_image = '';
            }
            var comment = new CommentView(options);
            var that = this;
            $('.onepic').tap(function(e){
                that.showBigPic(e);
            });
        }
    });

    return view;
});
