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

    return dates;
  });
};

var YEAR_START = 1388534400;
var YEAR_END = 1420070400;

var client = new LastFmApiClient();
var dates = client.getWeeklyChartList("gomezfx");