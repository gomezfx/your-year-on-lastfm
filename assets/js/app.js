var scrollMagicController = new ScrollMagic.Controller({
  addIndicators: true
});

Vue.filter('padZeroes', function(x) {
  if (x !== null && x !== undefined ) {
    var s = x + "";
    while (s.length < 2) {
      s = "0" + s;
    }
    return s;
  }
});

Vue.filter('addCommas', function (x) {
  if (x !== null && x !== undefined ) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
});

Vue.filter('isEven', function (x) {
  if (x % 2 == 0) {
    return true;
  } else {
    return false;
  }
});

Vue.directive('replace-svg', function(value) {
  var $img = $(this.el);

  var imgClass = $img.attr('class');
  var imgURL = $img.attr('src');

  jQuery.get(imgURL, function(data) {
    // Get the SVG tag, ignore the rest
    var $svg = jQuery(data).find('svg');

    // Add replaced image's classes to the new SVG
    if(typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass+' replaced-svg');
    }

    // Remove any invalid XML tags as per http://validator.w3.org
    $svg = $svg.removeAttr('xmlns:a');

    // Replace image with new SVG
    $img.replaceWith($svg);

  }, 'xml');
});

Vue.directive('scroll-to', function(value) {
  var elem = this.el;
  var to = value.to;
  $(elem).click(function() {
    $('body,html').animate({
      scrollTop: $(to).offset().top
    }, 800);
  });
});

Vue.directive('back-to-top', function(value) {
  var elem = this.el;

  $(elem).click(function() {
    $('body,html').animate({
      scrollTop: 0
    }, 800);
  });
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
        .fromTo(elem, 0.5, { opacity: 0.3 }, { opacity: 1, ease: Power1.easeOut });
        //.to(elem, 0.5, { opacity: 0.3, ease: Power1.easeIn });

      new ScrollMagic.Scene({
        triggerElement: elem,
        triggerHook: value.triggerHook,
        duration: $(window).height()/2,
        offset: $(elem).height()/2
      })
      .setTween(timeline)
      .addTo(scrollMagicController);
    });
  }
});

Vue.directive('fade-in-menu', function(value) {
  var elem = this.el;

  if (value.bindOn) {
    Vue.nextTick(function() {

      new ScrollMagic.Scene({
        triggerElement: $('.menu-trigger')[0],
        triggerHook: 0,
      })
      .setClassToggle(elem, "fade-in")
      .addTo(scrollMagicController);
    });
  }
});

Vue.directive('fade-in-menu-elem', function(value) {
  var elem = this.el;

  if (value.bindOn) {
    Vue.nextTick(function() {

      new ScrollMagic.Scene({
        triggerElement: $('.menu-trigger')[0],
        triggerHook: 0,
      })
      .setClassToggle(elem, "fade-in")
      .addTo(scrollMagicController);
    });
  }
});

Vue.directive('fade-in', function(value) {
  var elem = this.el;

  if (value.bindOn) {
    Vue.nextTick(function() {
      var timeline = new TimelineMax();

      timeline
        .fromTo(elem, 0.5, { opacity: value.start }, { opacity: value.end, ease: Power1.easeOut })

      new ScrollMagic.Scene({
        triggerElement: elem,
        triggerHook: value.triggerHook,
        duration: ($(window).height() * (.5)),
      })
      .setTween(timeline)
      .addTo(scrollMagicController);
    });
  }
});

Vue.directive('change-color', function(value) {
  var elem = this.el;

  if (value.bindOn) {
    Vue.nextTick(function() {
      var timeline = new TimelineMax();

      timeline
        .fromTo(elem, 0.5, { backgroundColor: value.start }, { backgroundColor: value.end, ease: Power1.easeOut })

      new ScrollMagic.Scene({
        triggerElement: elem,
        triggerHook: value.triggerHook,
        duration: ($(window).height() * (.5)),
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

      timeline
        .fromTo(elem, 0.5, { width: 0 }, { width: _value.width + "px", ease: Power1.easeOut });

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
    infoToggled: false,
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
    totalScrobbles: 0,
    artistsToggled: false,
    menuToggled: false,
    springListens: {},
    summerListens: {},
    fallListens: {},
    winterListens: {}
  },

  created: function() {
    // Albums

    for (var i = 0; i < 5; i++) {
      this.albums[i] = {
        album: "",
        artist: "",
        image: "",
        playCount: "",
        albumUrl: "",
        artistUrl: ""
      }
    }

    // Songs

    for (var i = 0; i < 10; i++) {
      this.songs[i] = {
        name: "",
        artist: "",
        playCount: "",
        songUrl: "",
        artistUrl: ""
      }
    }

    // Artists

    for (var i = 0; i < 5; i++) {
      this.artists[i] = {
        artist: "",
        playCount: "",
        image: "",
        artistUrl: ""
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
                track.songUrl = parsedTrack.songUrl;
                track.date = parsedTrack.date;

                tracks.push(track);
              }
            }

            var songMap = {};
            var albumMap = {};
            var artistMap = {};

            var yearStart = 1388534400;
            var springStart = 1395273600;
            var summerStart = 1403308800;
            var fallStart = 1411430400;
            var winterStart = 1419120000;

            var springMap = {};
            springMap.songMap = {};
            springMap.albumMap = {};
            springMap.artistMap = {};
            springMap.from = springStart;
            springMap.to = summerStart;

            var summerMap = {};
            summerMap.songMap = {};
            summerMap.albumMap = {};
            summerMap.artistMap = {};
            summerMap.from = summerStart;
            summerMap.to = fallStart;

            var fallMap = {};
            fallMap.songMap = {};
            fallMap.albumMap = {};
            fallMap.artistMap = {};
            fallMap.from = fallStart;
            fallMap.to = winterStart;

            var winterMap = {};
            winterMap.songMap = {};
            winterMap.albumMap = {};
            winterMap.artistMap = {};
            winterMap.from = yearStart;
            winterMap.to = springStart;

            var seasonMapArray = new Array();
            seasonMapArray.push(springMap);
            seasonMapArray.push(summerMap);
            seasonMapArray.push(fallMap);
            seasonMapArray.push(winterMap);

            for (var i = 0; i < tracks.length; i++) {
              var trackItr = tracks[i];
              var date = trackItr.date;
              var songKey = (trackItr.name + trackItr.artist).hashCode();
              var albumKey = (trackItr.album + trackItr.artist).hashCode();
              var artistKey = (trackItr.artist).hashCode();

              if (songMap.hasOwnProperty(songKey)) {
                songMap[songKey].playCount++;
              } else {
                songMap[songKey] = {};
                songMap[songKey].name = trackItr.name;
                songMap[songKey].artist = trackItr.artist;
                songMap[songKey].album = trackItr.album;
                songMap[songKey].songUrl = trackItr.songUrl;
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

              for (var j = 0; j < seasonMapArray.length; j++) {
                var seasonMap = seasonMapArray[j];

                if ((date >= seasonMap.from) && (date < seasonMap.to)) {
                  addToSongMap(trackItr, seasonMap.songMap, songKey);
                  addToAlbumMap(trackItr, seasonMap.albumMap, albumKey);
                  addToArtistMap(trackItr, seasonMap.artistMap, artistKey)
                }
              }
            }

            self.totalScrobbles = tracks.length;

            // Songs

            var songArray = new Array();
            sortArrayByPlayCount(songMap, songArray);

            var songResults = [];

            for (var i = 0; i < 10; i++) {
              self.songs[i].name = songArray[i].name;
              self.songs[i].artist = songArray[i].artist;
              self.songs[i].playCount = songArray[i].playCount;
              self.songs[i].songUrl = songArray[i].songUrl;

              songResults.push(client.getArtistInfo(songArray[i].artist));
            }

            Q.all(songResults).then(function (data) {
              for (var i = 0; i < 10; i++) {
                self.songs[i].artistUrl = data[i].artistUrl;
              }
            });

            // Albums

            var albumArray = new Array();
            sortArrayByPlayCount(albumMap, albumArray);

            var albumImageResults = [];
            var albumArtistResults = [];

            for(var i = 0; i < 5; i++) {
              self.albums[i].album = albumArray[i].album;
              self.albums[i].artist = albumArray[i].artist;
              self.albums[i].playCount = albumArray[i].playCount;

              albumImageResults.push(client.getAlbumInfo(albumArray[i].artist, albumArray[i].album));
              albumArtistResults.push(client.getArtistInfo(albumArray[i].artist));
            }

            Q.all(albumImageResults).then(function (data) {
              for (var i = 0; i < data.length; i++) {
                // 4 is mega size
                var image = data[i].images[4];
                self.albums[i].image = image;
                self.albums[i].albumUrl = data[i].albumUrl;
              }

              self.album1 = self.albums[0];
              self.album2 = self.albums[1];
              self.album3 = self.albums[2];
              self.album4 = self.albums[3];
              self.album5 = self.albums[4];
            });

            Q.all(albumArtistResults).then(function (data) {
              for (var i = 0; i < data.length; i++) {
                self.albums[i].artistUrl = data[i].artistUrl;
              }
            });

            // Artists

            var artistArray = new Array();
            sortArrayByPlayCount(artistMap, artistArray);
            
            var artistResults = [];

            for(var i = 0; i < 5; i++) {
              self.artists[i].artist = artistArray[i].artist;
              self.artists[i].playCount = artistArray[i].playCount;

              artistResults.push(client.getArtistInfo(artistArray[i].artist));
            }

            Q.all(artistResults).then(function (data) {
              for (var i = 0; i < data.length; i++) {
                var image = data[i].images[4];
                self.artists[i].image = image;
                self.artists[i].artistUrl = data[i].artistUrl;
              }

              self.initialized = true;
              self.loading = false;
            });

            // Spring
            var springSongArray = new Array();
            var springAlbumArray = new Array();
            var springArtistArray = new Array();

            sortArrayByPlayCount(springMap.songMap, springSongArray);
            sortArrayByPlayCount(springMap.albumMap, springAlbumArray);
            sortArrayByPlayCount(springMap.artistMap, springArtistArray);

            var springListens = {};
            springListens.song = springSongArray[0];
            springListens.album = springAlbumArray[0];
            springListens.artist = springArtistArray[0];
            self.springListens = springListens;

            // Summer

            var summerSongArray = new Array();
            var summerAlbumArray = new Array();
            var summerArtistArray = new Array();

            sortArrayByPlayCount(summerMap.songMap, summerSongArray);
            sortArrayByPlayCount(summerMap.albumMap, summerAlbumArray);
            sortArrayByPlayCount(summerMap.artistMap, summerArtistArray);

            var summerListens = {};
            summerListens.song = summerSongArray[0];
            summerListens.album = summerAlbumArray[0];
            summerListens.artist = summerArtistArray[0];
            self.summerListens = summerListens;

            // Fall
            var fallSongArray = new Array();
            var fallAlbumArray = new Array();
            var fallArtistArray = new Array();

            sortArrayByPlayCount(fallMap.songMap, fallSongArray);
            sortArrayByPlayCount(fallMap.albumMap, fallAlbumArray);
            sortArrayByPlayCount(fallMap.artistMap, fallArtistArray);

            var fallListens = {};
            fallListens.song = fallSongArray[0];
            fallListens.album = fallAlbumArray[0];
            fallListens.artist = fallArtistArray[0];
            self.fallListens = fallListens;

            // Winter
            var winterSongArray = new Array();
            var winterAlbumArray = new Array();
            var winterArtistArray = new Array();

            sortArrayByPlayCount(winterMap.songMap, winterSongArray);
            sortArrayByPlayCount(winterMap.albumMap, winterAlbumArray);
            sortArrayByPlayCount(winterMap.artistMap, winterArtistArray);

            var winterListens = {};
            winterListens.song = winterSongArray[0];
            winterListens.album = winterAlbumArray[0];
            winterListens.artist = winterArtistArray[0];
            self.winterListens = winterListens;

          });
        });
      });
    },

    toggleInfo: function() {
      var self = this;

      if (!self.infoToggled) {
        self.infoToggled = true;
        setTimeout(function() {
          self.infoToggled = false;
        }, 7000);
      }
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

function addToSongMap(track, map, key) {
  var copy = {};
  copy.name = track.name;
  copy.artist = track.artist;
  copy.album = track.album;
  copy.songUrl = track.songUrl;

  if (map.hasOwnProperty(key)) {
    map[key].playCount++;
  } else {
    copy.playCount = 1;
    map[key] = copy;
  }
};

function addToAlbumMap(track, map, key) {
  var copy = {};
  copy.album = track.album;
  copy.artist = track.artist;

  if (map.hasOwnProperty(key)) {
    map[key].playCount++;
  } else {
    copy.playCount = 1;
    map[key] = copy;
  }
};

function addToArtistMap(track, map, key) {
  var copy = {};
  copy.artist = track.artist;

  if (map.hasOwnProperty(key)) {
    map[key].playCount++;
  } else {
    copy.playCount = 1;
    map[key] = copy;
  }
};

function copyObject(obj) {
    var newObj = {};
    for (var key in obj) {
        //copy all the fields
        newObj[key] = obj[key];
    }

    return newObj;
};

function sortArrayByPlayCount(map, array) {
  for (var key in map) {
    var obj = map[key];
    array.push(obj);
  }

  array.sort(function (a, b) {
    return b.playCount - a.playCount;
  });
};