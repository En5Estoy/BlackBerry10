define([
  'underscore',
  'backbone',
  'urls',
  'helper/dialogs',
  'stringjs',
  'helper/dialogs',
  'text!./template.html',
  'text!./suggestions.html',
  'text!./row.html',
  'jquery',
  'jquery_hammer'], function(_, Backbone, urls, dialogs, S, dialogs, templateData, suggestions, row, $) {

  var View = Backbone.View.extend({
    template: _.template(templateData),

    autocomplete: [],

    render: function() {
      $("#e5e-container").html(this.template({}));

      //bb.initContainer(this.el);
      bb.textInput.apply(document.getElementsByTagName('input'));

      //this.refreshAutoComplete();
      //this.loadAutocomplete();
      var self = this;
      _.defer(function() {
        self.joinEvents();
      });

      return this;
    },

    joinEvents: function() {
      var self = this;

      $("#search-taxis").hammer().on('tap', function(event) {
        var busFrom = ((_.isUndefined($("#taxiFrom").val())) ? '' : S($("#taxiFrom").val()).trim().s);
        var busTo = ((_.isUndefined($("#taxiTo").val())) ? '' : S($("#taxiTo").val()).trim().s);

        if (busFrom == '' && busTo == '') {
          dialogs.showToast("Debe completar todos los datos para continuar.");
        } else {
          dialogs.showLoading();

          self.getLocation(((_.isUndefined($("#taxiFrom").val())) ? '' : S($("#taxiFrom").val()).trim().s), function(fromLat, fromLon) {
            self.getLocation(((_.isUndefined($("#taxiTo").val())) ? '' : S($("#taxiTo").val()).trim().s), function(toLat, toLon) {
              self.searchBus({
                fromLat: fromLat,
                fromLon: fromLon,
                toLat: toLat,
                toLon: toLon
              }, function(response) {
                if (response.result == true) {
                  dialogs.hideLoading();

                  var data = response.data;

                  var s_template = _.template(suggestions);
                  var rowTemplate = _.template(row);

                  window.router.navigate("taxi-remis-result", {
                    trigger: false
                  });
                  window.checkPage();

                  // Change screen
                  $("#e5e-page-container").html(s_template({
                    from_address: data.start_address,
                    to_address: data.end_address,
                    price: data.price,
                    distance: data.mts_string,
                    duration: data.duration
                  }));

                  _.each(data.steps, function(step) {
                    $("#rows-container").append(rowTemplate({
                      instructions: step.html_instructions,
                      distance: step.distance.text,
                      duration: step.duration.text
                    }));
                  });

                  _.defer(function() {
                    $(".bb-action-bar-back-button").get(0).onclick = function(event) {
                      console.info("Back pressed");

                      window.router.navigate('taxi-remis', { trigger: true, replace: true });
                      //$("#panel-taxi").click();
                    };
                  });
                } else {
                  dialogs.showToast("No se han encontrado resultados.");
                  $.mobile.loading('hide');
                }
              });
            });
          });
        }

        return false;
      })
    },

    getLocation: function(location, callback) {
      var busFrom = location;

      if (busFrom == '') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(location) {
            callback(location.coords.latitude, location.coords.longitude);
          });
        }
      } else {
        if (!S(busFrom).contains(',')) {
          busFrom += ' , Córdoba, Argentina';
        }

        $.ajax({
          type: "GET",
          url: urls.geocode + encodeURIComponent(busFrom),
          dataType: 'json',
          success: function(response) {
            if (response.results.length > 0) {
              var coords = response.results[0].geometry.location;
              callback(coords.lat, coords.lng);
            } else {
              dialogs.showToast("No se pudo encontrar la dirección ingresada.");
              dialogs.hideLoading();
            }
          }
        });
      }
    },

    searchBus: function(data, callback) {
      $.ajax({
        type: "POST",
        url: urls.taxi,
        data: {
          gps_from: data.fromLat + ',' + data.fromLon,
          gps_to: data.toLat + ',' + data.toLon,
        },
        dataType: 'json',
        success: function(response) {
          callback(response);
        }
      });
    },

    loadAutocomplete: function() {
      // Load from localstorage and update it with the connection
      var self = this;

      if ($("#autocomplete").is(':empty')) {
        $.ajax({
          type: "GET",
          url: urls.streets,
          success: function(response) {
            localStorage.setItem('autocomplete', response);

            self.refreshAutoComplete();
          }
        });
      }
    },

    refreshAutoComplete: function() {
      var self = this;

      if (localStorage.getItem('autocomplete')) {
        this.autocomplete = localStorage.getItem('autocomplete').split(',');

        _.each(this.autocomplete, function(data) {
          $("#autocomplete").append('<option value="' + data + '">');
        });
      }
    },

  });

  return View;

});