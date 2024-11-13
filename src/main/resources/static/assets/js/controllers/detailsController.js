var App = angular.module('myApp', []);
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

App.controller('detailsController', ['$scope', '$http', function($scope, $http) {
    // Récupérer l'ID utilisateur à partir du DOM
    var usersUrl = "/api/users";
    var userUpdateUrl = usersUrl+"/update";
    var profileUrl = usersUrl+"/profile";
    var userId = $('#userId').val();
    $scope.userDto = {id:null, username:null, role:null, email:null, password:null, confirmationPassword:null};
        $scope.profileDto = {   id:null, nom:null, prenoms:null, dateNaiss:null, telephone:null,pays:null, ville:null,localisation:null, fonction:null,statut:null, avatar:null,bio:null, 
                                user:{id:null, username:null, email:null}
                            };
    $scope.avatar = null;

    $scope.loadUser = function () {
        if (userId) {
            // Inclure l'ID utilisateur dans l'appel
            $http.get(usersUrl + '/details/' + userId)
                .then(function (res) {
                    $scope.profileDto = res.data;
                    $scope.profileDto.dateNaiss = new Date($scope.profileDto.dateNaiss);
                    $scope.userDto.email =  res.data.user.email;
                    $scope.userDto.role =  res.data.user.role;
                    $scope.userDto.id =  res.data.user.id;
                    $scope.userDto.username =  res.data.user.username;
                    console.info($scope.profileDto);
                    $('#auth-avatar').attr('src', '/'+ res.data.avatar? res.data.avatar :'assets/media/avatars/blank.png');
                    $('#auth-avatar_second').attr('src',  '/'+ res.data.avatar? res.data.avatar:'assets/media/avatars/blank.png');
    
                })
                .catch(function (error) {
                    console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
                });
        } else {
            console.error("Aucun ID utilisateur trouvé.");
        }
    };

    $scope.isLoading = false; // Variable pour gérer l'état du chargement

    $scope.updateProfile = function() {
        $scope.isLoading = true; // Activer l'état de chargement
        
        // Créer un objet FormData pour gérer les données et le fichier
        const formData = new FormData();
    
        // Ajouter le JSON des données de profil dans FormData
        formData.append("profileDto", new Blob([JSON.stringify($scope.profileDto)], { type: "application/json" }));
        formData.append("avatar", $scope.avatar);

        console.log($scope.avatar);
        console.log(JSON.stringify($scope.profileDto));
        // Afficher l'indicateur de chargement
        $('#submitLabel').addClass('d-none'); // Masquer le texte du bouton
        $('#submitProgress').removeClass('d-none'); // Afficher l'indicateur de chargement
        
        // Ajouter le jeton d'autorisation (Bearer token)
        const token = localStorage.getItem('token'); // ou sessionStorage.getItem('authToken')
        
        // Configuration des en-têtes pour inclure l'Authorization avec le Bearer token

        
            // URL pour mettre à jour les informations du profil
            fetch(profileUrl + "/" + $scope.profileDto.id, {
                method: "PUT",
                body: formData // Pas besoin de headers['Content-Type']
            })
            .then(function(res) {
                console.info("Mise à jour réussie : ", res);
                
                // Réinitialiser l'indicateur de chargement
                $('#submitLabel').removeClass('d-none'); // Afficher à nouveau le texte
                $('#submitProgress').addClass('d-none'); // Masquer l'indicateur de chargement

               					
                $scope.isLoading = false; // Désactiver l'état de chargement
                $scope.loadUser ();
               
                // Afficher un message de succès
                Swal.fire({
                    text: "Profil mis à jour avec succès",
                    icon: "success",
                    confirmButtonText: "D'accord"
                });
            })
            .catch(function(error) {
                console.error("ERREUR LORS DE LA MISE À JOUR : ", error);
                
                // Réinitialiser l'indicateur de chargement en cas d'erreur
                $('#submitLabel').removeClass('d-none'); // Afficher à nouveau le texte
                $('#submitProgress').addClass('d-none'); // Masquer l'indicateur de chargement
                $scope.isLoading = false; // Désactiver l'état de chargement
                
                Swal.fire({
                    text: "Erreur lors de la mise à jour. Veuillez réessayer.",
                    icon: "error",
                    confirmButtonText: "D'accord"
                });
            });
    };
    
    
    
    
    // Fonction pour mettre à jour un utilisateur
    // $scope.updateUser = function () {
    //     $http.put(userUpdateUrl + '/' + $scope.userDto.id, $scope.userDto)
    //         .then(function (res) {
    //             console.log("UTILISATEUR MISE A JOUR : ", res.data);
    //             $scope.loadUsers();
    //             $scope.resetUserForm();
    //             $scope.successSwal("Utilisateur modifié avec succès.");
    //         })
    //         .catch(function (error) {
    //             console.error("ERREUR DE MISE A JOUR DE L'UTILISATEUR : ", error);
    //             $scope.errorSwal("Erreur lors de la mise à jour de l'utilisateur.");
    //         });
    // };
    

    $scope.updateUser = function() {
        $scope.isLoading = true; // Début du chargement
        userJson = angular.toJson($scope.userDto);
        console.log(userJson);
        // Validation du mot de passe et confirmation
        if ($scope.userDto.password  !== $scope.userDto.confirmationPassword ) {
            Swal.fire({
                text: "Le mot de passe et la confirmation ne sont pas identiques.",
                icon: "error",
                confirmButtonText: "Ok, j'ai compris",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            });
            $scope.isLoading = false;
            return;
        }
    
        // Simuler l'envoi d'une requête de mise à jour (remplace par un appel réel à ton service backend)
        $http.put(userUpdateUrl, userJson)
            .then(function(response) {
                // Succès de la mise à jour
                $scope.loadUser();
                Swal.fire({
                    text: "Le profil a été mis à jour avec succès.",
                    icon: "success",
                    confirmButtonText: "Ok",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Réinitialiser le formulaire ou effectuer une autre action
                    }
                });
            })
            .catch(function(error) {
                // Gestion des erreurs
                Swal.fire({
                    text: "Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.",
                    icon: "error",
                    confirmButtonText: "Ok",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            })
            .finally(function() {
                $scope.isLoading = false; // Fin du chargement
            });
    };
    

    $scope.loadUser();
}]);
