(function() {
  angular
        .module('weatherApp', ['ngMessages'])
        .config(function apply($httpProvider, $compileProvider){
          $httpProvider.useApplyAsync(true);
          $compileProvider.debugInfoEnabled(false);
      });
})();
