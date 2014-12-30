var AlbumComponent = Vue.extend({
  template:
    '<div class="container">' +
      '<div class="half-container">' +
        '<div class="vertical-center">' +
          '<span class="album-number">1</span><br><br><br><br><br><br><br><br>' +
          '<span class="album-name">{{ album.name }}</span><br><br>' +
          '<span class="subtext">by</span><br><br>' +
          '<span class="album-artist">{{ album.artist }}</span>' +
        '</div>' +
      '</div>' +
      '<div class="half-container">' +
        '<img class="album vertical-center" src="sample.jpg"></img>' +
      '</div>' +
    '</div>'
});

Vue.component('album-component', AlbumComponent);

var main = new Vue({
  el: '#main',

  data: {
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
        self.avatarSource = user.avatarSource;

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
        console.log(albums.length);
      });
    }
  }
});