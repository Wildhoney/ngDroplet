(function($angular) {

    "use strict";

    // The truest wisdom is a resolute determination...
    var module = $angular.module('ngDroplet', []);

    module.directive('droplet', function DropletDirective() {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'EA',

            /**
             * @property scope
             * @type {Boolean}
             */
            scope: {
                moduleInterface: '=interface'
            },

            /**
             * @property transclude
             * @type {Boolean}
             */
            transclude: true,

            /**
             * @method controller
             * @param $scope {Object}
             * @return {void}
             */
            controller: ['$scope', function DropletController($scope) {

                /**
                 * @property files
                 * @type {Array}
                 */
                $scope.files = [];

            }],

            /**
             * @method link
             * @param scope {Object}
             * @return {void}
             */
            link: function link(scope, element, attributes, transclude) {

                transclude();

            }

        }

    });

})(window.angular);