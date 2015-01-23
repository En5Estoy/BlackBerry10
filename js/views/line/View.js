define([
  'underscore',
  'backbone',
  'helper/dialogs',
  'urls',
  'text!./template.html',
  'text!./row.html',
  'jquery',
  'jquery_hammer'], function(_, Backbone, dialogs, urls, templateData, templateRow, $) {

  var View = Backbone.View.extend({
    template: _.template(templateData),
    rowTemplate: _.template(templateRow),

    isReturnEmpty: false,

    render: function() {
      $("#e5e-page-container").html(this.template({
        line: this.options.line
      }));

      var self = this;
      _.defer(function() {
        self.loadLine();

        self.joinEvents();
      });

      return this;
    },

    joinEvents: function() {
      var self = this;

      $(".bb-action-bar-back-button").get(0).onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();

        window.router.navigate('#', { trigger: true });
      };

      $("#goBtn").hammer().on("tap", function(event) {
        $("#go-rows-container").show();
        $("#return-rows-container").hide();

        return false;
      });

      $("#returnBtn").hammer().on("tap", function(event) {
        if (self.isReturnEmpty) {
          return false;
        }

        $("#go-rows-container").hide();
        $("#return-rows-container").show();

        return false;
      });
    },

    loadLine: function() {
      var self = this;

      dialogs.showLoading();
      $.ajax({
        type: "POST",
        url: urls.lines,
        data: {
          name: self.options.line
        },
        dataType: "json",
        success: function(response) {
          _.each(response.going, function(data) {
            $("#go-rows-container").append(self.rowTemplate({
              title: data.road + ' ' + ((data.number == 0) ? 'S/N' : data.number),
              text: ((data.bus_station == true) ? data.description : '')
            }));
          });

          if (response.return.length > 0) {
            _.each(response.return, function(data) {
              $("#return-rows-container").append(self.rowTemplate({
                title: data.road + ' ' + ((data.number == 0) ? 'S/N' : data.number),
                text: ((data.bus_station == true) ? data.description : '')
              }));
            });
          } else {
            self.isReturnEmpty = true;
          }

          dialogs.hideLoading();
        }
      });

    }

  });

  return View;

});