var App = angular.module('myApp', []);

App.controller('espaceController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les structures
    const appUrl = 'unauth/espaces';
    // Initialisation des varisables
    $scope.listeEspace = [];
    $scope.espaceDto = {
        id: null, 
        nom: null,
        tarif: null,
        descriptio: null,
        img: null,
    };

    // Fonction pour charger la liste des structures
    $scope.loadEspaces= function () {
        $http.get(appUrl)
            .then(function (res) {
                $scope.listeEspace = res;
                console.log("DONNEES DE espaceS : ", $scope.espaceDto);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
            });
    };

    // Chargement des structures au chargement de la page
    $scope.loadEspaces();

}]);
