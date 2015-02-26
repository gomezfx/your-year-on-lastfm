var AlbumComponent = Vue.extend({
  template:
    '<div class="container">' +
      '<div class="album-container">' +
        '<div class="vertical-center">' +
          '<div class="album-info">' +
            '<span class="album-number">{{ $index + 1}}</span><br><br>' +
            '<span class="album-name">{{ album.name }}</span><br><br>' +
            '<span class="subtext">by</span><br><br>' +
            '<span class="album-artist">{{ album.artist }}</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="album-container">' +
        '<div class="vertical-center">' +
          '<div class="album-art"></div>' +
        '</div>' +
      '</div>' +
    '</div>'
});

Vue.component('album-component', AlbumComponent);

var main = new Vue({
  el: '#main',

  data: {
    initialized: false,
    username: '',
    avatarSource: '',
    albums: [],
    tracks: [],
    artists: []
  },

  created: function() {
    this.initialize();
  },

  methods: {
    initialize: function() {
      var YEAR_START = 1388534400;
      var YEAR_END = 1420070400;
      var client = new LastFmApiClient();
      var self = this;
      client.getInfo('gomezfx').then(function(user) {
        self.username = user.name;
        var img = new Image();
        img.onload = function() {
         self.avatarSource = user.avatarSource;
         self.initialized = true;
        };
        img.src = user.avatarSource;

        return client.getWeeklyChartList('gomezfx');
      }).then(function(dates) {
        var results = [];
        for (var i = 0; i < dates.length; i++) (function(i) {
          var current = dates[i];
          if (current.from >= YEAR_START && current.to <= YEAR_END) {
            results.push(client.getWeeklyAlbumChart("gomezfx", current.from, current.to));
          }
        })(i);
        
        return Q.all(results);
      }).done(function (albums) {
        var albumMap = {};
        for (var i = 0; i < albums.length; i++) {
          var chart = albums[i];
          for (var j = 0; j < chart.length; j++) {
            var albumItr = chart[j];
            if(albumMap.hasOwnProperty(albumItr.name)) {
              albumMap[albumItr.name].playCount += albumItr.playCount;
            } else {
              albumMap[albumItr.name] = albumItr;
            }
          }
        }
        var albumArray = new Array();
        for (var key in albumMap) {
         var obj = albumMap[key];
         albumArray.push(obj);
        }
        albumArray.sort(function (a, b) {
          return b.playCount - a.playCount;
        });

        for(var i = 0; i < 5; i++) {
          self.albums.push(albumArray[i]);
        }        
      });
    }
  }
});