function local() {
	return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$validators.local = function (value) {
        return /\d{5}/.test(value);
      };
    }
  };
}

angular
	.module('weatherApp')
	.directive('local', local);
