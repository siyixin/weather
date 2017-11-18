angular.module('App')
.controller('WeatherController', function ($scope, $http, $stateParams, $ionicActionSheet, $ionicModal, Locations, Settings) {
  $scope.params = $stateParams;
  $scope.settings = Settings;

  // $http.get('/api/forecast/' + $stateParams.lat + ',' + $stateParams.lng, {params: {units: Settings.units}}).success(function (forecast) {
  //   $scope.forecast = forecast;
  // });

  //http://restapi.amap.com/v3/weather/weatherInfo?city=130500&key=40fc0b1b09a128854e51ddaf5dfd6a60&extensions=all
  $http.get('http://restapi.amap.com/v3/weather/weatherInfo',{params:{city:$stateParams.adcode,key:'40fc0b1b09a128854e51ddaf5dfd6a60',extensions:'all'}}).success(function (data) {
    $scope.forecast = data.forecasts;
  });

  $http.get('http://restapi.amap.com/v3/weather/weatherInfo',{params:{city:$stateParams.adcode,key:'40fc0b1b09a128854e51ddaf5dfd6a60'}}).success(function (data) {
    $scope.current = data.lives;
  });

  var barHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight;
  $scope.getWidth = function () {
    return window.innerWidth + 'px';
  };
  $scope.getTotalHeight = function () {
    return parseInt(parseInt($scope.getHeight()) * 3) + 'px';
  };
  $scope.getHeight = function () {
    return parseInt(window.innerHeight - barHeight) + 'px';
  };

  $scope.showOptions = function () {
    var sheet = $ionicActionSheet.show({
      buttons: [
        {text: Locations.getIndex($stateParams) === -1?'收藏':'取消收藏'},
        {text: '我的最爱'},
        {text: '日出日落'}
      ],
      cancelText: '取消',
      buttonClicked: function (index) {
        if (index === 0) {
          Locations.toggle($stateParams);
        }
        if (index === 1) {
          Locations.primary($stateParams);
        }
        if (index === 2) {
          $scope.showModal();
        }
        return true;
      }
    });
  };

  $scope.showModal = function () {
    if ($scope.modal) {
      $scope.modal.show();
    } else {
      $ionicModal.fromTemplateUrl('views/weather/modal-chart.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        var days = [];
        var day = Date.now();
        for (var i = 0; i < 365; i++) {
          day += 1000 * 60 * 60 * 24;
          days.push(SunCalc.getTimes(day, $scope.params.lat, $scope.params.lng));
        }
        $scope.chart = days;
        $scope.modal.show();
      });
    }
  };
  $scope.hideModal = function () {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});
