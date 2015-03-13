/**
 * Created by 魏汉清 on 2014/8/19.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'src/views/iwant/originals',
    'text!src/tpl/iwant/header-me.tpl',
    'text!src/tpl/iwant/me.tpl'
], function ($, _, Backbone, OriginalsView,meHeaderTpl,pageTpl/*, myModel, myTemplate, iScroll*/) {
    'use strict';

    var view = Backbone.View.extend({
        el: 'body',
        template: _.template(pageTpl),
        originalsViewInstance:false,
        page_size: cfg.page_size,
        events: {
        },
        initialize: function (data){
            //初始化变量
            this.page = 1;
            this.lock = true;
            this.hasMore = true;
            this.cust_id = '';
            this.originalsViewInstance = data.originalsViewInstance;
            $('.loading').hide();
            var requestParam = {action: 'iwant_get_user'};
            if(data.cust_id>0){
                requestParam.cust_id = data.cust_id;
                this.cust_id = data.cust_id;
            }
            requestParam.page = this.page;
            requestParam.page_size = this.page_size;
            var that = this;
            ajax_request(requestParam).then(function(data){
                if(data.errorCode == 0) {
					$('#frame > .nocontent').remove();
                    that.page++;
                    //在此接口返回成功前，禁用加载更多接口
                    that.lock = false;
                    var meHeader = _.template(meHeaderTpl,data.user_info);
                    $("header").replaceWith(meHeader);
                    that.render(data);
                    if(_.isEmpty(data.original_list) || data.original_list.length<that.pige_size) {
                        that.hasMore = false;
                    }
                    if(!_.isEmpty(data.original_list)){
                        //渲染列表
                        that.originalsViewInstance.initialize(data.original_list, 2);
                    } else {
                        $('.center#content').append('<div class="nocontent"></div>');
                    }
                    //有新消息
                    if(data.user_info.new_msg_cnt > 0 &&  data.user_info.new_msg_cnt<100){
                        $('.i_header').html('<span class="dot">' + data.user_info.new_msg_cnt + '</span>');
                    } else if(data.user_info.new_msg_cnt >= 100) {
                        $('.i_header').html('<span class="dot">99+</span>');
                    }
                    // TODO 增加修改昵称的入口 调客户端字典
                    if(window.cfg.changeName && data.user_info.is_self){
                        var changeName = function(){
                            location.href = "changeName://";
                        }
                        $("header .text").off().on("tap",changeName);
                        $("#content img").off().on("tap",changeName);
                    }
                    return ajax_request({action: 'iwant_get_new_message_flag'});
                }

            }).mobiCatch(function(e){
                showError(e.message);
            });

            $(window).off('scroll').on('scroll', function(){
                if(!that.hasMore){
                    $(window).off('scroll');
                }
                if(!that.lock && $(this).scrollTop() + $(this).height() >= $("body").height() && that.hasMore){
                    that.lock = true;
                    $('.loading').show();
                    ajax_request({action:'iwant_get_user_original_list', page:that.page, page_size:that.page_size, cust_id:that.cust_id}).then(function(data){
                        that.lock = false;
                        $('.loading').hide();
                        //接口报错
                        if(data.errorCode && data.errorCode > 0){
                            showError(data.errorMsg);
                        }else{
                            that.page++;
                            if(data.original_list.length<=0){
                                that.hasMore = false;
                            } else {
                                if(data.original_list.length < that.page_size){
                                    that.hasMore = false;
                                }
                                that.originalsViewInstance.initialize(data.original_list, 2);
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
