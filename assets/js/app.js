Vue.filter('addCommas', function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})

var main = new Vue({
  el: '#main',

  data: {
    initialized: false,
    username: '',
    name: '',
    avatarSource: '',
    albums: [],
    tracks: [],
    artists: [],
    links: [],
    zero: 0,
    album1: '',
    album2: '',
    album3: '',
    album4: '',
    album5: '',
    albumsToggled: false,
    songs: []
  },

  created: function() {
    for (var i = 0; i < 5; i++) {
      this.albums[i] = {
        name: "",
        artist: "",
        image: ""
      }
    }

    for (var i = 0; i < 10; i++) {
      this.songs[i] = {
        name: "",
        artist: "",
        playCount: "",
      }
    }
    var self = this;
    //this.initialize();
  },

  methods: {
    initialize: function() {
      var YEAR_START = 1388534400;
      var YEAR_END = 1420070400;
      var client = new LastFmApiClient();
      var self = this;

      client.getInfo(self.username).then(function(user) {
        self.username = user.name;
        self.name = user.realName;
        var img = new Image();
        img.onload = function() {
         self.avatarSource = user.avatarSource;
        };
        img.src = user.avatarSource;

        return client.getWeeklyChartList('gomezfx');
      }).then(function (dates) {
        var results = [];
        var songResults = []


        // Songs

        for (var i = 0; i < dates.length; i++) (function(i) {
          var current = dates[i];
          if (current.from >= YEAR_START && current.to <= YEAR_END) {
            songResults.push(client.getWeeklyTrackChart(self.username, current.from, current.to));
          }
        })(i);

        Q.all(songResults).then(function(songs) {
          var songMap = {};
          for (var i = 0; i < songs.length; i++) {
            var chart = songs[i];
            for (var j = 0; j < chart.length; j++) {
              var songItr = chart[j];
              var key = (songItr.name + songItr.artist).hashCode();
              if (songMap.hasOwnProperty(key)) {
                songMap[key].playCount += songItr.playCount;
              } else {
                songMap[key] = songItr;
              }
            }
          }

          var songArray = new Array();
          for (var key in songMap) {
            var obj = songMap[key];
            songArray.push(obj);
          }

          songArray.sort(function (a, b) {
            return b.playCount - a.playCount;
          });

          for (var i = 0; i < 10; i++) {
            console.log(songArray[i]);
            self.songs[i].name = songArray[i].name;
            self.songs[i].artist = songArray[i].artist;
            self.songs[i].playCount = songArray[i].playCount;
          }
        });

        // End songs

        for (var i = 0; i < dates.length; i++) (function(i) {
          var current = dates[i];
          if (current.from >= YEAR_START && current.to <= YEAR_END) {
            results.push(client.getWeeklyAlbumChart(self.username, current.from, current.to));
          }
        })(i);
        
        return Q.all(results);
      }).then(function (albums) {
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

        var results = [];
        for(var i = 0; i < 5; i++) {
          self.albums[i].name = albumArray[i].name;
          self.albums[i].artist = albumArray[i].artist;
          results.push(client.getAlbumInfo(albumArray[i].artist, albumArray[i].name));
        }      
        return Q.all(results);
      }).done(function (data) {
        for (var i = 0; i < data.length; i++) {
          // 4 is mega size
          var image = data[i].images[4];
          self.albums[i].image = image;
        }

        self.album1 = self.albums[0];
        self.album2 = self.albums[1];
        self.album3 = self.albums[2];
        self.album4 = self.albums[3];
        self.album5 = self.albums[4];

        self.initialized = true;
      });
    },

    showUserInfo: function() {

    },

    hideUserInfo: function() {

    },

  }
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};