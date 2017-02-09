function WeatherFactory($http){
  // var file = '../../weather.json';

  this.httpGetWeatherByState = function(url){
    console.log("Jeeezee");
    return $http.get(url);
  }
}
  angular
      .module('weatherApp')
      .service('WeatherFactory', WeatherFactory);
