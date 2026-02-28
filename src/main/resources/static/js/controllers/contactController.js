var App = angular.module('myApp', []);

App.controller('contactController', ['$scope', '$http', function($scope, $http) {
    // // URLs pour les opérations CRUD sur les structures
    // const appUrl = '/api/contacts';
    // // Initialisation des variables
    // $scope.listeContacts = [];
    // $scope.contact = {
    //     id: null,
    //     username: null,
    //     useremail: null,
    //     userphone: null,
    //     message: null,
    //     status: null,
      
    // };
    // // Fonction pour charger la liste des structures
    // $scope.loadContact = function () {
    //     $http.get(appUrl)
    //         .then(function (res) {
    //             $scope.listeContacts = res.data;
    //             // $scope.structureDto.dateCreation = new Date($scope.structureDto.dateCreation);
    //             console.log("DONNEES CONTACTS : ", $scope.listeContacts);
    //         })
    //         .catch(function (error) {
    //             console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
    //         });
    // };

    // // Chargement des structures au chargement de la page
    // // $scope.loadContact();

}]);
