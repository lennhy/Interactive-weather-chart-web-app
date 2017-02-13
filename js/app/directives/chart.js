function chart() {
	return {
    templateUrl: 'js/app/views/chart.html',
		controller: 'WeatherController as vm'
		// restrict: 'A',
		// require: 'ngModel',
		// link: function (scope, element, attrs, ngModel) {
		// 	ngModel.$validators.multipleInput = function (values) {
    //     var trueVal= true
    //     for(var i =0; i < values.length; i++){
		// 			console.log(values[i]);
    //          if (values[i] === trueVal){
    //            return true
    //          }
    //          else{
    //            return false
    //          }
    //       }
  	// 		};
    //
  	// 	}
    };
  }

angular
	.module('weatherApp')
	.directive('chart', chart);
