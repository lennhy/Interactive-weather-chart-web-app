function WeatherFactory($http){

  this.httpGetWeatherByState = function(url){
    console.log("Jeeezee");
    return $http.get(url);
  }

}

angular
    .module('weatherApp')
    .service('WeatherFactory', WeatherFactory);
