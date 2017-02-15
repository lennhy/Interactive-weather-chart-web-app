function chart() {
	return {
    templateUrl: 'js/app/views/chart.html',
		controller: 'WeatherController as vm'
    };
  }

angular
	.module('weatherApp')
	.directive('chart', chart);
