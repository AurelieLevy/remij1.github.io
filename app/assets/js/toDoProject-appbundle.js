/*!
* toDoProject - v0.0.1 - MIT LICENSE 2018-01-25. 
* @author PalJacqueLy
*/
(function() {
	'use strict';

	/**
	 * @ngdoc index
	 * @name app
	 * @description
	 * # app
	 *
	 * Main modules of the application.
	 */

	angular.module('toDoProject', [
		'ngResource',
		'ngAria',
		 'ui.bootstrap',
		 'ngMaterial',
		'ngMdIcons',
		'ngCookies',
		'ngTouch',
		'ui.router',
		'home',
		'login',
		'shop',
	]);

})();

(function () {
	'use strict';

	/**
	 * @ngdoc configuration file
	 * @name app.config:config
	 * @description
	 * # Config and run block
	 * Configutation of the app
	 */


	angular
		.module('toDoProject')
		.config(configure)
		.run(runBlock);

	configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

	function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$locationProvider.hashPrefix('!');

		// This is required for Browser Sync to work poperly
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		
		$urlRouterProvider
			.otherwise('/dashboard');
		
	}

	runBlock.$inject = ['$rootScope'];

	function runBlock($rootScope) {
		'use strict';

		console.log('AngularJS run() function...');
	}


})();

(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.module:homeModule
	* @description
	* # homeModule
	* Module of the app
	*/

	angular.module('home', []);
})();

(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.module:loginModule
	 * @description
	 * # loginModule
	 * Module of the app
	 */

  	angular.module('login', []);

})();

(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.module:shopModule
	 * @description
	 * # shopModule
	 * Module of the app
	 */

  	angular.module('shop', []);

})();

'use strict';

	/**
	* @ngdoc function
	* @name app.route:HomeRoute
	* @description
	* # HomeRoute
	* Route of the app
	*/

angular.module('home')
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
			
			.state('home', {
				url: '',
				abstract: true,
				templateUrl: 'app/modules/home/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'vm'
			})
			.state('home.dashboard', {
				url:'/dashboard',
				templateUrl: 'app/modules/home/dashboard.html'
			});
			
	}]);

'use strict';

/**
 * @ngdoc function
 * @name app.route:loginRoute
 * @description
 * # loginRoute
 * Route of the app
 */

angular.module('login')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.login', {
				url:'/login',
				templateUrl: 'app/modules/login/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'vm'
			});

		
	}]);

'use strict';

/**
 * @ngdoc function
 * @name app.route:shopRoute
 * @description
 * # shopRoute
 * Route of the app
 */

angular.module('shop')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.shop', {
				url:'/shop',
				templateUrl: 'app/modules/shop/shop.html',
				controller: 'ShopCtrl',
				controllerAs: 'vm'
			});

		
	}]);

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

	Home.$inject = ['$scope', 'homeService', 'shopService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Home($scope, homeService, shopService) {
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

			console.log("Getting token from code " + findGetParameter("code"));

			vm.resetError();

			console.log("Getting token from code " + findGetParameter("code"));

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

		$scope.$on('refreshUser', (event) => {
			vm.getPhotos();
			vm.getUserData();
		});

		setLoginLink();

		vm.getToken();


	}

})();

(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:LayoutCtrl
	* @description
	* # LayoutCtrl
	* Controller of the app
	*/

	angular
		.module('toDoProject')
		.controller('LayoutCtrl', Layout);

	Layout.$inject = ['$mdSidenav', '$cookies', '$state', '$mdToast', '$mdDialog'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function Layout($mdSidenav, $cookies, $state, $mdToast, $mdDialog ) {
		/*jshint validthis: true */
		var vm = this;

		vm.toggleSidenav = function (menuId) {
			$mdSidenav(menuId).toggle();
		};

		vm.changePassword = function () {
			$mdToast.show(
				$mdToast.simple()
				.content('Password clicked!')
				.position('top right')
				.hideDelay(2000)
			);
		};

		vm.changeProfile = function (ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'tabDialog.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true
			})
			.then(function(answer) {
				$mdToast.show(
					$mdToast.simple()
					.content('You said the information was "' + answer + '".')
					.position('top right')
					.hideDelay(2000)
				);

			}, function() {
				$mdToast.show(
					$mdToast.simple()
					.content('You cancelled the dialog.')
					.position('top right')
					.hideDelay(2000)
				);
			});

			function DialogController($scope, $mdDialog) {
				$scope.hide = function() {
					$mdDialog.hide();
				};

				$scope.cancel = function() {
					$mdDialog.cancel();
				};

				$scope.answer = function(answer) {
					$mdDialog.hide(answer);
				};
			}
		};


		vm.logOut = function () {

			alert('Implement your Function Here');
			$cookies.put('dev_appserver_login', ' ');
			$state.go('out', {}, {reload: true});

		};

		vm.login = function () {
			
		}

		var originatorEv;
		vm.openMenu = function ($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		};

	}

})();

(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:NavBarCtrl
	* @description
	* # NavBarCtrl
	* Controller of the app
	*/

	angular
		.module('toDoProject')
		.controller('NavBarCtrl', NavBar);

	NavBar.$inject = ['homeService', 'MenuService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function NavBar(homeService, MenuService) {
		/*jshint validthis: true */
		var vm = this;
		vm.title = "toDoProject";

		vm.menu = MenuService.listMenu();

	}

})();

(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:SidenavCtrl
	* @description
	* # SidenavCtrl
	* Controller of the app
	*/
	angular
		.module('toDoProject')
		.controller('SidenavCtrl', SidenavCtrl)
		.controller('SettingsCtrl', SettingsCtrl);

	// Injecting Denpendencies

	SidenavCtrl.$inject = ['$mdSidenav', '$state', '$mdBottomSheet', '$mdToast', 'MenuService', '$scope'];
	SettingsCtrl.$inject = ['$mdBottomSheet'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function SidenavCtrl($mdSidenav, $state, $mdBottomSheet, $mdToast, MenuService, $scope) {
		/*jshint validthis: true */
		var vm = this;

		vm.toggleSidenav = function (menuId) {
			$mdSidenav(menuId).toggle();
		};

		vm.closeSidenav = function() {
			$mdSidenav('left').close();
		};

		// Close menu on small screen after click on menu item.
		// Only use $scope in controllerAs when necessary; for example, publishing and subscribing events using $emit, $broadcast, $on or $watch.
		$scope.$on('$stateChangeSuccess', vm.closeSidenav);

		vm.menu = MenuService.listMenu();


		vm.navigateTo = function (target) {

			var page = target;

			$state.go(page);

		};

		vm.showSettingsBottom = function ($event) {
			vm.alert = '';
			$mdBottomSheet.show({
				template: '<md-bottom-sheet class="md-grid" layout="column" ng-cloak><div layout="row" layout-align="center center"><h4>With clickOutsideToClose option, drag down or press ESC to close</h4></div><md-list flex layout="row" layout-align="center center"><md-list-item ng-repeat="item in vm.items"><md-button class="md-grid-item-content" ng-click="vm.listItemClick($index)"><md-icon class="md-48">{{item.icon}}</md-icon><div class="md-grid-text"> {{ item.name }} </div></md-button></md-list-item></md-list></md-bottom-sheet>',
				controller: 'SettingsCtrl',
				controllerAs: 'vm',
				targetEvent: $event
			}).then(function (clickedItem) {
				$mdToast.show(
					$mdToast.simple()
					.content(clickedItem.name + ' clicked!')
					.position('top right')
					.hideDelay(2000)
				);
			});
		};

	}

	function SettingsCtrl($mdBottomSheet) {
		/*jshint validthis: true */
		var vm = this;

		vm.items = [
			{name: 'Roles', icon: 'assignment_ind'},
			{name: 'Notes', icon: 'speaker_notes'},
			{name: 'Tasks', icon: 'view_list'},
			{name: 'Inbox', icon: 'inbox'}
		];

		vm.listItemClick = function ($index) {
			var clickedItem = vm.items[$index];
			$mdBottomSheet.hide(clickedItem);
		};
	}

})();

(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:loginCtrl
	* @description
	* # loginCtrl
	* Controller of the app
	*/

  	angular
		.module('login')
		.controller('LoginCtrl', Login);

		Login.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Login() {
			/*jshint validthis: true */
			var vm = this;

		}

})();

(function () {
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

	shopCtrl.$inject = ['$scope', '$rootScope', 'shopService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function shopCtrl($scope, $rootScope, shopService) {
		/*jshint validthis: true */
		var vm = this;
		vm.photos = [];
		vm.loginLink = "";
		vm.token = "";

		vm.error = null;

		vm.resetError = function () {
			vm.error = null;
		}

		vm.getToken = function () {
			vm.resetError();

			console.log("Getting token from code " + findGetParameter("code"));

			shopService.postCode(findGetParameter("code"))
				.then((data) => {
					vm.token = data.response.data;
					vm.getPhotos();
					$scope.$apply();
				});

			/*
			shopService
				.postCode(`https://aureda.herokuapp.com/access_token`, findGetParameter("code"))
				.then((data) => {
					if (data.status === 0) {
						vm.error = 'the token could not be get';
					} else if (data.status === 1) {
						vm.token = data.response.data;
						vm.getPhotos();
						console.log(vm.token);
					}

					$scope.$apply();
				});//*/
		}

		vm.getPhotos = function () {
			vm.resetError();

			shopService.getBuyablePhotos()
				.then((data) => {
					if (data.status === 0) {
						vm.error = 'Could not get MY photos';
					} else if (data.status === 1) {
						vm.photos = data.response.data;
					}

					$scope.$apply();
				});
			/*
			shopService
				.getBuyablePhotos(`https://aureda.herokuapp.com/images?filter=buyable`, vm.token)
				.then((data) => {
					if (data.status === 0) {
						vm.error = 'Could not get MY photos';
					} else if (data.status === 1) {
						vm.photos = data.response.data;
					}

					$scope.$apply();
				});//*/
		}

		$scope.buy = function(imageId){
			shopService.buy(imageId)
				.then(() => $rootScope.$broadcast('refreshUser'));
		}

		$scope.$on('refreshUser',  (event) => {
			vm.getPhotos();
		});

		function makerandom() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 30; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
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

		vm.getToken();
	}
})();

(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.service:homeService
	* @description
	* # homeService
	* Service of the app
	*/

	angular
		.module('home')
		.factory('homeService', homeService);

	homeService.$inject = ['$http'];

	function homeService($http) {
		return {
			getMyPhotos: getMyPhotos,
			postCode: postCode,
		};

		function getMyPhotos(urlString, token) {
			return new Promise((resolve) => {
				console.log(`Fetching ${urlString}...`);

				// Simple GET request example:
				$http({
					method: 'GET',
					url: urlString,
					headers: {
						'x-access-token': token.access_token
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

		function postCode(urlString, code) {
			console.log("Posting code to aureda");
			return new Promise((resolve) => {
				console.log(`Fetching ${urlString}...`);

				let body = {
					"code" : code
				}

				// Simple GET request example:
				$http({
					method: 'POST',
					url: urlString,
					data: JSON.stringify(body)
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
	}
})();
(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:menuService
	 * @description
	 * # menuService
	 * Service of the app
	 */

  	angular
		.module('toDoProject')
		.factory('MenuService', Menu);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Menu.$inject = ['$http'];

		function Menu ($http) {

			var menu = [

					{
						link: 'shop',
							name: 'Shop'
					},
			    
		  	];

			return {
				listMenu: function () {
					return menu;
				}
		  	}

		}

})();

(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:menuService
	 * @description
	 * # menuService
	 * Service of the app
	 */

  	angular
		.module('toDoProject')
		.factory('MenuService', Menu);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Menu.$inject = ['$http'];

		function Menu ($http) {

			var menu = [
				
					{
						link: 'shop',
							name: 'Shop'
					},
			    
		  	];

			return {
				listMenu: function () {
					return menu;
				}
		  	}

		}

})();

(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:loginService
	 * @description
	 * # loginService
	 * Service of the app
	 */

  	angular
		.module('login')
		.factory('LoginService', Login);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Login.$inject = ['$http'];

		function Login ($http) {

		}

})();

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
	let token = "";

	function shopService($http) {
		return {
			getBuyablePhotos: getBuyablePhotos,
			getMyPhotos: getMyPhotos,
			postCode: postCode,
			buy:buy,
			getUserData:getUserData
		};


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

		function getBuyablePhotos() {
			return getPhotos(token, "buyable");
		}

		function getMyPhotos() {
			return getPhotos(token, "owned");
		}

		function buy(imageId){
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
			});
			
		}

		function getUserData(){
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
	}

})();

(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.directive:navbarDirective
	* @description
	* # navbarDirective
	* Directive of the app
	*/

	angular
		.module('toDoProject')
		.directive('navBar', navBar);

	function navBar() {

		var directive = {
			link: link,
			restrict: 'EA',
			scope: {
				menus: '=',
				brand: '='
			},
			controller: control,
			templateUrl: 'app/modules/layouts/nav-bar/navbar-tpl.html'
		};

		return directive;

		function link(scope, element, attrs, $location) {
			// write your code here
			scope.defaults = {
				brand: '',
				menus: [],
				search: {
					show: false
				}
			}; // end defaults

		}

		function control($scope, $location) {

			$scope.isActive = function (path) {
				var currentPath = $location.path().split('/')[1];
				if (currentPath.indexOf('?') !== -1) {
					currentPath = currentPath.split('?')[0];
				}
				return currentPath === path.split('/')[1];
			};
		}

	}

})();
