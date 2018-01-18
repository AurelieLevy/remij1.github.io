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
					.executeGetRequest(`/app/assets/images/data.json`)
					.then((data) => {
						if (data.status === 0) {
							vm.error = 'the data cannot be loaded';
						} else if (data.status === 1) {
							vm.photos = data.response.data;
						}

						$scope.$apply();
					});
			}

			vm.getPhotos();
		}
})();
