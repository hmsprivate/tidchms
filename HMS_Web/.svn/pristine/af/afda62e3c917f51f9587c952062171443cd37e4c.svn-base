define(['app'], function(app) {
    'use strict';

    app.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope:	 false,
            link: function ($scope, element, attrs) {
                var un = $scope.$watch(function () {
                    return $scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    element.html(value && value.toString());
                    
                    var s = $scope;
                    if ($scope.titleCompileScope) {
                    	s = $scope.titleCompileScope;
                    }
                    $compile(element.contents())(s);
                });
                
                $scope.$on("$destroy", function() {
                	un();
                })
            }
        };
    }]);
});