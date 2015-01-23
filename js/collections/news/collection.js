define([
  'jquery',
  'underscore',
  'backbone',
  'urls',
  './model'
], function($, _, Backbone, urls, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,

    url : function() {
      return urls.news;
    },
    
    initialize: function(){}

  });
 
  return ( new Collection() );
});
