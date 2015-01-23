document.addEventListener("webworksready", function() {
  require.config({
    urlArgs: "bust=" + (new Date()).getTime(), // Just for Development
    paths: {

      jquery: 'libs/jquery/jquery',
      jquery_depend: 'libs/jquery/jquery.depend',
      jquery_unveil: 'libs/jquery/jquery.unveil.min',

      jquery_hammer: 'libs/jquery/jquery.hammer.min',

      stringjs: 'libs/stringjs/string.min',

      bbui: 'libs/bbui/bbui-min',

      bbm: 'libs/bbm/bbm',

      underscore: 'libs/underscore/underscore',
      backbone: 'libs/backbone/backbone',
      localStorage: 'libs/localStorage/backbone.localStorage',
      text: 'libs/backbone/text',

      collections: 'collections',

      helper: 'helpers',

      urls: 'urls'
    },
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'localStorage': {
        deps: ['backbone'],
        exports: 'localStorage'
      },
      'underscore': {
        exports: '_'
      },
      'jquery': {
        exports: '$'
      },
      'jquery_depend': {
        deps: ['jquery']
      },
      'jquery_unveil': {
        deps: ['jquery']
      },
      'jquery_hammer': {
        deps: ['jquery']
      },
      'bbui': {
        exports: 'bb'
      }
    }
  });

  //window.initTime = (new Date()).getTime();

  require(['app', 'stringjs', 'bbui'], function(App, S, bb) {

    S.extendPrototype();

    var config;

    // Toggle our coloring for testing 
    config = {
      controlsDark: false,
      listsDark: false,
      coloredTitleBar: false
    };

    // You must call init on bbUI before any other code loads.  
    // If you want default functionality simply don't pass any parameters.. bb.init();
    bb.init(config);

    App.initialize();
  });

});