var App = angular.module('myApp', []);

App.controller('serviceController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les structures
    const appUrl = 'unauth/services';
    // Initialisation des varisables
    $scope.serviceDto = {
        id: null,
        nom: null,
        descriptio: null
    };

    // Fonction pour charger la liste des structures
    $scope.loadServices= function () {
        $http.get(appUrl)
            .then(function (res) {
                $scope.serviceDto = res.data;
                console.log("DONNEES DE SERVICES : ", $scope.serviceDto);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
            });
    };

    // Chargement des structures au chargement de la page
    $scope.loadServices();

}]);
