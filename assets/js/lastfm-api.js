function log(message) {
  console.log(message);
};

function User(name, realName, avatarSource) {
  this.name = name;
  this.realName = realName;
  this.avatarSource = avatarSource;
};

function Chart(to, from) {
  this.to = to;
  this.from = from;
};

function Track(name, artist, playCount) {
  this.name = name;
  this.artist = artist;
  this.playCount = playCount;
};

function Album(name, artist, playCount, mbId) {
  this.name = name;
  this.artist = artist;
  this.playCount = playCount;
  this.mbId = mbId;
};

function AlbumInfo(artist, id, images, name, albumUrl) {
  this.artist = artist;
  this.id = id;
  this.images = images;
  this.name = name;
  this.albumUrl = albumUrl;
}

function ArtistInfo(name, images, artistUrl) {
  this.name = name;
  this.images = images;
  this.artistUrl = artistUrl;
}

var LastFmApiClient = function() {
  this.API_KEY = Config.API_KEY;
  this.SECRET = Config.SECRET;
  this.BASE_URL = "http://ws.audioscrobbler.com";
  this.FORMAT = "json";
};

LastFmApiClient.prototype.getInfo = function(user) {
  var deferred = Q.defer();
  var endpoint = this.BASE_URL;
  endpoint += "/2.0/?method=user.getinfo";
  endpoint += "&format=" + this.FORMAT;
  endpoint += "&api_key=" + this.API_KEY;
  endpoint += "&user=" + user;

  $.get(endpoint, function(data) {
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    var name = parsed.user.name;
    var realName = parsed.user.realname;
    var avatarSource = parsed.user.image[2]['#text'];
    var user = new User(name, realName, avatarSource);

    deferred.resolve(user);
  });

  return deferred.promise;
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
    var charts = [];
    var length = parsed.weeklychartlist.chart.length;

    for (var i = 0 ; i < length; i++) {
      var to = parseInt(parsed.weeklychartlist.chart[i].to);
      var from = parseInt(parsed.weeklychartlist.chart[i].from);
      var chart = new Chart(to, from);
      charts.push(chart);
    }

    deferred.resolve(charts);
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
      var itr = parsed.weeklytrackchart.track[i];
      var name = itr.name;
      var artist = itr.artist['#text'];
      var playCount = parseInt(itr.playcount);
      var track = new Track(name, artist, playCount);
      tracks.push(track);
    }

    deferred.resolve(tracks);
  });

  return deferred.promise;
};

LastFmApiClient.prototype.getWeeklyAlbumChart = function(user, from, to) {
  var deferred = Q.defer();
  var endpoint = this.BASE_URL;
  endpoint += "/2.0/?method=user.getweeklyalbumchart";
  endpoint += "&format=" + this.FORMAT;
  endpoint += "&api_key=" + this.API_KEY;
  endpoint += "&user=" + user;
  endpoint += "&to=" + to;
  endpoint += "&from=" + from;

  $.get(endpoint, function(data) {
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    var albums = [];
    var length;
    if (!parsed.hasOwnProperty('weeklyalbumchart')) {
      length = 0;
    }
    else if (parsed.weeklyalbumchart.album === undefined) {
      length = 0;
    } else {
      length = parsed.weeklyalbumchart.album.length;
    }

    for (var i = 0; i < length; i++) {
      var itr = parsed.weeklyalbumchart.album[i];
      var name = itr.name;
      var artist = itr.artist['#text']
      var playCount = parseInt(itr.playcount);
      var mbid = itr.mbid;
      var album = new Album(name, artist, playCount, mbid);
      albums.push(album);
    }

    deferred.resolve(albums);
  });

  return deferred.promise;
};

LastFmApiClient.prototype.getRecentTracks = function(user, page, limit, from, to) {
  var deferred = Q.defer();
  var endpoint = this.BASE_URL;
  endpoint += "/2.0/?method=user.getrecenttracks";
  endpoint += "&format=" + this.FORMAT;
  endpoint += "&api_key=" + this.API_KEY;
  endpoint += "&user=" + user;
  endpoint += "&page=" + page;
  endpoint += "&limit=" + limit;
  endpoint += "&to=" + to;
  endpoint += "&from=" + from;

  $.get(endpoint, function(data) {
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    var tracks = [];
    var length;

    if (!parsed.hasOwnProperty('recenttracks')) {
      length = 0;
    } else if (parsed.recenttracks.track === undefined) {
      length = 0;
    } else {
      length = parsed.recenttracks.track.length;
    }

    var page = {};
    page.totalPages = parsed.recenttracks["@attr"].totalPages;
    page.page = parsed.recenttracks["@attr"].page;
    page.tracks = [];
    page.from = from;
    page.to = to;

    for (var i = 0; i < length; i++) {
      var itr = parsed.recenttracks.track[i];
      page.tracks[i] = {};
      page.tracks[i].artist = itr.artist["#text"];
      page.tracks[i].name = itr.name;
      page.tracks[i].album = itr.album["#text"];
      page.tracks[i].songUrl = itr.url;
      page.tracks[i].date = itr.date.uts;
    }

    deferred.resolve(page);
  });

  return deferred.promise;
};

LastFmApiClient.prototype.getAlbumInfo = function(artist, album) {
  var deferred = Q.defer();
  var endpoint = this.BASE_URL;
  endpoint += "/2.0/?method=album.getinfo";
  endpoint += "&format=" + this.FORMAT;
  endpoint += "&api_key=" + this.API_KEY;
  endpoint += "&artist=" + artist;
  endpoint += "&album=" + album;


  $.get(endpoint, function(data) {
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json).album;
    var artist = parsed.artist;
    var id = parsed.id;
    var images = new Array();

    for (var i = 0; i < parsed.image.length; i++) {
      images.push(parsed.image[i]['#text']);
    }
    var name = parsed.name;
    var albumUrl = parsed.url;
    var albumInfo = new AlbumInfo(artist, id, images, name, albumUrl);

    deferred.resolve(albumInfo);
  });
  
  return deferred.promise; 
};

LastFmApiClient.prototype.getArtistInfo = function(artist) {
  var deferred = Q.defer();
  var endpoint = this.BASE_URL;
  endpoint += "/2.0/?method=artist.getinfo";
  endpoint += "&format=" + this.FORMAT;
  endpoint += "&api_key=" + this.API_KEY;
  endpoint += "&artist=" + artist;

  $.get(endpoint, function(data) {
    var json = JSON.stringify(data);
    var parsed = JSON.parse(json);
    var artist = parsed.artist;

    var images = new Array();
    for (var i = 0; i < artist.image.length; i++) {
      images.push(artist.image[i]['#text']);
    }

    var name = parsed.name;
    var artistUrl = artist.url;
    var artistInfo = new ArtistInfo(artist, images, artistUrl);

    deferred.resolve(artistInfo);
  });
  
  return deferred.promise; 
};
/*
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
*/