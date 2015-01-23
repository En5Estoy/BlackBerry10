define([
  'underscore',
  'backbone',
  'jquery',
  'jquery_mobile',
  'jquery_transit'], function(_, Backbone, $) {

  var View = Backbone.View.extend({
    news: undefined,
    news_current: 0,
    news_interval: undefined,

    render: function() {
      this.initFeedReader();

      return this;
    },

    initFeedReader: function() {
      var self = this;

      $.ajax({
        type: "POST",
        url: 'http://54.243.218.97:3000/news',
        data: {
          url: 'http://elnuevodia.feedsportal.com/c/34275/f/623466/index.rss'
        },
        dataType: "xml",
        success: function(xml) {
          self.news = $(xml).find('item');

          self.news_current = 0;
          self.showNews();
        }
      });
    },

    showNews: function() {
      var self = this;

      if (self.news_interval != undefined) {
        window.clearInterval(self.news_interval);
      }
      self.showNew();
      self.news_interval = window.setInterval(function() {
        self.showNew();
      }, ( 10 * 1000));
    },

    showNew: function() {
      var self = this;

      $('#e5e_news_content').transition({
        opacity: 0,
        complete: function() {
          if (self.news_current >= (self.news.length - 1)) {
            self.news_current = 0;
          } else {
            ++self.news_current;
          }

          var temp = $(self.news[self.news_current]);
          if (temp) {
            $('#e5e_news_content').html("<span>" + temp.find('title').text() + "</span>");
            $('#e5e_news_content').transition({
              opacity: 1
            });
          }
        }
      });

    },

  });

  return View;

});