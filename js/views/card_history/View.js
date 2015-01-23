define([
  'underscore',
  'backbone',
  'collections/history/collection',
  'text!./template.html',
  'text!./row.html',
  'jquery',], function(_, Backbone, collection, templateData, templateRow, $) {

  var View = Backbone.View.extend({
    template: _.template(templateData),
    rowTemplate: _.template(templateRow),

    persistence: collection,

    render: function() {
      $("#e5e-page-container").html(this.template({}));

      window.checkPage();

      this.loadHistory();

      $(".bb-action-bar-back-button").get(0).onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();

        window.router.navigate('#card', { trigger: true });
      };

      return this;
    },

    loadHistory: function() {
      var self = this;

      _.each(this.persistence.where({
        dni: this.options.dni,
        card: this.options.card
      }),function(history) {
        $("#rows-container").append(self.rowTemplate({
          line: history.get('line'),
          date: history.get('date'),
          ammount: history.get('balance')
        }));
      });
    }

  });

  return View;

});