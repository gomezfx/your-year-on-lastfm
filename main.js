function log(message) {
  console.log(message);
};

var LastFmApiClient = function() {
  this.API_KEY = Config.API_KEY;
  this.SECRET = Config.SECRET;
  this.BASE_URL = "http://ws.audioscrobbler.com";
  this.FORMAT = "json";
};

LastFmApiClient.prototype.getWeeklyChartList = function(user) {
  var deferred = Q.defer();
  var endpoint = this.BASE_URL;
  endpoint += "/2.0/?method=user.getweeklychartlist";
  endpoint += "&format=" + this.FORMAT;
  endpoint += "&api_key=" + this.API_KEY;
  endpoint += "&user=" + user;

  $.get(endpoint, function(data) {
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    var dates = [];
    var length = parsed.weeklychartlist.chart.length;

    for (var i = 0 ; i < length; i++) {
      dates.push(parsed.weeklychartlist.chart[i]);
    }

    deferred.resolve(dates);
  });

  return deferred.promise;
};

LastFmApiClient.prototype.getWeeklyTrackChart = function(user, from, to) {
  var deferred = Q.defer();
  var endpoint = this.BASE_URL;
  endpoint += "/2.0/?method=user.getweeklytrackchart";
  endpoint += "&format=" + this.FORMAT;
  endpoint += "&api_key=" + this.API_KEY;
  endpoint += "&user=" + user;
  endpoint += "&to=" + to;
  endpoint += "&from=" + from;

  $.get(endpoint, function(data) {
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    var tracks = [];
    var length;
    if (parsed.weeklytrackchart.track === undefined) {
      length = 0;
    } else {
      length = parsed.weeklytrackchart.track.length;
    }

    for (var i = 0; i < length; i++) {
      tracks.push(parsed.weeklytrackchart.track[i]);
    }

    deferred.resolve(tracks);
  });

  return deferred.promise;
};

var YEAR_START = 1388534400;
var YEAR_END = 1420070400;

var client = new LastFmApiClient();
client.getWeeklyChartList("gomezfx").then(function (dates) {
  var results = [];
  for (var i = 0; i < dates.length; i++) (function(i) {
    var current = dates[i];
    if (current.from >= YEAR_START && current.to <= YEAR_END) {
      results.push(client.getWeeklyTrackChart("gomezfx", current.from, current.to));
    }
  })(i);
  return Q.all(results);
}).done(function (tracks) {
  var totalTracks = [];
  for (var i = 0; i < tracks.length; i++) {
    totalTracks.push.apply(totalTracks, tracks[i]);
  }
  
  var trackDictionary = {};

  for (var i = 0; i < totalTracks.length; i++) {
    var currentTrack = totalTracks[i];

    if (trackDictionary[currentTrack.name] !== undefined) {
      trackDictionary[currentTrack.name] += parseInt(currentTrack.playcount);
    } else {
      trackDictionary[currentTrack.name] = parseInt(currentTrack.playcount);
    }
  }

  var tracks = [];
  for (var key in trackDictionary) {
    var track = {};
    track.name = key;
    track.playCount = trackDictionary[key];
    tracks.push(track);
  }

  tracks.sort(function (a, b) {
    return b.playCount - a.playCount;
  });

  for (var i = 0; i < 10; i++) {
    log(JSON.stringify(tracks[i]), undefined, 2);
  }
});
