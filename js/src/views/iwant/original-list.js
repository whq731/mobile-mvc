/**
 * Created by 轶卓 on 14-5-14.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!src/tpl/iwant/original.tpl',
    'text!src/tpl/iwant/original-user.tpl',
    'src/views/iwant/pic-slide'
], function ($, _, Backbone, pageTpl,pageTpl2, PicSlideView) {
    'use strict';

    var view = Backbone.View.extend({
        type:1,
        tagName:  'div',
        template: _.template(pageTpl),
        template2: _.template(pageTpl2),
        picSlide:false,
        events: {
            'tap .onepic' : 'showBigPic',
            'tap .delete_original' : 'deleteOriginal',
			'tap a[onclick="return false;"]' : 'tapLocation'		
        },
        deleteOriginal: function(e){
            var target = $(e.currentTarget);
            var original_id = target.attr('data-id');
            var that = this;
            ajax_request({action: 'iwant_delete_original', original_id: original_id}).then(function(data){
                that.model.destroy();
            }).mobiCatch(function(e){
                //console.log(e);
            });
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
            if(window.picSlide) {
                window.picSlide.myScroll = false;
                window.picSlide.initialize({imgData: imgData});
            } else {
                window.picSlide = new PicSlideView({imgData: imgData});
            }

        },
		tapLocation: function(){
            if(event.target.href){
                location.href = event.target.href;
            }
        },
        initialize: function (model, type) {
            this.type = type;
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.model.attributes.search_link = cfg.search_link;
            if(this.type ==2){
                this.$el.html(this.template2(this.model.toJSON()));
                //this.htmlStr = this.template2(this.model.toJSON());
            } else {
                this.$el.html(this.template(this.model.toJSON()));
                //this.htmlStr = this.template(this.model.toJSON());
            }
            this.$el.addClass('act_list_wrap');
            this.$el.addClass('original_id_'+this.model.attributes.original_id);
            return this;
        },
        remove: function() {
            $('.original_id_'+this.model.attributes.original_id).remove();
        }
    });

    return view;
});
