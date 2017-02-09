function WeatherState(){
  return {
      controller: 'WeatherController as vm',
      restrict: 'E'

  };

}


angular
   .module('weatherApp')
   .directive('weatherState', WeatherState);
