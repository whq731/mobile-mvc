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
    'backbone',
    'src/views/iwant/originals'
], function ($, Backbone, Originals) {
    'use strict';

    var Workspace = Backbone.Router.extend({
        global:{a:1},
        //原创列表渲染使用单例，多例会对collections的改变多次监听回调
        originalsViewInstance: new Originals({}),
        //todo-start: 定义你自己的路由
        routes: {
			'':'loadView',
			'home':'loadView',
			'topic':'topiclistView',
            'topic/:id':'topicView',
			'message':'messageView',
            'message/:id': 'messageDetailView',
            'me/:id':'meView',
            'me':'meView',
            'commentActive':'commentBack'
        },
		initBodyHeight: function(){
			//初始化body高度
			$("body").css("height", "auto");

		},
        commonReturnBlock: function(){
          if(window.commentActive == true){
              $(".publish_panel").hide();
              window.commentActive = false;
              // 防止安卓4.1 4.2不可滚动的页面scrollY错误时 白屏
              if( !($_GET.user_client == "iphone" || $_GET.user_client == "ipad") && document.documentElement.offsetHeight < document.documentElement.clientHeight ){
                  setTimeout(function(){
                      window.scrollTo(0,0);
                  },100);
              }
              return true;
          } else if(window.photoActive == true) {
              $('#slide-pic').remove();
              window.photoActive = false;
              return true;
          } else {
              return false;
          }
        },
        meView: function(id){
            var that = this;
            if(!id){
                id=0;
            }
			that.initBodyHeight();
            if(that.commonReturnBlock()){
                return ;
            }
            require(['src/views/iwant/me'], function(PageView){
                if(that.meViewInstance) {
                    that.meViewInstance.initialize({cust_id:id, originalsViewInstance:that.originalsViewInstance});
                } else {
                    that.meViewInstance = new PageView({cust_id:id, originalsViewInstance:that.originalsViewInstance});
                }
            });
        },
        topicView: function(id){
            var that = this;
			that.initBodyHeight();
            if(that.commonReturnBlock()){
                return ;
            }
            require(['src/views/iwant/topic'], function(PageView){
                if(that.topicViewInstance) {
                    that.topicViewInstance.initialize({topic_id:id, originalsViewInstance:that.originalsViewInstance});
                } else {
                    that.topicViewInstance = new PageView({topic_id:id, originalsViewInstance:that.originalsViewInstance});
                }
            });
        },
        loadView: function() {
			var that = this;
			that.initBodyHeight();
            if(that.commonReturnBlock()){
                return ;
            }
			require(['src/views/iwant/home'], function(PageView){
                if(that.loadViewInstance) {
                    that.loadViewInstance.initialize();
                } else {
                    that.loadViewInstance = new PageView();
                }
            });
        },
		topiclistView: function() {
			var that = this;
			that.initBodyHeight();
            if(that.commonReturnBlock()){
                return ;
            }
			require(['src/views/iwant/topiclist'], function(PageView){
                if(that.topiclistViewInstance) {
                    that.topiclistViewInstance.initialize();
                } else {
                    that.topiclistViewInstance = new PageView();
                }
            });
        },
		messageView: function() {
			var that = this;
			that.initBodyHeight();
            if(that.commonReturnBlock()){
                return ;
            }
			require(['src/views/iwant/message'], function(PageView){
                if(that.messageViewInstance) {
                    that.messageViewInstance.initialize();
                } else {
                    that.messageViewInstance = new PageView();
                }
            });
        },
        messageDetailView: function(id){
            var that = this;
			that.initBodyHeight();
            if(that.commonReturnBlock()){
                return ;
            }
            require(['src/views/iwant/msg-detail'], function(PageView){
                if(that.messageDetailInstance) {
                    that.messageDetailInstance.initialize({msg_id:id, originalsViewInstance:that.originalsViewInstance});
                } else {
                    that.messageDetailInstance = new PageView({msg_id:id, originalsViewInstance:that.originalsViewInstance});
                }
            });
        },
        commentBack: function(){
            if($("#publish_delete_panel").length == 0){
                history.back();
            }
        }
        //todo-end: 定义你自己的路由处理函数
    });

    return Workspace;
});
