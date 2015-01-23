define([
  'underscore',
  'backbone',
  'urls',
  'collections/history/collection',
  'text!./template.html',
  'helper/dialogs',
  'jquery',
  'jquery_unveil',
  'jquery_hammer'], function(_, Backbone, urls, collection, templateData, dialogs, $) {

  var View = Backbone.View.extend({
    template: _.template(templateData),

    session : '',
    persistence : collection,

    render: function() {
      $("#e5e-container").html(this.template({}));

      bb.textInput.apply(document.getElementsByTagName('input'));

      var self = this;
      _.defer(function(){
        $("#dnitxt").val(localStorage.getItem("dni"));
        $("#cardtxt").val(localStorage.getItem("card"));

        self.createSession();

        self.joinEvents();
      });

      return this;
    },

    joinEvents : function() {
      var self = this;

      $("#request").hammer().on('tap', function(event) {
        var dni = $("#dnitxt").val();
        var card = $("#cardtxt").val();

        if( _.isEmpty(dni) || _.isEmpty(card) ) {
          dialogs.showToast('Debe completar todos los campos para realizar la consulta.');

          return;
        }

        self.requestData();

        return false;
      });

      $("#history").hammer().on('tap', function(event) {
        var dni = $("#dnitxt").val();
        var card = $("#cardtxt").val();

        if( _.isEmpty(dni) || _.isEmpty(card) ) {
          dialogs.showToast('Debe completar al ménos D.N.I y Tarjeta para consultar su historial.');

          return;
        }

        self.openHistory();

        return false;
      });
    },

    requestData : function() {
      var self = this;

      // Save data on localStorage and load them again if exists.

      var dni = $("#dnitxt").val();
      var card = $("#cardtxt").val();
      var captcha = $("#captchatxt").val();

      localStorage.setItem("dni", dni);
      localStorage.setItem("card", card);

      $.ajax({
        type: "POST",
        url: urls.send_saldo,
        data : {
          dni : dni,
          card: card,
          captcha: captcha,
          cookie: this.session
        },
        dataType: "json",
        success: function(response) {

          if( response.result && response.data.balance != '' ) {
            self.persistence.create( _.extend( response.data, { dni : dni, card: card } ) );

            self.openHistory();
          } else {
            dialogs.showToast('Es posible que no haya ingresado todos los datos necesarios o su tarjeta no se encuentre debidamente registrada.');
          }
        }
      });
    },

    openHistory : function() {
      var dni = $("#dnitxt").val();
      var card = $("#cardtxt").val();

      window.router.navigate('card-history-' + dni + '-' + card, {trigger: true});
    },

    createSession : function() {
      var self = this;

      $.ajax({
        type: "GET",
        url: urls.get_saldo,
        dataType: "json",
        success: function(response) {
          self.session = response.cookie;

          $("#captcha").attr('src', urls.captcha_saldo + self.session);
        }
      });
    }
  });

  return View;

});