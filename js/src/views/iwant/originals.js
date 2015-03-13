/**
 * Created by 轶卓 on 14-5-14.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'src/collections/iwant/originals',
    'src/models/iwant/original-model',
    'src/views/iwant/original-list',
    'src/views/iwant/comment'
], function ($, _, Backbone, Originals, Original, ListView, CommentView/*, myModel, myTemplate, iScroll*/) {
    'use strict';

    var view = Backbone.View.extend({
        el: 'body',
        type:1,
        events: {
        },
        //type: 1 普通渲染 2 用户列表页特殊渲染
        initialize: function (data, type) {
            this.type = type;
            //Originals.reset();
            this.stopListening();
            this.listenTo(Originals, 'add', this.addOriginals);

            if(!_.isEmpty(data)) {
                _.each(data, function(value){
                    var temp = new Original(value);
                    Originals.add(temp);
                });
            }
        },
        addOriginals:function(model){
            var view = new ListView({model: model}, this.type);
            setTimeout(function(){
                $('.center#content').append(view.render().el);
                //准备comment
                var options = {};
                options.topic_detail_info={
                    original_id: model.attributes.original_id,
                    canShare: true,
                    praise_count: model.attributes.praised_count,
                    review_list: model.attributes.review_list,
                    el: '.center #comment_detail_'+model.attributes.original_id
                    //share_image:
                };
                if(!_.isEmpty(model.attributes.image_list)) {
                    options.topic_detail_info.share_image = model.attributes.image_list[0].big;
                } else {
                    options.topic_detail_info.share_image = '';
                }
                var comment = new CommentView(options);
            }, 0);
        }
    });

    return view;
});
