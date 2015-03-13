/**
 * Created by 轶卓 on 14-5-14.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'src/views/iwant/originals',
    'text!src/tpl/iwant/topic.tpl',
    'text!src/tpl/iwant/header-self.tpl',
    'text!src/tpl/iwant/header-topic.tpl'
], function ($, _, Backbone,OriginalsView, pageTpl, normalHeaderTpl, topicHeaderTpl) {
    'use strict';

    var view = Backbone.View.extend({
        el: '#frame',
        template: _.template(pageTpl),
        page_size: cfg.page_size,
        topic_type: 1,
        events: {
            'click .follow': 'follow',
            'click .longdetail': 'detail',
            'click .shortdetail': 'detail',
            'click .add': 'addTopic',
            "tap [onclick='return false;']": 'tapLocation'
        },
        tapLocation: function(e) {
            var href = $(e.currentTarget).attr('href');
            location.href = href;
        },
        locationToMe: function(){
            ajax_request({action:'iwant_get_login_user'}).then(function(data){
                if(data.cust_id && data.cust_id > 0) {
                    location.href = '#me';
                } else {
                    location.href = cfg.login_link;
                }
            });
        },
        originalsViewInstance: false,
        addTopic: function(){
            location.href=cfg.sns_publish_link.replace('{%type%}', '1').replace('{%topic_id%}', this.topic_id);
        },
        fixedDetail: function(){
            //页面在顶端时
            if($(window).scrollTop() == 0){
                if($(".arrow_header").hasClass("hide")){
                    $('#doc-detail').show();
                    //箭头向下
                    $(".arrow_header").removeClass("hide");
                } else{
                    //收起
                    $('#doc-detail').hide();
                    $('#fixed-detail').css('top', '-100px');
                    //箭头向上
                    $(".arrow_header").addClass("hide");
                }
            } else {
                if($(".arrow_header").hasClass("hide")){
                    $('#fixed-detail').css('top', '48.5px');
                    //箭头向下
                    $(".arrow_header").removeClass("hide");
                } else{
                    //收起
                    $('#doc-detail').hide();
                    $('#fixed-detail').css('top', '-100px');
                    //箭头向上
                    $(".arrow_header").addClass("hide");
                }
            }
        },
        detail: function(){
            $('.shortdetail').toggle();
            $('.longdetail').toggle();
        },
        follow: function(){
            //关注某个话题
            var that = this;
            ajax_request({action: 'iwant_set_concern_topic', topic_id:this.topic_id}).then(function(data){
                if(data.errorCode==0){
                    if(that.topic_type == 1){
                        //不管返回结果，当作关注成功
                        if($('.follow').hasClass('already')){
                            $('.follow').text('关注');
                            $('.follow').removeClass('already');
                        } else {
                            $('.follow').text('已关注');
                            $('.follow').addClass('already');
                        }

                    } else {
                        if($('.status').hasClass('on')){
                            $('.status').removeClass('on');
                            $('.status span').text('话题关注');
                        } else {
                            $('.status').addClass('on');
                            $('.status span').text('已关注');
                        }
                    }
                }
            });
        },
        initialize: function (data) {
            this.originalsViewInstance = data.originalsViewInstance;
            //初始化变量
            this.page = 1;
            this.lock = true;
            this.hasMore = true;
            $('.loading').hide();
            this.undelegateEvents();
            this.delegateEvents(this.events);
            this.topic_id = data.topic_id;
            var that = this;
            ajax_request({action: 'iwant_get_topic', topic_id: that.topic_id, pige_size: that.page_size}).then(function(data){
                if(data.errorCode>0) {
                   showError(data.errorMsg);
                    return
                }
                that.page++;
                //在此接口返回成功前，禁用加载更多接口
                that.lock = false;
                that.topic_type = data.topic.topic_type;
                if(data.topic.topic_type == 1){ //活动话题
                    var header = _.template(normalHeaderTpl, {title: "活动详情"});
                    $("header").replaceWith(header);
					$('.my_header').click(that.locationToMe);
                } else {  //普通话题
                    var header = _.template(topicHeaderTpl, data.topic);
                    $("header").replaceWith(header);
                    $('.title .text').click(that.fixedDetail);
                    $('.arrow_header').click(that.fixedDetail);
                    $('.my_header').click(that.locationToMe);
                    $('.status').click(function(){
                        that.follow();
                    });
                    if(!_.isEmpty(data.topic.topic_title)) {
                        $('.title_wrap .text').text(data.topic.topic_title);
                    }
                    //$('#me').tap(that.locationToMe);
                }
                that.render(data);
                if(_.isEmpty(data.original_list) || data.original_list<that.page_size) {
                    that.hasMore = false;
                }
                if(!_.isEmpty(data.original_list)){
                    //渲染列表
                    that.originalsViewInstance.initialize(data.original_list,1);
                } else {
                    $('.center#content').append('<div class="nocontent"></div>');
                }
                return ajax_request({action: 'iwant_get_new_message_flag'});
            }).then(function(data){
               if(data && data.errorCode == '0') {
                   //有新消息
                   if(data.new_msg_flag == 1){
                       $('.my_header').html('<span class="dot">dot</span>');
                   }
               }
            }).mobiCatch(function(e){
                  //console.log(e);
                  showError(e.message);
            });

            $(window).off('scroll').on('scroll', function(){
                //如果是普通话题，滚动控制详情隐藏
                if(that.topic_type!=1) {
                    if($(this).scrollTop()!=0) {
                        $('#doc-detail').hide();
                        $('#fixed-detail').css('top', '-100px');
                        $(".arrow_header").addClass("hide");
                    }
                }
                if(!that.lock && $(this).scrollTop() + $(this).height() >= $("body").height() && that.hasMore){
                    that.lock = true;
                    $('.loading').show();
                    ajax_request({action:'iwant_get_original_list',topic_id: that.topic_id, page:that.page, page_size:that.page_size}).then(function(data){
                        that.lock = false;
                        $('.loading').hide();
                        //接口报错
                        if(data.errorCode && data.errorCode > 0){
                            showError(e.message);
                        }else{
                            that.page++;
                            if(data.original_list.length<=0){
                                that.hasMore = false;
                            } else {
                                if(data.original_list.length < that.page_size){
                                    that.hasMore = false;
                                }
                                that.originalsViewInstance.initialize(data.original_list, 1);
								setTimeout(function(){
									$("body").css("height", (parseInt($("#content").height()) + parseInt($("header").height())) + "px");
								}, 300);
                            }
                        }
                    });
                }
            });
        },
        render: function(data) {
            pageSlider.slidePage($(this.template(data)));
            window.scrollTo(0,0);
        }
    });
    return view;
});
