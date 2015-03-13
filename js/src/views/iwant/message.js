/**
 * Created by 杨骏 on 14-8-18.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    //todo-start:加载你所需要的模块及html模板
    'text!src/tpl/iwant/message.tpl',//主框架
	'text!src/tpl/iwant/message-detail.tpl'//,//列表
    //'iscroll'
    //todo-end:加载你所需要的模块
], function ($, _, Backbone, pageTpl, detailTpl/*, myModel, myTemplate, iScroll*/) {
    'use strict';
	
    var view = Backbone.View.extend({
        el: 'body',	
        template: _.template(pageTpl),
		loading: $(".loading"),
		page: 2,
		page_size: cfg.page_size,
		loading_flag: true,
		scroll_flag: true,
		interval: null,
        events: {
        },
		bindEvent: function(){
			var that = this;
			$(".message").find("li.jump").off("tap").on("tap", function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				var target = $(ev.target),
					url = "";
				if(target.is(".jump")){
					url = "#message/" + target.attr("message_id");
				}else if(target.is(".reply")){
					url = "#me/" + target.attr("to_cust_id");
				}else if(target.is(".name")){
					url = "#me/" + target.attr("cust_id");
				}else if(target.is(".img")){
					url = "#me/" + target.attr("cust_id");
				}else if(target.is(".img_img")){
					url = "#me/" + target.closest(".img").attr("cust_id");
				}else if(target.is(".topic")){
					url = "#message/" + target.attr("topic_id");
				}else if(target.is(".topic_img")){
					url = "#message/" + target.closest(".topic").attr("topic_id");
				}else{
					url = "#message/" + target.closest(".jump").attr("message_id");
				}
				window.location.href = url;
			});
		},
		loadTemplate: function(){
			var that = this;
			if(that.loading_flag){
				that.loading_flag = false;
				ajax_request({action:'iwant_get_message_list', page:1, page_size:that.page_size}).then(function(data){
					that.loading_flag = true;
					//隐藏加载loading
					$('.action_loading').hide();
					if(data.errorCode == 0){
						//加载主框架
						try{
							that.render();
						}catch(e){
							throw new Error({message:"Template error occurred!(message.tpl)"});
						}

						//设置标题
						$("header .text").html("消息");
						$("header .i_header").remove();
						
						//加载列表内容
						if(data.message_list.length <= 0){
							that.loading_flag = false;
							that.loading.hide();
							$(".message").remove();
							$("#frame").append("<div class='nocontent'></div>");
						}else if(data.message_list.length < that.page_size){
							that.loading_flag = false;
							that.loading.hide();
							try{
								setTimeout(function(){
									$(".message ul").empty().append(_.template(detailTpl)(data));
								}, 300);
							}catch(e){
								throw new Error({message:"Template error occurred!(message-detail.tpl)"});
							}
						}else{
							try{
								setTimeout(function(){
									$(".message ul").empty().append(_.template(detailTpl)(data));
								}, 300);
							}catch(e){
								throw new Error({message:"Template error occurred!(message-detail.tpl)"});
							}
							if(data.message_list.length >= that.page_size){
								var wi = $("body").offsetWidth;
								that.scroll_flag = true;
								//滚动加载
								setTimeout(function(){
									$(window).off('scroll').on('scroll', function(){
										if(that.loading_flag && $(this).scrollTop() + $(this).height() >= $("body").height()){
											that.loading_flag = false;
											that.loading.show();
											if(!that.scroll_flag){
												that.loading.hide();
											}console.log(that.scroll_flag);
											ajax_request({action:'iwant_get_message_list', page:that.page, page_size:that.page_size}).then(function(data){
												that.loading_flag = true;
												if(data.errorCode == 0){
													that.page++;
													that.loading.hide();
													try{
														$(".message ul").append(_.template(detailTpl)(data));
													}catch(e){
														throw new Error({message:"Template error occurred!(message-detail.tpl)"});
													}
													data.scrollload = true;
													if(data.message_list.length < that.page_size){
														that.loading_flag = false;
														that.scroll_flag = false;
													}else{
														that.scroll_flag = true;
													}
													//绑定事件
													setTimeout(that.bindEvent, 300);
												}else{
													that.catchError({});
												}
											});
										}
										setTimeout(function(){
											that.loadImages();
										}, 0);
									});
								}, 300);
							}
						}
						//绑定事件
						setTimeout(that.bindEvent, 300);
						setTimeout(function(){
							that.loadImages();
						}, 0);
					}else{
						that.catchError({});
					}
				}).mobiCatch(function(e){
					//console.log(e);
					that.loading.hide();
				});
			}
		},
		catchError: function(e){
			var that = this;
			//console.log(e);
            if(!e.message) {
            	e.message = '服务器错误，请稍后重试';
            }else if(e.message.indexOf('undefined') != -1 || e.message.indexOf('null') != -1) {
            	e.message = '数据错误，请稍后重试';
            }
			that.loading.hide();
            //showError(e.message);
            //var maskHeight = $(document).height()<window.innerHeight?window.innerHeight:$(document).height();
            //$('.mask').height(maskHeight).show();
            //$('.alert p').text(e.message);
			//$('.alert').show().css('left', window.innerWidth/2 -$('.alert').width()/2).css('top', window.scrollY + window.innerHeight/2 - $('.alert').height()/2 +"px"); //居中显示
		},
        loadImages: function() {
            var that = this;
            $('.lazy').each(function(){
                if($(window).scrollTop() + $(window).height() >= $(this).offset().top){
                    that.images($(this));
                }
            });
        },
        images: function(imgobj) {
            var img = new Image();
            var imgsrc=imgobj.attr('imgsrc');
            img.onload = function () {
                if(img.complete==true){
                    imgobj.attr('src', imgsrc);
                    imgobj.removeClass('lazy');
                    imgobj.removeAttr('imgsrc');
                }
            };
            img.src = imgsrc;
        },
        //todo-start:new view以后会先运行initialize，剩下的靠自己写了
        initialize: function(){
			var that = this;
			that.page = 2;
			that.loading_flag = true;
			//显示加载loading
			$('.action_loading').show();
			//解除绑定
			$(window).off('scroll');
			that.loading.hide();
			
			//加载页面内容
			that.loadTemplate();
        },
        render: function() {
            //一开始，为页面滑动render一个容器，所有该页面的新内容，均放在这个新容器中
			pageSlider.slidePage($(this.template()));
			$("body").scrollTop(0);
        }
        //todo-start:new view以后会先运行这个函数，剩下的靠自己写了
    });

    return view;
});
