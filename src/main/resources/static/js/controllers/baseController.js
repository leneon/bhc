var App = angular.module('App', []);

App.controller('baseController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les rôles
    const usersUrl = 'api/users';
    const authUrl = usersUrl + "/auth";

    $scope.auth = null;

    $scope.loadAuth = function () {
        $http.get(authUrl)
            .then(function (res) {
                $scope.auth = res.data;
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
            });
    };
    $scope.loadAuth();


}]);
