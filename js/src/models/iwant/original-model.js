/**
 * Created by 轶卓 on 14-8-15.
 */
define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var myModel = Backbone.Model.extend({
        initialize:function(){

        },
        defaults: {
            praised_count:0,
            review_list: [],
            original_id:0,
            current_cust_id:0,
            current_nick_name: ''
        },
        validate:function(attributes) {
            if(attributes.userName == '') {
                return "email不能为空";
            }
        }
    });

    return myModel;
});
