angular.module('app.controllers', ['ngCordova'])

  
.controller('menuCtrl', function($scope,$http,sharedCartService,sharedFilterService,$ionicPopup,$state,$ionicHistory) {
	$scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };
 
 
     if (sessionStorage.getItem('loggedin_name')!=null){
		 
	//put cart after menu
	var cart = sharedCartService.cart;
	  
	//$scope.slide_items=[];
			 
	$scope.noMoreItemsAvailable = false; // lazy load list
	 
  	//loads the menu----onload event
	$scope.$on('$stateChangeSuccess', function() {
		 $scope.loadMore();  //Added Infine Scroll
	});
 
	// Loadmore() called inorder to load the list 
	$scope.loadMore = function() {
 
			 str=sharedFilterService.getUrl();
			 
			 $http.get(str).success(function (response){
				 
				 $scope.menu_items = response;
				  
				$scope.hasmore=response.has_more;	//"has_more": 0	or number of items left
				$scope.hasmore=0;	
				 $scope.$broadcast('scroll.infiniteScrollComplete');
			 });	
			
			//more data can be loaded or not
			if ( $scope.hasmore == 0 ) {
			  $scope.noMoreItemsAvailable = true;
			}
	};
	 
	
	 //show product page
	$scope.showProductInfo=function (id,desc,payFrom,payTo,hkd,image_url) {	 
		 sessionStorage.setItem('id',id);
		 sessionStorage.setItem('image_url',image_url);
		 sessionStorage.setItem('desc',desc);
		  sessionStorage.setItem('hkd',hkd);
		   sessionStorage.setItem('pay_from',payFrom);
		    sessionStorage.setItem('pay_to',payTo);
			
				
		$state.go('productPage', {}, {location: "replace", reload: true});
	  	 //window.location.href = "#/page13";
	 };

	 //add to cart function
	 $scope.addToCart=function(id,image,name,price){    
		cart.add(id,image,name,price,1);	
	 };	 
	 }else{
		$scope.noMoreItemsAvailable = true;
	 }
})
   
 
   
.controller('checkOutCtrl', function($scope) {
	$scope.loggedin=function(){
		if(sessionStorage.getItem('loggedin_id')==null){return 1;}
		else{
			$scope.loggedin_name= sessionStorage.getItem('loggedin_name');
		 
			return 0;
		}
	};
	
	

})

.controller('indexCtrl', function($scope,sharedCartService) {
	
	 
	$scope.loggedin_name = sessionStorage.getItem('loggedin_name');
	
	$scope.get_loggedin_name= function() {
          var loggedin_name="";
          	loggedin_name = sessionStorage.getItem('loggedin_name');
          return loggedin_name;
        };
		
		 
})
   
.controller('loginCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
	
	  $scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };
		$scope.user = {};
		
		$scope.login = function() {
 
			  var url = "http://localhost/pm/apiAuth";
			  var urlimg = "http://localhost/pm/api/image";
			  
			  
			  var req = {
				 method: 'POST',
				 url: url,
				     crossDomain : true,

				 headers: {
				   'Content-Type': "application/json",
				   'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
					'Access-Control-Allow-Headers':'X-Requested-With'	
				 },
				 data: { id: $scope.user.email ,password: $scope.user.password}
				};
				
			 
			$http(req).then(
			function (response){ 
				
				sessionStorage.setItem('loggedin_name', $scope.user.email);
			    $scope.loggedin_name= sessionStorage.getItem('loggedin_name');
			   
				$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
				});
				lastView = $ionicHistory.backView();
					console.log('Last View',lastView);
				$state.go('profile', {}, {location: "replace", reload: true});
				 
			},
			function(response) {
			  	$scope.showAlert('Error', 'Login Incorrect');
			});
		};
		
})
   
 
.controller('filterByCtrl', function($scope,sharedFilterService) {

  $scope.Categories = [
    {id: 1, name: 'Burgers & Wraps'},
    {id: 2, name: 'Drinks'}
  ];
  
  $scope.getCategory = function(cat_list){
    categoryAdded = cat_list;
	var c_string=""; // will hold the category as string
	
	for(var i=0;i<categoryAdded.length;i++){ c_string+=(categoryAdded[i].id+"||"); }
	
	c_string = c_string.substr(0, c_string.length-2);
	sharedFilterService.category=c_string;
	window.location.href = "#/page1";
  };
	

})
   
.controller('sortByCtrl', function($scope,sharedFilterService) {
	$scope.sort=function(sort_by){
		sharedFilterService.sort=sort_by;
		console.log('sort',sort_by);		
		window.location.href = "#/page1";
	};
})
   
 
   
.controller('profileCtrl', function($scope,$rootScope,$ionicHistory,$state) {

		$scope.loggedin_name= sessionStorage.getItem('loggedin_name');
	
		$scope.logout=function(){
				delete sessionStorage.loggedin_name;
				 
				
				console.log('Logoutctrl',sessionStorage.getItem('loggedin_name'));
				
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
				$state.go('menu', {}, {location: "replace", reload: true});
		};
})
   
 
 
.controller('productPageCtrl', function($scope,$state,$http,$ionicPopup) {

	   $scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };
	angular.element(document).ready(function () {
		$scope.id= sessionStorage.getItem('id');
 		$scope.image_url= sessionStorage.getItem('image_url');
		$scope.desc= sessionStorage.getItem('desc');
		 $scope.pay_from= sessionStorage.getItem('pay_from');
		 $scope.pay_to= sessionStorage.getItem('pay_to');
		 $scope.hkd= sessionStorage.getItem('hkd');
	});

	
		$scope.photoupload = function() {
			sessionStorage.setItem('cash_id', sessionStorage.getItem('id'));
			$state.go('photoupload', {}, {location: "replace", reload: true});
		}
	
		$scope.cashDelete = function() {
			var url = "http://localhost/pm/api/deleteCash";
			var id = $scope.id;
			var username=sessionStorage.getItem('loggedin_name');
			 
			 var req = {
				 method: 'POST',
				 url: url,
				 crossDomain : true,
				 headers: {
				   'Content-Type': "application/json"
				     },
				 data: { id: id, submitted_by: username }
				};
				
				
				  
			$http(req).then(
			function (response){ 
			 $scope.showAlert('OK', 'Cash Record Deleted');
				//sessionStorage.setItem('cash_id', sessionStorage.getItem('id'));
				$state.go('menu', {cache:false}, {location: "replace", reload: true});
				 
				
			},
			function(response) {
			      
					$scope.showAlert('Error', 'Delete Cash');
			});
			
		}

})
 
 .controller('createCashCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
	
	
	
	  $scope.showAlert = function(title, msg) {
		var alertPopup = $ionicPopup.alert({
		title: title,
		template: msg
		});
		};
  
		$scope.$on('$stateChangeSuccess', function() {
			$scope.cash = {};
			$scope.cash.payFrom=sessionStorage.getItem('loggedin_name');
			$scope.cash.desc="";
			$scope.cash.payTo="";
			$scope.cash.hkd="";
		});
		
		
		$scope.login = function() {
		 
			  var url = "http://localhost/pm/api/createCash";
			 
			  var req = {
				 method: 'POST',
				 url: url,
				 crossDomain : true,
				 headers: {
				   'Content-Type': "application/json"
				     },
				 data: { desc: $scope.cash.desc, pay_from: $scope.cash.payFrom , pay_to: $scope.cash.payTo , submitted_by : $scope.cash.payFrom , created_by : $scope.cash.payFrom ,hkd : $scope.cash.hkd}
				};
				
			 
			$http(req).then(
			function (response){ 
				console.log('cash_id',response.data.id);
				sessionStorage.setItem('cash_id', response.data.id);
				$state.go('photoupload', {}, {location: "replace", reload: true});
				
			},
			function(response) {
			      
					$scope.showAlert('Error', 'Field missing');
			});
		};
		
})


.controller('photouploadCtrl', function ($scope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet,$http,$state) {
  
  
  $scope.$on('$stateChangeSuccess', function() {
		    $scope.cash_id= sessionStorage.getItem('cash_id');
			$scope.loggedin_name=sessionStorage.getItem('loggedin_name');
			$scope.image = null;
	});
	

 
  $scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };
	// Present Actionsheet for switch beteen Camera / Library
	 $scope.loadImage = function() {
	  var options = {
		title: 'Select Image Source',
		buttonLabels: ['Load from Library', 'Use Camera'],
		addCancelButtonWithLabel: 'Cancel',
		androidEnableCancelButton : true,
	  };
	  $cordovaActionSheet.show(options).then(function(btnIndex) {
		var type = null;
		if (btnIndex === 1) {
		  type = Camera.PictureSourceType.PHOTOLIBRARY;
		} else if (btnIndex === 2) {
		  type = Camera.PictureSourceType.CAMERA;
		}
		if (type !== null) {
		  $scope.selectPicture(type);
		}
	  });
	};
 // The rest of the app comes in here
 
		 // Take image with the camera or from library and store it inside the app folder
		// Image will not be saved to users Library.
		$scope.selectPicture = function(sourceType) {
		  var options = {
			quality: 75,
			targetWidth: 1300,
			targetHeight: 1300,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: sourceType,
			 correctOrientation: true,
			saveToPhotoAlbum: true
		  };
		 
		  $cordovaCamera.getPicture(options).then(function(imagePath) {
			// Grab the file name of the photo in the temporary directory
			var currentName = imagePath.replace(/^.*[\\\/]/, '');
		 
			//Create a new name for the photo
			var d = new Date(),
			n = d.getTime(),
			newFileName =  n + ".jpg";
		 
			// If you are trying to load image from the gallery on Android we need special treatment!
			if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
			  window.FilePath.resolveNativePath(imagePath, function(entry) {
				window.resolveLocalFileSystemURL(entry, success, fail);
				function fail(e) {
				  console.error('Error: ', e);
				}
		 
				function success(fileEntry) {
				  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
				  // Only copy because of access rights
				  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
					$scope.image = newFileName;
				  }, function(error){
					$scope.showAlert('Error', error.exception);
				  });
				};
			  }
			);
			} else {
			  var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
			  // Move the file to permanent storage
			  $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
				$scope.image = newFileName;
			  }, function(error){
				$scope.showAlert('Error', error.exception);
			  });
			}
		  },
		  function(err){
			// Not always an error, maybe cancel was pressed...
		  })
		};
		
		
		// Returns the local path inside the app for an image
		$scope.pathForImage = function(image) {
		  if (image === null) {
			return '';
		  } else {
			return cordova.file.dataDirectory + image;
		  }
		};
		
		
		$scope.uploadImage = function() {
			  
			  var urlimg = "http://localhost/pm/api/image";
			  
			  
			 
	
						// File for Upload
						  var targetPath = $scope.pathForImage($scope.image);
						 
						  // File name only
						  var filename = $scope.image;
						 
		 
			 
					   var options = {
						fileKey: "image_file",
						fileName: filename,
						httpMethod: "POST",
						chunkedMode: true,
						mimeType: "image/jpeg",
						params : {'fileName': filename, id: $scope.cash_id}
					  };
					 
					  $cordovaFileTransfer.upload(urlimg, targetPath, options).then(function(result) {
						$scope.showAlert('Success', 'Image upload finished.');
						
						$state.go('menu', {}, {location: "replace", reload: true});
					  },function(result) {
						$scope.showAlert('Error', 'Unable to upload photo');
					  });
					  
					  $scope.ion-upload.disable;
			}
})
   
