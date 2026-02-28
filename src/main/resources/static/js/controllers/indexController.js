var App = angular.module('myApp', []);

App.controller('indexController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les structures
    const appUrl = 'unauth/structure';
    const servicesUrl = 'unauth/services';

    // Initialisation des variables
    $scope.structureDto = {
        id: null,
        nom: null,
        telephone: null,
        email: null,
        dateCreation: null,
        localisation: null,
        gps: null,
        logo: null,
        bio: null,
        description: null,
        img: null,
        img1: null,
        img2: null
    };
    $scope.listeServices = [];

    // Fonction pour charger la liste des structures
    $scope.loadStructure = function () {
        $http.get(appUrl)
            .then(function (res) {
                $scope.structureDto = res.data;
                $scope.structureDto.dateCreation = new Date($scope.structureDto.dateCreation);
                console.log("DONNEES DE LA STRUCTURES : ", $scope.structureDto);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
            });
    };

    // Chargement des structures au chargement de la page
    $scope.loadStructure();

         // Fonction pour charger la liste des structures
         $scope.loadServices= function () {
            $http.get(servicesUrl)
                .then(function (res) {
                    $scope.listeServices = res.data;
                })
                .catch(function (error) {
                    console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
                });
        };
        $scope.loadServices();

}]);
