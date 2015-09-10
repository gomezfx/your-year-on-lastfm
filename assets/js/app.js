var scrollMagicController = new ScrollMagic.Controller({
  addIndicators: true
});

Vue.filter('addCommas', function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.filter('isEven', function (x) {
  if (x % 2 == 0) {
    return true;
  } else {
    return false;
  }
});

Vue.directive('slide-in-right', function (value) {
  this.el.classList.add("slide-in-right");

  if (value) {
    new ScrollMagic.Scene({
      triggerElement: this.el,
      reverse: false
    })
    .setClassToggle(this.el, "active")
    .addTo(scrollMagicController);
  }
});

Vue.directive('slide-in-left', function (value) {
  this.el.classList.add("slide-in-left");

  if (value) {
    new ScrollMagic.Scene({
      triggerElement: this.el,
      reverse: false,
    })
    .setClassToggle(this.el, "active")
    .addTo(scrollMagicController);
  }
});

Vue.directive('slide-in-top', function (value) {
  //this.el.classList.add("slide-in-top");
  var elem = this.el;

  if (value.bindOn) {
    Vue.nextTick(function () {

      new ScrollMagic.Scene({
        triggerElement: elem,
        triggerHook: value.triggerHook,
        duration: $(window).height()
      })
      .setTween(TweenMax.fromTo(elem, 0.5, { scale: 0.9 }, { scale: 1, ease: Power1.easeOut }))
      .addTo(scrollMagicController);

      var timeline = new TimelineMax();

      timeline
        .fromTo(elem, 0.5, { opacity: 0.3 }, { opacity: 1, ease: Power1.easeOut })
        .to(elem, 0.5, { opacity: 0.3, ease: Power1.easeIn });

      new ScrollMagic.Scene({
        triggerElement: elem,
        triggerHook: value.triggerHook,
        duration: $(window).height(),
        offset: $(elem).outerHeight()/2
      })
      .setTween(timeline)
      .addTo(scrollMagicController);
    });
  }
});

Vue.directive('expand-width', function(value) {
  var elem = this.el;
  var _value = value;
  if(value.bindOn) {
    Vue.nextTick(function () {
      var timeline = new TimelineMax();
      console.log(_value);
      timeline
        .fromTo(elem, 0.5, { width: 0 }, { width: _value.width + "px", ease: Power1.easeOut })
        .to(elem, 0.5, { width: 0, ease: Power1.easeIn });

      new ScrollMagic.Scene({
        triggerElement: elem,
        triggerHook: value.triggerHook,
        duration: $(window).height()
      })
      .setTween(timeline)
      .addTo(scrollMagicController);
    });
  }
});

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
        image: "",
        playCount: ""
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

        // Recent tracks

        // End recent tracks


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
          //console.log(chart);
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
          self.albums[i].playCount = albumArray[i].playcount;
          //console.log(albumArray[i].playCount);
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