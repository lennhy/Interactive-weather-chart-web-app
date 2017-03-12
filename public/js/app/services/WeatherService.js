function WeatherService($http){

  this.httpGetWeatherByState = function(url){
    return $http.get(url)

    .then(successCallback)
    .catch(errorCallback)

    function successCallback(data){
      return data
    }

    function errorCallback(error){
      console.log(error)
    }
  }
}

angular
    .module('weatherApp')
    .service('WeatherService', WeatherService);
