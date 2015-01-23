define([
  'underscore',
  'backbone',
  'bbui',
  'text!views/templates/main.html',
  'text!views/templates/second.html',
  'views/buses/View',
  'views/card/View',
  'views/news/View',
  'views/card_history/View',
  'views/line/View',
  'views/taxi/View',
  'bbm',
  'jquery',
  'jquery_hammer'], function(_, Backbone, bb, mainHtml, secondHtml, BusesView, CardView, NewsView, CardHistoryView, LineView, TaxiView, bbm, $) {

  var mainScreenHtml = mainHtml;
  var secondScreenHtml = secondHtml;

  var AppRouter = Backbone.Router.extend({
    routes: {
      'buses': 'busesView',
      'buses-result': 'busesView',

      'card': 'cardView',
      'card-history-:dni-:card': 'cardHistoryView',

      'line-:line': 'lineView',

      'news': 'newsView',

      'taxi-remis': 'taxiView',
      'taxi-remis-result': 'taxiView',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function() {

    var app_router = new AppRouter;
    window.mainScreen = false;

    var hideNav = function() {
      document.getElementById('action-bar').actionHide();
    };

    /*app_router.on('route', function() {
      console.info(this);
    });*/

    app_router.on('route:defaultAction', function(actions) {
      checkRoot();

      document.getElementById('action-bar').setSelectedTab( document.getElementById('panel-buses') );

      var view = new BusesView();
      view.render();
    });

    app_router.on('route:busesView', function(actions) {
      checkRoot();

      document.getElementById('action-bar').setSelectedTab( document.getElementById('panel-buses') );

      var view = new BusesView();
      view.render();
    });

    app_router.on('route:cardView', function() {
      checkRoot();

      document.getElementById('action-bar').setSelectedTab( document.getElementById('panel-card') );

      var view = new CardView();
      view.render();
    });

    app_router.on('route:cardHistoryView', function(dni, card) {
      checkPage();

      var view = new CardHistoryView({
        dni: dni,
        card: card
      });

      view.render();
    });

    app_router.on('route:lineView', function(line) {
      checkPage();

      var view = new LineView({
        line: line
      });

      view.render();
    });

    app_router.on('route:newsView', function() {
      checkRoot();

      document.getElementById('action-bar').setSelectedTab( document.getElementById('panel-news') );

      var view = new NewsView();
      view.render();
    });

    app_router.on('route:taxiView', function() {
      checkRoot();

      document.getElementById('action-bar').setSelectedTab( document.getElementById('panel-taxi') );

      var view = new TaxiView();
      view.render();
    });

    var joinEvents = function() {
      $("#main-screen").hammer().on('swiperight', function(event) {
        event.preventDefault();
        event.stopPropagation();

        $('.bb-action-bar-tab-overflow-dark').parent().click();

        return false;
      });

      $("#e5e-container").hammer().on("touch", function(ev) {
        if (document.getElementById('action-bar').visible) {
          document.getElementById('action-bar').actionHide();
          document.getElementById('action-bar').doTouchEnd();
        }
      });

      $("#panel-news").hammer().on('touch', function(event) {
        app_router.navigate("news", {
          trigger: true
        });

        hideNav();

        return false;
      });

      $("#panel-buses").hammer().on('touch', function(event) {
        app_router.navigate("#", {
          trigger: true
        });

        hideNav();

        return false;
      });

      $("#panel-card").hammer().on('touch', function(event) {
        app_router.navigate("card", {
          trigger: true
        });

        hideNav();

        return false;
      });

      $("#panel-taxi").hammer().on('touch', function(event) {
        app_router.navigate("taxi-remis", {
          trigger: true
        });

        hideNav();

        return false;
      });

      $("#bbm-invite").hammer().on('touch', function(event) {
        bbm.register(function( registered ) {
          if( registered ) {
            bbm.inviteToDownload();
          } else {
            dialogs.showToast("En 5' Estoy", 'Para compartir con tus amigos tenés que darnos acceso.');
          }
        });

        return false;
      });

      $("#bbm-share").hammer().on('touch', function(event) {
        bbm.shareText("Si queres saber todo sobre los recorridos de colectivos, servicio de taxis, y tarjetas de colectivo de la Ciudad de Córdoba, bajate En 5' Estoy ;)");

        return false;
      });
    };

    var checkRoot = function() {
      if (!window.mainScreen) {
        $('#main-screen').html(_.template(mainScreenHtml));
        if (!$("#main-screen").is(":visible")) {
          $("#main-screen").show();
        }
        bb.initContainer(document.getElementById('main-screen'));
        window.mainScreen = true;

        if ($(document).width() == 720 && $(document).height() == 720) {
          _.defer(function() {
            $(".bb-action-bar-drop-shadow").css("bottom", "108px");
          });
        }

        _.defer(function() {
          $('body').css({ backgroundImage : 'url("")' });

          joinEvents();
        });

        /*window.lastTime = ( (new Date()).getTime() - window.initTime );
        _.delay(function() {
          console.info("Start time: " + window.lastTime );
        }, 6000);*/
      } else {
        document.getElementById('start-screen').scrollTo(0, 0);
      }
    };

    window.checkRoot = checkRoot;

    var checkPage = function() {
      if (window.mainScreen) {
        //mainScreenHtml = $("#main-screen").html();
        $('#main-screen').html(_.template(secondScreenHtml));
        bb.initContainer(document.getElementById('main-screen'));

        if ($(document).width() == 720 && $(document).height() == 720) {
          _.defer(function() {
            $(".bb-action-bar-drop-shadow").css("bottom", "108px");
          });
        }

        window.mainScreen = false;
      }
    };

    window.checkPage = checkPage;

    Backbone.history.start({
      pushState: false
    });

    // Global var for router
    window.router = app_router;
  };

  return {
    initialize: initialize
  };
});