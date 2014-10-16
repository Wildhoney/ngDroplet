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
            $scope.interface.setRequestUrl('upload.html');
            $scope.interface.useArray(false);

        });

        // Listen for when the files have been successfully uploaded.
        $scope.$on('$dropletUploaded', function whenDropletUploaded(event, response, files) {

            console.log(response, files);

        });

    });

})(window.angular);