/**
 * Created by 杨骏 on 14-8-18.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    //todo-start:加载你所需要的模块及html模板
    'text!src/tpl/iwant/topiclist.tpl',//主框架
	'text!src/tpl/iwant/optionbutton.tpl',//选项卡
	'text!src/tpl/iwant/topiclist-detail.tpl',//列表
	'text!src/tpl/iwant/topiclist-no.tpl',//无内容表
	'text!src/tpl/iwant/header-self.tpl'//,
    //'iscroll'
    //todo-end:加载你所需要的模块
], function ($, _, Backbone, pageTpl, optionTpl, detailTpl, noTpl, headerTpl/*, myModel, myTemplate, iScroll*/) {
    'use strict';
	
    var view = Backbone.View.extend({
        el: 'body',	
        template: _.template(pageTpl),
		loading: "#loading-inner",
		page: 2,
		page_size: cfg.page_size,
		loading_flag: true,
		interval: null,
        events: {
			"click #all": function(){
				location.href = '#home';
			},
			"click #my":function(){
				location.href = '#topic';
			}
        },
		bindEvent: function(obj){
			var that = this;
			obj.each(function(key, val){
				var $this = $(this);
				$this.off("tap").on("tap", function(ev){
					window.location.href = $(this).attr("url");
				});
			});
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
		loadTemplate: function(){
			var that = this;
			if(that.loading_flag){
				that.loading_flag = false;
				ajax_request({action:'iwant_get_my_concern_topic_list', page:1, page_size:that.page_size}).then(function(data){
					that.loading_flag = true;
					//隐藏加载loading
					$('.action_loading').hide();
					if(data.errorCode == 0){
						//加载主框架
						try{
							that.render();
						}catch(e){
							throw new Error({message:"Template error occurred!(topiclist.tpl)"});
						}
						//设置标题
						//加载标题
						try{
							var header = _.template(headerTpl, {title: "iWant"});
							$("header").replaceWith(header);
							$('.my_header').click(that.locationToMe);
						}catch(e){
							throw new Error({message:"Template error occurred!(header-self.tpl)"});
						}
			
						//加载选项卡
						try{
							$(".change_label").empty().append(_.template(optionTpl)({channel:["topiclist"]}));
						}catch(e){
							throw new Error({message:"Template error occurred!(optionbutton.tpl)"});
						}
						
						//加载列表内容
						if(data.result_list.length <= 0){
							try{
								setTimeout(function(){
									$(".index_list .topic").empty().append(_.template(noTpl)());
									var reflow = document.body.offsetWidth;//强制页面reflow
								}, 300);
							}catch(e){
								throw new Error({message:"Template error occurred!(topiclist-no.tpl)"});
							}
							that.loading_flag = false;
							$(that.loading).hide();
						}else{
							try{
								setTimeout(function(){
									$(".index_list .topic").empty().append(_.template(detailTpl)(data));
									that.bindEvent($(".index_list .topic a.detail"));
									var reflow = document.body.offsetWidth;//强制页面reflow
								}, 300);
							}catch(e){
								throw new Error({message:"Template error occurred!(topiclist-detail.tpl)"});
							}
							if(data.result_list.length >= that.page_size){
								var wi = $("body").offsetWidth;
								//滚动加载
								setTimeout(function(){
									$(that.loading).show();
									$(window).off('scroll').on('scroll', function(){
										if(that.loading_flag && $(this).scrollTop() + $(this).height() >= $("#topiclist_content").height()){
											that.loading_flag = false;
											ajax_request({action:'iwant_get_my_concern_topic_list', page:that.page, page_size:that.page_size}).then(function(data){
												that.loading_flag = true;
												if(data.errorCode == 0){
													that.page++;
													try{
														$(".index_list .topic").append(_.template(detailTpl)(data));
													}catch(e){
														throw new Error({message:"Template error occurred!(topiclist-detail.tpl)"});
													}
													that.bindEvent($(".index_list .topic a.detail"));
													data.scrollload = true;
													if(data.result_list.length >= that.page_size){
														$(that.loading).show();
													}else{
														that.loading_flag = false;
														$(that.loading).hide();
													}
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
							}else{
								that.loading_flag = false;
								$(that.loading).hide();
							}
						}
					}else{
						that.catchError({});
					}
					return ajax_request({action: 'iwant_get_new_message_flag'});
				}).then(function(data){
				   if(data && data.errorCode == '0') {
					   //有新消息
					   if(data.new_msg_flag == 1){
						   $('.my_header').html('<span class="dot">99+</span>');
					   }
				   }
				}).mobiCatch(function(e){
					//console.log(e);
					$(that.loading).hide();
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
			$(that.loading).hide();
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
			$(that.loading).hide();
			//解除绑定
			$(window).off('scroll');
			
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
