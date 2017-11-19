angular.module('App', ['ionic','ngCordova'])

.config(function ($stateProvider, $urlRouterProvider) {  
    $stateProvider
      .state('search', {
        url: '/search',
        controller: 'SearchController',
        templateUrl: 'views/search/search.html'
      })
      .state('settings', {
        url: '/settings',
        controller: 'SettingsController',
        templateUrl: 'views/settings/settings.html'
      })
      .state('weather', {
        url: '/weather/:city/:adcode/:lat/:lng',
        controller: 'WeatherController',
        templateUrl: 'views/weather/weather.html'
      });
  
    $urlRouterProvider.otherwise('/search');
  })

  .controller('LeftMenuController', function ($scope, Locations) {
      $scope.locations = Locations.data;
      $scope.getIcon = function (current) {
          if (current) {
              return 'ion-ios-navigate';
          }
          return 'ion-ios-location';
      };
  })

  .factory('Settings', function () {
    var Settings = {
      units: 'us',
      days: 4
    };
    return Settings;
  })

  .factory('Locations', function ($ionicPopup) {
      function store() {
          localStorage.setItem('location', angular.toJson(Locations.data));
      }
    var Locations = {
        data: [],

      getIndex: function (item) {
        var index = -1;
        angular.forEach(Locations.data, function (location, i) {
          if (item.adcode == location.adcode) {
            index = i;
          }
        });
        return index;
      },
      toggle: function (item) {
        var index = Locations.getIndex(item);
        if (index >= 0) {
          $ionicPopup.confirm({
            title: '你确定吗？',
            template: '你将要删除' + Locations.data[index].city
          }).then(function (res) {
            if (res) {
              Locations.data.splice(index, 1);
            }
          });
        } else {
          Locations.data.push(item);
          $ionicPopup.alert({
            title: '收藏成功'
          });
        }
        store();
      },
      primary: function (item) {
        var index = Locations.getIndex(item);
        if (index >= 0) {
          Locations.data.splice(index, 1);
          Locations.data.splice(0, 0, item);
        } else {
          Locations.data.unshift(item);
        }
        store();
      }
    };
      try {
          var items = angular.fromJson(localStorage.getItem('location')) || [];
          Locations.data = items;
      } catch (e) {
          Locations.data = [];
      }
    return Locations;
  })

  .filter('timezone', function () {
    return function (input, timezone) {
      if (input && timezone) {
        var time = moment.tz(input * 1000, timezone);
        return time.format('LT');
      }
      return '';
    };
  })
  
  .filter('chance', function () {
    return function (chance) {
      if (chance) {
        var value = Math.round(chance * 10);
        return value * 10;
      }
      return 0;
    };
  })

  .filter('week',function(){
    var weeks = {
      '1':'星期一',
      '2':'星期二',
      '3':'星期三',
      '4':'星期四',
      '5':'星期五',
      '6':'星期六',
      '7':'星期日',
    };
    return function(week){
        return weeks[week] || '';
    }
  })
  
  .filter('icons', function () {
    var map = {
      '晴': 'ion-ios-sunny',
      '夜间晴': 'ion-ios-moon',
      '雨': 'ion-ios-rainy',
      '雪': 'ion-ios-snowy',
      '滑': 'ion-ios-rainy',
      '风': 'ion-ios-flag',
      '雾': 'ion-ios-cloud',
      '多云': 'ion-ios-cloudy',
      '少云': 'ion-ios-partlysunny',
      '夜间少云': 'ion-ios-cloudy-night'
    };
    return function (icon) {
      return map[icon] || '';
    }
  })

.run(function($ionicPlatform,$cordovaGeolocation,$http,$state,Locations) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $cordovaGeolocation.getCurrentPosition().then(function (data) {

        $http.get('http://restapi.amap.com/v3/geocode/regeo', { params: { location: data.coords.longitude + ',' + data.coords.latitude, output: 'json', key: '40fc0b1b09a128854e51ddaf5dfd6a60' } }).success(function (response) {
            var location = {
                lat: data.coords.latitude,
                lng: data.coords.longitude,
                adcode: response.regeocode.addressComponent.adcode,
                city: response.regeocode.formatted_address,
                current: true
            };
            Locations.data.unshift(location);
            $state.go('weather',location);
        });
    }, function (err) {console.log(err);},{timeout: 5000});
  });
})
