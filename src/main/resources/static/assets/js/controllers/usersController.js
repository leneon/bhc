"use strict";

document.addEventListener("DOMContentLoaded", function () {
    function generateRandomPassword(length) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };
    var KTUsersAddUser = function () {
        const modalElement = document.getElementById("kt_modal_add_user"),
            formElement = modalElement.querySelector("#kt_modal_add_user_form"),
            modalInstance = new bootstrap.Modal(modalElement);
        var createUserUrl = "auth/signup"
        return {
            init: function () {
                (() => {
                    const validator = FormValidation.formValidation(formElement, {
                        fields: {
                            user_name: {
                                validators: {
                                    notEmpty: {
                                        message: "Le nom d'utilisateur est requis"
                                    },
                                    stringLength: {
                                        min: 3,
                                        message: "Le nom d'utilisateur doit contenir au moins 3 caractères"
                                    }
                                }
                            },
                            user_email: {
                                validators: {
                                    notEmpty: {
                                        message: "Une adresse e-mail valide est requise"
                                    },
                                    emailAddress: {
                                        message: "L'entrée n'est pas une adresse e-mail valide"
                                    }
                                }
                            },
                            user_role: {
                                validators: {
                                    notEmpty: {
                                        message: "Le rôle est requis"
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap5({
                                rowSelector: ".fv-row",
                                eleInvalidClass: "",
                                eleValidClass: ""
                            })
                        }
                    });
            
                    const submitButton = modalElement.querySelector('[data-kt-users-modal-action="submit"]');
                    submitButton.addEventListener("click", (event) => {
                        event.preventDefault();
            
                        // Assurez-vous que l'URL de création d'utilisateur est correcte

                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                // Préparez les données à envoyer
                                const userData = {
                                    username: formElement.querySelector("#user_name").value,
                                    email: formElement.querySelector("#user_email").value,
                                    role: [formElement.querySelector("#user_role").value],
                                    password: "Rootkit1010."
                                };

                                // Envoi de la requête HTTP via Fetch
                                fetch(createUserUrl, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(userData)
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        // Gérer les erreurs de réponse HTTP
                                        return response.json().then(error => {
                                            throw new Error(error.message || "Une erreur est survenue.");
                                        });
                                    }
                                    angular.element(document.querySelector('[ng-controller="usersController"]')).scope().loadUsers();
                                    return response.json();
                                })
                                .then(data => {
                                    setTimeout(() => {
                                        submitButton.removeAttribute("data-kt-indicator");
                                        submitButton.disabled = false;

                                        // Affichez une alerte de succès après la création
                                        Swal.fire({
                                            text: "Utilisateur créé avec succès",
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris !",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                modalInstance.hide();
                                            }
                                        });
                                    }, 2000);
                                })
                                .catch((error) => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;

                                    // Affichez une alerte en cas d'erreur
                                    Swal.fire({
                                        text: error.message || "Une erreur est survenue, veuillez réessayer.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "D'accord, compris !",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });
                                });
                            } else {
                                Swal.fire({
                                    text: "Désolé, il semble qu'il y ait des erreurs détectées, veuillez réessayer.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "D'accord, compris !",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                });
                            }
                        });
                    }

                    });
            
                    modalElement.querySelector('[data-kt-users-modal-action="cancel"]').addEventListener("click", (event) => {
                        event.preventDefault();
                        this.showCancelConfirmation();
                    });
            
                    modalElement.querySelector('[data-kt-users-modal-action="close"]').addEventListener("click", (event) => {
                        event.preventDefault();
                        this.showCancelConfirmation();
                    });
                })();
            },
            
            showCancelConfirmation: function () {
                Swal.fire({
                    text: "Are you sure you would like to cancel?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, cancel it!",
                    cancelButtonText: "No, return",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then(function (result) {
                    if (result.value) {
                        formElement.reset();
                        modalInstance.hide();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire({
                            text: "Your form has not been cancelled!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "D'accord, compris !",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            }
        };
    }();

    // Initialiser le module
    KTUsersAddUser.init();
});


// KTUtil.onDOMContentLoaded(function () {
//     KTUsersAddUser.init();
// });

var App = angular.module('myApp', []);
App.controller('usersController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les utilisateurs
    const appUrl = 'api/users';
    const urlLoadUsers = appUrl;
    const urlSignup = "auth/signup";
    const urlUpdateUser = appUrl + "/update";
    const urlDeleteUser = appUrl + "/delete";
    const urlFindUser = appUrl + "/find";

    // Initialisation des variables
    $scope.users = [];
    $scope.userDto = {
        id: null,
        username: null,
        email: null,
        role: null,
    };
    $scope.userMasterDto = {
        id: null,
        username: null,
        email: null, 
        role: null,
    };
    $scope.listeUsers = null;
    //$scope.userMasterDto= angular.copy($scope.userDTO); // Copie pour éviter la référence

    // Fonction pour charger la liste des utilisateurs
    $scope.loadUsers = function () {
        $http.get(appUrl)
            .then(function (res) {
                $scope.listeUsers = res.data;
                console.log("LISTE DES UTILISATEURS : ", $scope.listeUsers);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES UTILISATEURS : ", error);
            });
    };

    // Chargement des utilisateurs au chargement de la page
    $scope.loadUsers();

    // Fonction pour créer un utilisateur
    $scope.createUser = function (data) {
        const userJson = angular.toJson(data);
        console.log(userJson);
        $http.post(urlSignup, userJson)
            .then(function (res) {
                console.log("UTILISATEUR CREE : ");
                $scope.loadUsers();
                $scope.userDto= angular.copy($scope.userMasterDto); // Copie pour éviter la référence
                
            })
            .catch(function (error) {
                console.error("ERREUR DE CREATION DE L'UTILISATEUR : ", error);
                $scope.errorSwal("Erreur lors de la création de l'utilisateur.");
                return false;
            });
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
        if ($scope.userMasterDTO.id) {
            $scope.updateUser();
        } else {
            $scope.createUser();
        }
    };

    // Afficher/masquer le modal
    $scope.modalShow = function() {
        $('#myModal').modal('show');
    };
    $scope.modalHide = function() {
        $('#myModal').modal('hide');
    };
}]);


// var KTUsersList=function(){var e,t,n,r,o=document.getElementById("kt_table_users"),c=()=>{o.querySelectorAll('[data-kt-users-table-filter="delete_row"]').forEach((t=>{t.addEventListener("click",(function(t){t.preventDefault();const n=t.target.closest("tr"),r=n.querySelectorAll("td")[1].querySelectorAll("a")[1].innerText;Swal.fire({text:"Are you sure you want to delete "+r+"?",icon:"warning",showCancelButton:!0,buttonsStyling:!1,confirmButtonText:"Yes, delete!",cancelButtonText:"No, cancel",customClass:{confirmButton:"btn fw-bold btn-danger",cancelButton:"btn fw-bold btn-active-light-primary"}}).then((function(t){t.value?Swal.fire({text:"You have deleted "+r+"!.",icon:"success",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}}).then((function(){e.row($(n)).remove().draw()})).then((function(){a()})):"cancel"===t.dismiss&&Swal.fire({text:customerName+" was not deleted.",icon:"error",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}})}))}))}))},l=()=>{const c=o.querySelectorAll('[type="checkbox"]');t=document.querySelector('[data-kt-user-table-toolbar="base"]'),n=document.querySelector('[data-kt-user-table-toolbar="selected"]'),r=document.querySelector('[data-kt-user-table-select="selected_count"]');const s=document.querySelector('[data-kt-user-table-select="delete_selected"]');c.forEach((e=>{e.addEventListener("click",(function(){setTimeout((function(){a()}),50)}))})),s.addEventListener("click",(function(){Swal.fire({text:"Are you sure you want to delete selected customers?",icon:"warning",showCancelButton:!0,buttonsStyling:!1,confirmButtonText:"Yes, delete!",cancelButtonText:"No, cancel",customClass:{confirmButton:"btn fw-bold btn-danger",cancelButton:"btn fw-bold btn-active-light-primary"}}).then((function(t){t.value?Swal.fire({text:"You have deleted all selected customers!.",icon:"success",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}}).then((function(){c.forEach((t=>{t.checked&&e.row($(t.closest("tbody tr"))).remove().draw()}));o.querySelectorAll('[type="checkbox"]')[0].checked=!1})).then((function(){a(),l()})):"cancel"===t.dismiss&&Swal.fire({text:"Selected customers was not deleted.",icon:"error",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}})}))}))};const a=()=>{const e=o.querySelectorAll('tbody [type="checkbox"]');let c=!1,l=0;e.forEach((e=>{e.checked&&(c=!0,l++)})),c?(r.innerHTML=l,t.classList.add("d-none"),n.classList.remove("d-none")):(t.classList.remove("d-none"),n.classList.add("d-none"))};return{init:function(){o&&(o.querySelectorAll("tbody tr").forEach((e=>{const t=e.querySelectorAll("td"),n=t[3].innerText.toLowerCase();let r=0,o="minutes";n.includes("yesterday")?(r=1,o="days"):n.includes("mins")?(r=parseInt(n.replace(/\D/g,"")),o="minutes"):n.includes("hours")?(r=parseInt(n.replace(/\D/g,"")),o="hours"):n.includes("days")?(r=parseInt(n.replace(/\D/g,"")),o="days"):n.includes("weeks")&&(r=parseInt(n.replace(/\D/g,"")),o="weeks");const c=moment().subtract(r,o).format();t[3].setAttribute("data-order",c);const l=moment(t[5].innerHTML,"DD MMM YYYY, LT").format();t[5].setAttribute("data-order",l)})),(e=$(o).DataTable({info:!1,order:[],pageLength:10,lengthChange:!1,columnDefs:[{orderable:!1,targets:0},{orderable:!1,targets:6}]})).on("draw",(function(){l(),c(),a()})),l(),document.querySelector('[data-kt-user-table-filter="search"]').addEventListener("keyup",(function(t){e.search(t.target.value).draw()})),document.querySelector('[data-kt-user-table-filter="reset"]').addEventListener("click",(function(){document.querySelector('[data-kt-user-table-filter="form"]').querySelectorAll("select").forEach((e=>{$(e).val("").trigger("change")})),e.search("").draw()})),c(),(()=>{const t=document.querySelector('[data-kt-user-table-filter="form"]'),n=t.querySelector('[data-kt-user-table-filter="filter"]'),r=t.querySelectorAll("select");n.addEventListener("click",(function(){var t="";r.forEach(((e,n)=>{e.value&&""!==e.value&&(0!==n&&(t+=" "),t+=e.value)})),e.search(t).draw()}))})())}}}();KTUtil.onDOMContentLoaded((function(){KTUsersList.init()}));
