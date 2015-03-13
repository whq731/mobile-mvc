/**
 * Created by 汉清 on 14-8-12.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!src/tpl/iwant/comments.tpl',
    'text!src/tpl/iwant/more-comments.tpl',
    'text!src/tpl/iwant/publish-delete-panel.tpl'
], function ($, _, Backbone, commentsTpl, moreCommentsTpl, publishDeleteTpl) {
    'use strict';
    var commentView = Backbone.View.extend({
        lock: false,
        options: {},
//        topic_detail_info: {original_id:1}, //评论模块初始化需要的数据集合
//        el: '.comment_detail_'+ this.topic_detail_info.original_id,
        pageSize :10,
        template: _.template(commentsTpl),
        events: {
            'tap .praise': 'praise',//点赞
            'tap .comment': 'comment',//发表评论
            'tap .enter': 'enterShare',//分享
            'tap .reply_comment': 'replyComment',//回复评论
            'click .more': 'moreComment',//更多评论
            'tap a[onclick="return false;"]' : 'tapLocation'
        },
        tapLocation: function(){
            if(event.target.href){
                location.href = event.target.href;
            }
        },
        praise: function () {
            $(event.target).removeClass("border");
            if (!this.lock && this.options.topic_detail_info.canShare) {
                this.lock = true;
                var that = this;
                ajax_request({action: 'iwant_set_praise_original', original_id: this.options.topic_detail_info.original_id}).then(function (data) {
                    if (data.errorCode == 0) {
                        //点赞成功,赞数伪加1
                        var praiseCount = that.$el.find(".praise_count");
                        praiseCount.text(Number(praiseCount.text()) + 1);
                    }
                    that.lock = false;
                });
            }
        },
        comment: function () {
            if (this.options.topic_detail_info.canShare) {
                if(sessionStorage && sessionStorage.getItem("temp_publish_content")){
                    $(".publish_content")[0].value = sessionStorage.getItem("temp_publish_content");
                    $(".max_input").html(140 - sessionStorage.getItem("temp_publish_content").length + "字");
                }else{
                    $(".publish_content")[0].value = "";
                    $(".max_input").html("140字");
                }
                // 安卓4.1.2 scrollY可能不准确
                if($_GET.user_client == "iphone" || $_GET.user_client == "ipad"){
                    $(".publish_panel").css("top",window.scrollY + "px").show();
                    // 解决ios触发焦点时自动居中textarea 使整个浮层下移一小段距离
                    $(".publish_content").off("click").on("click", function () {
                        setTimeout(function(){
                            $(".publish_panel").css("top",window.scrollY + "px");
                        },100);
                    });
                } else {
                    $(".publish_panel").css("position","fixed").show();
                    // 如果不能滚动时 则强制scrollTo 0,0 防止安卓4.1 4.2但scrollY获取不正确时 产生白屏
                    if(document.documentElement.offsetHeight < document.documentElement.clientHeight ){
                        $(".publish_content").off("click").on("click", function () {
                            setTimeout(function(){
                                window.scrollTo(0,0);
                            },100);
                        });
                    }
                }
                // 添加评论窗口hash
                location.href = '#commentActive';
                window.commentActive = true;
                $(".publish_title").text("发表评论");
                var that = this;
                $(".ok").off().on("click", function () {
                    var content = $.trim($(".publish_content")[0].value);
                    if (content) {
                        that.publishComment("comment", content);
                    }
                });
            }
        },
        deleteComment: function (reviewId) {
            if (!this.lock) {
                this.lock = true;
                var that = this;
                ajax_request({action: 'iwant_delete_review', review_id: reviewId}).then(function (data) {
                    if (data.errorCode == 0) {
                        //删除成功 删除该条评论
                        that.$el.find("a[data-review-id='" + reviewId + "']").parent("p").remove();
                    } else {
                        showError("删除失败");
                    }
                    that.lock = false;
                    $(".delete_panel").hide();
                });
            }
        },
        replyComment: function () {
            if (this.options.topic_detail_info.canShare) {
                if (event.target.tagName !== "A") {
                    var that = this;
                    var targetUser = $(event.target).find("a").eq(0);
                    var nickName = targetUser.html();
                    var toCustId = targetUser.attr("data-from-cust-id");
                    var isSelf = targetUser.attr("data-self");
                    // 如果是用户自己的评论 弹出删除浮层
                    if (isSelf == "true") {
                        $(".delete_panel").show();
                        $(".delete_panel .del").off().on("tap", function () {
                            var reviewId = targetUser.attr("data-review-id");
                            that.deleteComment(reviewId);
                        });
                    } else {
                        // 回复别人的评论
                        if(sessionStorage && sessionStorage.getItem("temp_publish_content")){
                            $(".publish_content")[0].value = sessionStorage.getItem("temp_publish_content");
                            $(".max_input").html(140 - sessionStorage.getItem("temp_publish_content").length + "字");
                        }else{
                            $(".publish_content")[0].value = "";
                            $(".max_input").html("140字");
                        }
                        // 安卓4.1.2 scrollY可能不准确
                        if($_GET.user_client == "iphone" || $_GET.user_client == "ipad"){
                            $(".publish_panel").css("top",window.scrollY + "px").show();
                            // 解决ios触发焦点时自动居中textarea 使整个浮层下移一小段距离
                            $(".publish_content").off("click").on("click", function () {
                                setTimeout(function(){
                                    $(".publish_panel").css("top",window.scrollY + "px");
                                },100);
                            });
                        } else {
                            $(".publish_panel").css("position","fixed").show();
                            // 如果不能滚动时 则强制scrollTo 0,0 防止安卓4.1 4.2但scrollY获取不正确时 产生白屏
                            if(document.documentElement.offsetHeight < document.documentElement.clientHeight ){
                                $(".publish_content").off("click").on("click", function () {
                                    setTimeout(function(){
                                        window.scrollTo(0,0);
                                    },100);
                                });
                            }
                        }
                        // 添加评论窗口hash
                        location.href = '#commentActive';
                        window.commentActive = true;
                        $(".publish_title").text("回复评论");
                        $(".publish_panel .ok").off().on("click", function () {
                            var content = $.trim($(".publish_content")[0].value);
                            if (content) {
                                that.publishComment("reply", content, toCustId, nickName);
                            }
                        });
                    }
                }
            }
        },
        enterShare: function () {
            var shareTitle = cfg.share_text_prefix + $(".original_id_"+this.options.topic_detail_info.original_id).find("h2").text();
            var shareIcon = this.options.topic_detail_info.share_image || "";
            var shareLink = "http://m.dangdang.com/app_download.html";//app下载地址
            window.location.href = "share://icon=" + encodeURIComponent(shareIcon) + "&title=" + encodeURIComponent(shareTitle) + "&link=" + encodeURIComponent(shareLink) + "&channel=0";
        },
        publishComment: function (commentType, content, toCustId, toNickName) {
            if(sessionStorage){
                sessionStorage.setItem("temp_publish_content", content);
            }
            switch (commentType) {
                case "comment" :
                    if (!this.lock) {
                        this.lock = true;
                        var that = this;
                        ajax_request({action: 'iwant_add_review', original_id: this.options.topic_detail_info.original_id, content: content}).then(function (data) {
                            if (data.errorCode == 0) {
                                // 伪加评论
                                var commentData = {
                                    review_list: [
                                        {
                                            "id": data.last_review_id,
                                            "from_cust_id": data.current_cust_id,
                                            "from_cust_nickname": data.current_nickname,
                                            "type": 0,
                                            "content": content,
                                            "is_self" : true
                                        }
                                    ]
                                };
                                that.addMoreComment(commentData, that.$el.find(".detail"));
                                // 清除草稿
                                if(sessionStorage){
                                    sessionStorage.clear();
                                }
                                // 有新增评论时 去掉为空样式
                                that.$el.find(".detail").removeClass("empty");
                            } else if(data.errorMsg) {
                                showError(data.errorMsg);
                            } else {
                                showError('发送失败');
                            }
                            that.lock = false;
                            // 回退上一个hash 调用路由内的commentReturnBlock 关闭页面 屏蔽前页view的初始化
                            if(data.errorCode != 96){
                                history.back();
                            }
                        });
                    }
                    break;
                case "reply" :
                    if (!this.lock) {
                        this.lock = true;
                        var that = this;
                        ajax_request({action: 'iwant_add_review', original_id: this.options.topic_detail_info.original_id, content: content, to_cust_id: toCustId}).then(function (data) {
                            if (data.errorCode == 0) {
                                // 伪加评论
                                var replyData = {
                                    review_list: [
                                        {
                                            "id": data.last_review_id,
                                            "from_cust_id": data.current_cust_id,
                                            "from_cust_nickname": data.current_nickname,
                                            "to_cust_id": toCustId,
                                            "to_cust_nickname": toNickName,
                                            "type": 1,
                                            "content": content,
                                            "is_self" : true
                                        }
                                    ]
                                };
                                that.addMoreComment(replyData, that.$el.find(".detail"));
                                // 清除草稿
                                if(sessionStorage){
                                    sessionStorage.clear();
                                }
                            }  else if(data.errorMsg) {
                                showError(data.errorMsg);
                            }else {
                                showError('发送失败');
                            }
                            that.lock = false;
                            // 回退上一个hash 调用路由内的commentReturnBlock 关闭页面 屏蔽前页view的初始化
                            if(data.errorCode != 96){
                                history.back();
                            }
                        });
                    }
                    break;
            }
        },
        moreComment: function () {
            var hideComments = this.$el.find(".hide_comments");
            // 如果有隐藏的评论 则先显示隐藏评论
            if(hideComments.length > 0){
                hideComments.show();
                hideComments.removeClass("hide_comments");
            } else {
                var more = this.$el.find(".more");
                var nextPage = more.attr("data-page");
                if (!this.lock) {
                    this.lock = true;
                    var that = this;
                    ajax_request({action: 'iwant_get_review_list', original_id: this.options.topic_detail_info.original_id, page: nextPage, page_size : this.pageSize}).then(function (data) {
                        if (data.errorCode == 0) {
                            nextPage++;
                            more.attr("data-page", nextPage);
                            // 伪增加评论
                            that.addMoreComment(data, that.$el.find(".detail"), "more");
                            if(data.review_list && data.review_list.length < that.pageSize){
                                more.hide();
                            }
                        } else if(data.errorCode == 2){
                            //没有更多评论时隐藏
                            more.hide();
                        }
                        that.lock = false;
                    });
                }
            }
        },
        addMoreComment: function (data, position, more) {
            var html = _.template(moreCommentsTpl)(data);
            // 用户回复加到头 历史回复加到尾
            setTimeout(function () {
                if(more == "more"){
                    position.append(html);
                } else {
                    position.prepend(html);
                }
            }, 0);
        },
        initialize: function (options) {
            this.lock = false;
            this.options = options;
            this.$el = $(options.topic_detail_info.el);
            this.$el.empty();
            this.render();
            this.publishDeletePanelRender();
        },
        render: function () {
            this.$el.html(this.template(this.options));
        },
        publishDeletePanelRender: function () {
            if ($("#publish_delete_panel").length == 0) {
                $("body").append($(publishDeleteTpl));
                $(".publish_panel .cancel").off().on("click", function () {
                    $(".publish_panel").hide();
                    // IOS 前页面动一下 复位+号 按钮
                    if($_GET.user_client == "iphone" || $_GET.user_client == "ipad"){
                        setTimeout(function(){
                            window.scrollTo(0,window.scrollY + 1);
                            window.scrollTo(0,window.scrollY - 1);
                        },100);
                    }
                    history.back();
                });
                $(".delete_panel .cancel").off().on("tap", function () {
                    $(".delete_panel").hide();
                });
                $(".publish_content").off("input").on("input", function () {
                    var currentLength = this.value.length || 0;
                    $(".max_input").html(140 - currentLength + "字");
                });
                $('#publish_delete_panel')[0].addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);
                // 在评论返回前页时 全局lock
                window.commentActive = false;
            }
        }
    });
    return commentView;
});
