function WeatherController(WeatherFactory) {
  var vm = this;

  var url = 'js/weather.json';

  WeatherFactory
    .httpGetWeatherByState(url)
      .then(function (object){
        vm.weather = object.data.query;
        console.log(vm.weather)
      });


}

angular
        .module('weatherApp')
        .controller('WeatherController', WeatherController);
