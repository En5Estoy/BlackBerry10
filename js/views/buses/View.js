define([
  'underscore',
  'backbone',
  'urls',
  'stringjs',
  'helper/dialogs',
  'text!./template.html',
  'text!./suggestions.html',
  'text!./row.html',
  'jquery',
  'jquery_hammer'], function(_, Backbone, urls, S, dialogs, templateData, suggestions, row, $) {

  var View = Backbone.View.extend({
    template: _.template(templateData),

    autocomplete: [],

    render: function() {
      $("#e5e-container").html(this.template({}));

      bb.textInput.apply(document.getElementsByTagName('input'));
      bb.dropdown.apply(document.getElementsByTagName('select'));

      //this.refreshAutoComplete();
      //this.loadAutocomplete();

      var self = this;
      _.delay(function() {
        self.loadLines();

        self.joinEvents();
      }, 500);


      return this;
    },

    joinEvents: function() {
      var self = this;

      $("#seeLine").hammer().on('tap', function(event) {
        if ($("#select-line").val() == '-1') {
          dialogs.showToast("Debe seleccionar una línea para continuar.");
        } else {
          window.router.navigate('line-' + $("#select-line").val(), {
            trigger: true
          });
        }

        return false;
      });

      $("#search-buses").hammer().on('tap', function(event) {
        var busFrom = ((_.isUndefined($("#busFrom").val())) ? '' : S($("#busFrom").val()).trim().s);
        var busTo = ((_.isUndefined($("#busTo").val())) ? '' : S($("#busTo").val()).trim().s);

        if (busFrom == '' && busTo == '') {
          dialogs.showToast("Debe completar todos los datos para continuar.");
        } else {

          dialogs.showLoading();

          self.getLocation(((_.isUndefined($("#busFrom").val())) ? '' : S($("#busFrom").val()).trim().s), function(fromLat, fromLon) {
            self.getLocation(((_.isUndefined($("#busTo").val())) ? '' : S($("#busTo").val()).trim().s), function(toLat, toLon) {
              self.searchBus({
                fromLat: fromLat,
                fromLon: fromLon,
                toLat: toLat,
                toLon: toLon
              }, function(response) {
                if (response.length > 0) {
                  dialogs.hideLoading();

                  var s_template = _.template(suggestions);
                  var rowTemplate = _.template(row);

                  window.checkPage();

                  // Change screen
                  $("#e5e-page-container").html(s_template({}));
                  window.router.navigate("buses-result", {
                    trigger: false
                  });

                  _.each(response.slice(0, 9), function(data) {
                    $("#rows-container").append(rowTemplate({
                      name: data.name,
                      distance: data.distance_string,
                      text_from: data.road + ' ' + ((data.number == 0) ? 'S/N' : data.number),
                      company: data.company,
                      text_to: data.destination.road + ' ' + ((data.destination.number == 0) ? 'S/N' : data.destination.number),
                      distance_to: data.destination.distance_string
                    }));
                  });

                  

                  _.defer(function() {
                    $(".bb-action-bar-back-button").get(0).onclick = function(event) {
                      console.info("onclick Event");

                      window.router.navigate('buses', { trigger: true, replace: true });
                    };
                  });

                } else {
                  dialogs.showToast("No se han encontrado resultados.");
                  dialogs.hideLoading();
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
            //console.info(location);
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
        url: urls.stops,
        data: {
          lat: data.fromLat,
          lon: data.fromLon,
          to_lat: data.toLat,
          to_lon: data.toLon
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

    loadLines: function() {
      var self = this;

      $.ajax({
        type: "GET",
        url: urls.lines,
        success: function(response) {
          _.each(response, function(line) {
            $("#select-line").append(new Option(line));
          });

          $("#select-line").get(0).refresh();
        }
      });
    },

  });

  return View;

});