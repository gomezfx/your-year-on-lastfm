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

Vue.directive('count-up', function(value) {
  if (value.bindOn) {
    var options = {
      useEasing : true, 
      useGrouping : true, 
      separator : ',', 
      decimal : '.', 
      prefix : '', 
      suffix : '' 
    };

    var count = new CountUp(this.el, value.start, value.end, 0, value.duration, options);
    count.start();
  }
});

Vue.directive('first', function (value) {
  if (value.start === value.index) {
    this.el.classList.add(value.class);
  }
});

Vue.directive('last', function (value) {
  if (value.last === value.index) {
    this.el.classList.add(value.class);
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
        .fromTo(elem, 0.5, { width: 0 }, { width: _value.width + "px", ease: Power1.easeOut });

      console.log("Window: " + $(window).height());
      console.log("Elem: " + $(elem).outerHeight());
      new ScrollMagic.Scene({
        triggerElement: elem,
        triggerHook: value.triggerHook,
        duration: (($(window).height()/2) - ($(elem).outerHeight()/2))
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
    loading: false,
    username: '',
    name: '',
    avatarSource: '',
    albums: [],
    tracks: [],
    artists: [],
    artistsToggled: false,
    links: [],
    zero: 0,
    album1: '',
    album2: '',
    album3: '',
    album4: '',
    album5: '',
    albumsToggled: false,
    songs: [],
    totalScrobbles: 0
  },

  created: function() {
    // Albums

    for (var i = 0; i < 5; i++) {
      this.albums[i] = {
        album: "",
        artist: "",
        image: "",
        playCount: ""
      }
    }

    // Songs

    for (var i = 0; i < 10; i++) {
      this.songs[i] = {
        name: "",
        artist: "",
        playCount: ""      }
    }

    // Artists

    for (var i = 0; i < 5; i++) {
      this.artists[i] = {
        artist: "",
        playCount: "",
        image: ""
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

      self.loading = true;

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
        var songResults = [];

        // Recent tracks
        var trackResults = [];

        for (var i = 0; i < dates.length; i++) (function(i) {
          var current = dates[i];
          if (current.from >= YEAR_START && current.to <= YEAR_END) {
            trackResults.push(client.getRecentTracks(self.username, 1, 200, current.from, current.to));
          }
        })(i);


        Q.all(trackResults).then(function(pages) {
          var allTrackResults = [];

          for (var i = 0; i < pages.length; i++) {
            var itr = pages[i];
            var totalPages = itr.totalPages;
            var from = itr.from;
            var to = itr.to;

            for (var j = 1; j <= totalPages; j++) {
              allTrackResults.push(client.getRecentTracks(self.username, j, 200, from, to));
            }
          }

          Q.all(allTrackResults).then(function(pages) {
            var tracks = new Array();

            for (var i = 0; i < pages.length; i++) {
              var parsedTracks = pages[i].tracks;
              
              for (var j = 0; j < parsedTracks.length; j++) {
                var track = {};
                var parsedTrack = parsedTracks[j];

                track.name = parsedTrack.name;
                track.artist = parsedTrack.artist;
                track.album = parsedTrack.album;

                tracks.push(track);
              }
            }

            var songMap = {};
            var albumMap = {};
            var artistMap = {};

            for (var i = 0; i < tracks.length; i++) {
              var trackItr = tracks[i];
              var songKey = (trackItr.name + trackItr.artist).hashCode();
              var albumKey = (trackItr.album + trackItr.artist).hashCode();
              var artistKey = (trackItr.artist).hashCode();

              if (songMap.hasOwnProperty(songKey)) {
                songMap[songKey].playCount++;
              } else {
                songMap[songKey] = trackItr;
                songMap[songKey].playCount = 1;
              }

              if (albumMap.hasOwnProperty(albumKey)) {
                albumMap[albumKey].playCount++;
              } else {
                albumMap[albumKey] = {};
                albumMap[albumKey].album = trackItr.album;
                albumMap[albumKey].artist = trackItr.artist;
                albumMap[albumKey].playCount = 1;
              }

              if (artistMap.hasOwnProperty(artistKey)) {
                artistMap[artistKey].playCount++;
              } else {
                artistMap[artistKey] = {};
                artistMap[artistKey].artist = trackItr.artist;
                artistMap[artistKey].playCount = 1;
              }
            }

            self.totalScrobbles = tracks.length;

            // Songs

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

            // Albums

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
              self.albums[i].album = albumArray[i].album;
              self.albums[i].artist = albumArray[i].artist;
              self.albums[i].playCount = albumArray[i].playcount;

              results.push(client.getAlbumInfo(albumArray[i].artist, albumArray[i].album));
            }

            Q.all(results).then(function (data) {
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
            });

            // Artists

            var artistArray = new Array();

            for (var key in artistMap) {
              var obj = artistMap[key];
              artistArray.push(obj);
            }

            artistArray.sort(function (a, b) {
              return b.playCount - a.playCount;
            });
            
            var results = [];

            for(var i = 0; i < 5; i++) {
              self.artists[i].artist = artistArray[i].artist;
              self.artists[i].playCount = artistArray[i].playCount;

              results.push(client.getArtistInfo(artistArray[i].artist));
            }

            Q.all(results).then(function (data) {
              for (var i = 0; i < data.length; i++) {
                var image = data[i].images[4];
                self.artists[i].image = image;
              }

              self.initialized = true;
              self.loading = false;
            });

          });
        });
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