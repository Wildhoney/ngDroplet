(function($angular) {

    // And... and... who other than you knows how to count the stars?
    $angular.module('dropletApp', ['ngDroplet']).controller('IndexController', function IndexController($scope) {

        /**
         * @property interface
         * @type {Object}
         */
        $scope.interface = {};

        // Listen for when the interface has been configured.
        $scope.$on('$dropletReady', function whenDropletReady() {

            $scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif', 'svg', 'torrent']);
            $scope.interface.setUrl('upload.html');

        });

    });

})(window.angular);