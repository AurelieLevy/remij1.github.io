(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:shopCtrl
	* @description
	* # shopCtrl
	* Controller of the app
	*/

  	angular
		.module('shop')
		.controller('ShopCtrl', shopCtrl);

		shopCtrl.$inject = ['$scope', 'shopService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function shopCtrl($scope, shopService) {
			/*jshint validthis: true */
			var vm = this;
			vm.photos = [];

			vm.error = null;

			vm.resetError = function() {
				vm.error = null;
			}

			vm.getPhotos = function() {
				vm.resetError();

				shopService
					.getBuyablePhotos(`https://aureda.heroku.com/images?filter=buyable`, vm.token)
					.then((data) => {
						if (data.status === 0) {
							vm.error = 'the data cannot be loaded';
						} else if (data.status === 1) {
							vm.photos = data.response.data;
						}

						$scope.$apply();
					});
			}

			// https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
			vm.code = function findGetParameter(parameterName) {
				var result = null,
					tmp = [];
				location.search
					.substr(1)
					.split("&")
					.forEach(function (item) {
						tmp = item.split("=");
						if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
					});
				return result;
			}

			vm.token = vm.getToken();

			vm.getPhotos();
		}
})();
