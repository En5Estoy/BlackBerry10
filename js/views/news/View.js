define([
  'underscore',
  'backbone',
  'helper/dialogs',
  'collections/news/collection',
  'text!./template.html',
  'text!./row.html',
  'jquery',], function(_, Backbone, dialogs, collection, templateData, templateRow, $) {

  var View = Backbone.View.extend({
    template: _.template(templateData),
    rowTemplate: _.template(templateRow),

    persistence: collection,

    render: function() {
      $("#e5e-container").html(this.template({}));

      var self = this;
      _.defer(function(){
        self.loadNews();
      });

      return this;
    },

    loadNews: function() {
      var self = this;

      dialogs.showLoading();
      this.persistence.fetch({
        success: function() {

          dialogs.hideLoading();

          self.persistence.each(function(news) {
            $("#rows-container").append(self.rowTemplate({
              title: news.get('title'),
              text: news.get('text'),
              url : news.get('url')
            }));
          });
        }
      });
    }

  });

  return View;

});