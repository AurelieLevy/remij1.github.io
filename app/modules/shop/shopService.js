(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:shopService
	 * @description
	 * # shopService
	 * Service of the app
	 */

	angular
		.module('shop')
		.factory('shopService', shopService);
	// Inject your dependencies as .$inject = ['$http', 'someSevide'];
	// function Name ($http, someSevide) {...}

	shopService.$inject = ['$http'];

	const baseURL = "https://aureda.herokuapp.com/";

	// Saving everythings locally

	let token = null;
	let user = null;
	let myImages = null;
	let buyableImages = null;

	function shopService($http) {
		return {
			getBuyablePhotos: getBuyablePhotos,
			getMyPhotos: getMyPhotos,
			buy: buy,
			isConnected: isConnected,
			getUser: getUser,
			connect: connect
		};

		function connect(code) {
			if (token == null)
				return postCode(code);

			return new Promise(function(){});
		}

		function getPhotos(token, filter) {
			let urlString = baseURL + "images?filter=" + filter;
			return new Promise((resolve) => {
				console.log(`Fetching ${urlString}...`);

				// Simple GET request example:
				$http({
					method: 'GET',
					url: urlString,
					headers: {
						'x-access-token': token
					}
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available
					resolve({
						status: 1,
						response,
					});
				}, function errorCallback(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					resolve({
						status: 0,
						response,
					});
				});
			});
		}

		function isConnected() {
			return user != null;
		}

		function getBuyablePhotos() {
			if (buyableImages == null) {
				return getPhotos(token, "buyable")
					.then((data) => {
						buyableImages = data.response.data;
						return buyableImages;
					});
			} else {
				return new Promise((resolve) => {
					resolve(buyableImages);
				});
			}
		}

		function getMyPhotos() {
			if (myImages == null) {
				return getPhotos(token, "owned")
					.then((data) => {
						myImages = data.response.data;
						return myImages;
					});
			} else {
				return new Promise((resolve) => {
					resolve(myImages);
				});
			}
		}

		function getUser() {
			if (user == null) {
				return getUserData()
					.then(() => {
						return user;
					})
			} else {
				return new Promise((resolve) => {
					resolve(user)
				});
			}
		}

		function buy(imageId) {
			let urlString = baseURL + "images/" + imageId;

			return new Promise((resolve) => {
				console.log(`Fetching ${urlString}...`);

				// Simple GET request example:
				$http({
					method: 'POST',
					url: urlString,
					headers: {
						'x-access-token': token
					}
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available

					resolve({
						status: 1,
						response,
					});
				}, function errorCallback(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					resolve({
						status: 0,
						response,
					});
				});
			}).then((response) => {
				// User info has changed, need to be refresh
				user = null;
				myImages = null;
				buyableImages = null;
			});

		}

		function getUserData() {
			let urlString = baseURL + "user_info";

			return new Promise((resolve) => {
				console.log(`Fetching ${urlString} for userData...`);

				// Simple GET request example:
				$http({
					method: 'GET',
					url: urlString,
					headers: {
						'x-access-token': token
					}
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available

					user = response.data;

					resolve({
						status: 1,
						response,
					});
				}, function errorCallback(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					resolve({
						status: 0,
						response,
					});
				});
			});
		}

		function postCode(code) {
			let urlString = baseURL + "access_token";
			console.log("Posting code to aureda");
			return new Promise((resolve) => {
				console.log(`Fetching ${urlString}...`);

				let body = {
					"code": code
				}

				// Simple GET request example:
				$http({
					method: 'POST',
					url: urlString,
					data: JSON.stringify(body)
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available
					token = response.data.access_token;

					resolve({
						status: 1
					});
				}, function errorCallback(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					resolve({
						status: 0
					});
				});
			});
		}
	}

})();
