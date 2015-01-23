define([
  'jquery',
  'underscore',
  'backbone',
  'localStorage',
  './model'
], function($, _, Backbone, localStorage, Model){
  var Collection = Backbone.Collection.extend({
    model: Model,

    // Enable localStorage
    localStorage: new Backbone.LocalStorage("history"),
    
    initialize: function(){
      this.fetch();
    }

  });
 
  return ( new Collection() );
});
