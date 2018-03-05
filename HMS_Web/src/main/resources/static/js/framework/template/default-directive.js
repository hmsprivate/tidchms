define(["app"], function(app) {
    app.directive("defaultDirective", function() {
        'use strict';
        
        return {
            restrict: "E",
            transclude: true,
            template:"",
            scope: {
                
            },
            link: function postLink($scope, element, attrs, controller) {
                // property
            	var target = angular.element(element);
            	
            	// function
            	function remove() {
            		target.off("remove", remove);
            	}
            	target.on("remove", remove);
            },
            controller: ["$scope", function($scope) {
                // property
            	
            	// method
            	
            	// event-handler
            	
            	// function
            	function initialize() {

            	}

            }] 
        }
    });
});