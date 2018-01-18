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

	Home.$inject = ['$scope','homeService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Home($scope, homeService) {
		/*jshint validthis: true */
		var vm = this;
		vm.photos = [];
		vm.loginLink = "";

		vm.error = null;

		vm.resetError = function() {
			vm.error = null;
		}

		vm.getPhotos = function() {
			vm.resetError();

			homeService
				.getMyPhotos(`/app/assets/images/data.json`)
				.then((data) => {
					if (data.status === 0) {
						vm.error = 'the data cannot be loaded';
					} else if (data.status === 1) {
						vm.photos = data.response.data;
					}

					$scope.$apply();
				});

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
		
				setLoginLink();
		}

		vm.getPhotos();
	}

})();
