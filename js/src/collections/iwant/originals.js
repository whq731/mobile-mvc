/**
 * Created by 轶卓 on 14-8-15.
 * 原创内容列表的collections
 */
define([
    'underscore',
    'backbone',
    'src/models/iwant/original-model'
], function (_, Backbone, original) {
    'use strict';

    var OriginalCollection = Backbone.Collection.extend({
        //使用Order的model
        model: original
    });

    return new OriginalCollection();
});
