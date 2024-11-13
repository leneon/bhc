// Définition du module AngularJS avec ngSanitize pour afficher le contenu HTML enrichi
var App = angular.module('myApp', ['ngSanitize']);

// Directive pour lier les fichiers
App.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            const model = $parse(attrs.fileModel);
            const modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

// Directive pour intégrer Quill Editor
App.directive('quillEditor', function() {
    return {
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        link: function(scope, element) {
            const quill = new Quill(element[0], {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        ["image", "code-block"]
                    ]
                },
                placeholder: "Type your text here...",
                theme: "snow"
            });

            // Synchroniser Quill avec AngularJS
            quill.on('text-change', function() {
                scope.$applyAsync(() => {
                    scope.ngModel = quill.root.innerHTML;
                });
            });

            // Mettre à jour l'éditeur lorsque le modèle Angular change
            scope.$watch('ngModel', function(newValue) {
                if (quill.root.innerHTML !== newValue) {
                    quill.root.innerHTML = newValue || '';
                }
            });
        }
    };
});

// Contrôleur principal
App.controller('settingsController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    const appUrl = 'api/structures';

    $scope.listeStructures = [];
    $scope.structureDto = {
        id: null, nom: null, telephone: null, email: null, dateCreation: null,
        localisation: null, gps: null, bio: null, description: null,
        facebook: null, twitter: null, youtube: null, instagram: null
    };
    $scope.logo = null;
    $scope.img = null;
    $scope.img1 = null;
    $scope.img2 = null;

    // Charger les structures
    $scope.loadStructures = function () {
        $http.get(appUrl)
            .then(res => {
                $scope.structureDto = res.data;
                $scope.structureDto.dateCreation = new Date($scope.structureDto.dateCreation);
                console.log($scope.structureDto);
            })
            .catch(error => {
                console.error("Erreur de récupération des données :", error);
            });
    };

    $scope.loadStructures();

    // Créer une structure
    $scope.createStructure = function () {
        const structureJson = angular.toJson($scope.structureDto);
        $http.post(appUrl, structureJson)
            .then(res => {
                $scope.loadStructures();
                $scope.resetStructureForm();
                $scope.modalHide();
                $scope.successSwal("Structure ajoutée avec succès.");
            })
            .catch(error => {
                console.error("Erreur de création de la structure :", error);
                $scope.errorSwal("Erreur lors de la création de la structure.");
            });
    };

    $scope.updateStructure = function () {
        const formData = new FormData();
        $scope.isLoading = true; // Activer l'état de chargement
        $('#submitLabel').addClass('d-none'); // Masquer le texte du bouton
        $('#submitProgress').removeClass('d-none'); // Afficher l'indicateur de chargement

        // Ajouter structureDto en tant que Blob dans formData
        formData.append("structureDto", new Blob([JSON.stringify($scope.structureDto)], { type: "application/json" }));
        // Ajouter chaque fichier seulement s'il est défini
        if ($scope.logo!=null  && $scope.logo instanceof File) {
            formData.append("logo", $scope.logo);
        }
        if ($scope.img!=null  && $scope.img instanceof File) {
            formData.append("img", $scope.img);
        }
        if ($scope.img1!=null  && $scope.img1 instanceof File) {
            formData.append("img1", $scope.img1);
        }
        if ($scope.img2!=null  && $scope.img2 instanceof File) {
            formData.append("img2", $scope.img2);
        }

        fetch(appUrl + "/update/" + $scope.structureDto.id, {
            method: "Put",
            body: formData
        })
        .then(function (res) {
            $('#submitLabel').removeClass('d-none');
            $('#submitProgress').addClass('d-none');

            console.log("STRUCTURE MISE A JOUR ");
            $scope.loadStructures();
            $scope.successSwal("Structure modifiée avec succès.");
        })
        .catch(function (error) {
            console.error("ERREUR DE MISE A JOUR DE LA STRUCTURE : ", error);
            $scope.errorSwal("Erreur lors de la mise à jour de la structure.");
        });
    };

    $scope.resetStructureForm = function() {
        $scope.structureDto = angular.copy($scope.structureMasterDto);
    };

    $scope.validate = function () {
        if (!$scope.structureDto.nom || !$scope.structureDto.telephone || !$scope.structureDto.email) {
            $scope.errorSwal("Veuillez remplir tous les champs obligatoires!");
            return;
        }

        if ($scope.structureDto.id) {
            $scope.updateStructure();
        } else {
            $scope.createStructure();
        }
    };

    $scope.successSwal = function(message) {
        Swal.fire({ text: message, icon: "success", confirmButtonText: "D'accord" });
    };

    $scope.errorSwal = function(message) {
        Swal.fire({ title: "Erreur", text: message, icon: "error", confirmButtonText: "OK" });
    };
}]);
