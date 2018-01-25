(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:HomeCtrl
	* @description
	* # HomeCtrl
	* Controller of the app
	*/

	angular
		.module('home')
		.controller('HomeCtrl', Home);

	Home.$inject = ['$scope', 'homeService', 'shopService', '$mdDialog', '$window', '$location'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Home($scope, homeService, shopService, $mdDialog, $window, $location) {
		/*jshint validthis: true */
		var vm = this;
		vm.photos = [];
		vm.loginLink = "";
		vm.token = "";

		vm.error = null;
		vm.userData = {}

		vm.resetError = function () {
			vm.error = null;
		}

		vm.getToken = function () {
			vm.resetError();

			shopService.postCode(findGetParameter("code"))
				.then((data) => {
					vm.token = data.response.data;
					vm.getPhotos();
					vm.userData = vm.getUserData();

					$scope.$apply();
				});
		}

		vm.getPhotos = function () {
			vm.resetError();

			shopService.getMyPhotos()
				.then((data) => {
					if (data.status === 0) {
						vm.error = 'Could not get MY photos';
					} else if (data.status === 1) {
						vm.photos = data.response.data;
					}

					$scope.$apply();
				});
		}

		vm.getUserData = function () {
			vm.resetError();
			const user = {};

			shopService.getUserData()
				.then((data) => {
					if (data.status === 0) {
						vm.error = 'Could not get my data';
					} else if (data.status === 1) {
						vm.user = data.response.data;
					}

					$scope.$apply();
				});

			return user;
		}

		function makerandom() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 30; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		}

		function setLoginLink() {
			let randString = makerandom();
			vm.loginLink = "https://www.wunderlist.com/oauth/authorize?client_id=706ea3bc47cae388cb26&redirect_uri=" + window.location.href + "&state=" + randString;

			//document.getElementById("loginLink")
			//	.setAttribute("href", "https://www.wunderlist.com/oauth/authorize?client_id=706ea3bc47cae388cb26&redirect_uri=" + window.location.href + "&state=" + randString);
		}

		// https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
		function findGetParameter(parameterName) {
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

		function connect() {
			if (!shopService.isConnected()) {
				// Checking if we have the code
				let code = findGetParameter('code');

				if (code == null) {
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.querySelector('#popupContainer')))
							.clickOutsideToClose(false)
							.title('Connect to Wunderlist')
							.textContent('This app needs you to be connected with Wunderlist to work properly. You will be now redirected to the login page.')
							.ariaLabel('Alert Dialog Demo')
							.ok('Login')
					).then(() => {
						$window.location.href = vm.loginLink;
					});
				}else{
					// We here have the code
					vm.getToken();

					// Clearing the code from the URL
					$location.url($location.path());
				}
			}
		}

		$scope.$on('refreshUser', (event) => {
			vm.getPhotos();
			vm.getUserData();
		});

		setLoginLink();

		connect();

		vm.getToken();


	}

})();
