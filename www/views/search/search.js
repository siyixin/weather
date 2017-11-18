angular.module('App')
.controller('SearchController', function ($scope, $http) {
  $scope.model = {term: ''};

  $scope.search = function () {
      //$http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {address: $scope.model.term}}).success(function (response) {
      $http.get('http://restapi.amap.com/v3/geocode/geo', { params: { address: $scope.model.term, output: 'json', key: '40fc0b1b09a128854e51ddaf5dfd6a60' } }).success(function (response) {
      $scope.results = response.geocodes;
    });
  };
});
