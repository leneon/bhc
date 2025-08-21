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
    var KTreservationsAddreservation = function () {
        const modalElement = document.getElementById("kt_modal_add_reservation"),
            formElement = modalElement.querySelector("#kt_modal_add_reservation_form"),
            modalInstance = new bootstrap.Modal(modalElement);
        var createreservationUrl = "auth/signup"
        return {
            init: function () {
                (() => {
                    const validator = FormValidation.formValidation(formElement, {
                        fields: {
                            reservation_name: {
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
                            reservation_email: {
                                validators: {
                                    notEmpty: {
                                        message: "Une adresse e-mail valide est requise"
                                    },
                                    emailAddress: {
                                        message: "L'entrée n'est pas une adresse e-mail valide"
                                    }
                                }
                            },
                            reservation_role: {
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
            
                    const submitButton = modalElement.querySelector('[data-kt-reservations-modal-action="submit"]');
                    submitButton.addEventListener("click", (event) => {
                        event.preventDefault();
            
                        // Assurez-vous que l'URL de création d'utilisateur est correcte

                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                // Préparez les données à envoyer
                                const reservationData = {
                                    reservationname: formElement.querySelector("#reservation_name").value,
                                    email: formElement.querySelector("#reservation_email").value,
                                    role: [formElement.querySelector("#reservation_role").value],
                                    password: "Rootkit1010."
                                };

                                // Envoi de la requête HTTP via Fetch
                                fetch(createreservationUrl, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(reservationData)
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        // Gérer les erreurs de réponse HTTP
                                        return response.json().then(error => {
                                            throw new Error(error.message || "Une erreur est survenue.");
                                        });
                                    }
                                    angular.element(document.querySelector('[ng-controller="reservationsController"]')).scope().loadReservation();
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
            
                    modalElement.querySelector('[data-kt-reservations-modal-action="cancel"]').addEventListener("click", (event) => {
                        event.preventDefault();
                        this.showCancelConfirmation();
                    });
            
                    modalElement.querySelector('[data-kt-reservations-modal-action="close"]').addEventListener("click", (event) => {
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
    KTreservationsAddreservation.init();
});


// KTUtil.onDOMContentLoaded(function () {
//     KTreservationsAddreservation.init();
// });

var App = angular.module('myApp', []);
App.controller('reservationController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les utilisateurs
    const appUrl = 'api/locations/reservations';
    const voituresUrl = 'api/voitures';
    const clientsUrl = 'api/users/all';
    const urlloadReservation = appUrl;
    const urlSignup = "auth/signup";
    const urlUpdatereservation = appUrl + "/update";
    const urlDeletereservation = appUrl + "/delete";
    const urlFindreservation = appUrl + "/find";
    const idReservation = null;
    // Initialisation des variables
    $scope.reservations = [];
    $scope.voitures = [];
    $scope.clients = [];
    $scope.reservationDto = {
        id: null,
        reservationname: null,
        email: null,
        voiture: null,
        client: null,
    };
    $scope.reservationMasterDto = {
        id: null,
        reservationname: null,
        email: null, 
        voiture: null,
        client: null,
    };
    $scope.listereservations = null;
    $scope.clientForm = {
        nomComplet: '',
        email: '',
        adresse: '',
        telephone: ''
    };
    //$scope.reservationMasterDto= angular.copy($scope.reservationDTO); // Copie pour éviter la référence

    $scope.addClient = function() {
        const data = {
            nomComplet: $scope.clientForm.nomComplet,
            email: $scope.clientForm.email,
            adresse: $scope.clientForm.adresse,
            telephone: $scope.clientForm.telephone
        };
        $http.post('/api/users/clients', data)
            .then(function(res) {
                $scope.loadClients();
                
                $scope.clientForm = { nomComplet: '', email: '', adresse: '', telephone: '' };
                Swal.fire({
                    text: 'Client ajouté avec succès',
                    icon: 'success',
                    confirmButtonText: "D'accord",
                    customClass: { confirmButton: "btn btn-primary" }
                });
                $('#kt_modal_add_client').modal('hide');
            })
            .catch(function(error) {
                Swal.fire({
                    text: error.data && error.data.message ? error.data.message : "Erreur lors de l'ajout du client.",
                    icon: 'error',
                    confirmButtonText: "D'accord",
                    customClass: { confirmButton: "btn btn-primary" }
                });
            });
    };
    // Fonction pour charger la liste des utilisateurs
    $scope.loadVoitures = function () {
        $http.get(voituresUrl)
            .then(function (res) {
                $scope.voitures = res.data;
                console.log("LISTE DES VOITURES : ", $scope.voitures);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES VOITURES : ", error);
            });
    };
    $scope.loadVoitures();

    $scope.loadReservation = function () {
        $http.get(urlloadReservation +"/"+ idReservation)
            .then(function (res) {
                $scope.voitures = res.data;
                console.log("LISTE DES VOITURES : ", $scope.voitures);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES VOITURES : ", error);
            });
    };
    // Fonction pour charger la liste des réservations  
    idReservation ? $scope.loadReservation():null;

$scope.loadclients = function () {
        $http.get(clientsUrl)
            .then(function (res) {
                $scope.clients = res.data;
                console.log("LISTE DES UTILISATEURS : ", $scope.clients);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES UTILISATEURS : ", error);
            });
    };
    $scope.loadclients();

    $scope.createreservation = function (data) {
        const reservationJson = angular.toJson(data);
        console.log(reservationJson);
        $http.post(urlSignup, reservationJson)
            .then(function (res) {
                console.log("UTILISATEUR CREE : ");
                $scope.loadReservation();
                $scope.reservationDto= angular.copy($scope.reservationMasterDto); // Copie pour éviter la référence
                $scope.showSuccessMessage("Utilisateur créé avec succès");
            })
            .catch(function (error) {
                console.error("ERREUR DE CREATION DE L'UTILISATEUR : ", error);
                $scope.showErrorMessage("Erreur lors de la création de l'utilisateur.");
                return false;
            });
    };

    // Fonction pour voir les détails d'un utilisateur
    $scope.viewreservation = function(reservationId) {
        window.location.href = '/atiko/utilisateurs/details/' + reservationId;
    };

    // Fonction pour modifier un utilisateur
    $scope.editreservation = function(reservation) {
        $scope.reservationMasterDto = angular.copy(reservation);
        $('#kt_modal_add_reservation').modal('show');
    };

    // Fonction pour activer/désactiver un utilisateur
    $scope.togglereservationStatus = function(reservationId, currentStatus) {
        console.log("TOGGLE STATUS - reservation ID:", reservationId, "Current status:", currentStatus);
        const newStatus = !currentStatus;
        const action = newStatus ? 'activer' : 'désactiver';
        
        Swal.fire({
            title: 'Confirmation',
            text: `Êtes-vous sûr de vouloir ${action} cet utilisateur ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, confirmer',
            cancelButtonText: 'Annuler',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-light'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Trouver l'utilisateur dans la liste
                const reservation = $scope.listereservations.find(u => u.id === reservationId);
                console.log("Found reservation for status update:", reservation);
                if (reservation) {
                    const updateData = {
                        id: reservationId,
                        reservationname: reservation.reservationname,
                        email: reservation.email,
                        role: reservation.role,
                        status: newStatus
                    };
                    console.log("Sending update data:", updateData);
                    
                    $http.put(urlUpdatereservation, updateData)
                    .then(function(response) {
                        console.log("Status update successful:", response);
                        $scope.loadReservation();
                        $scope.showSuccessMessage(`Utilisateur ${action === 'activer' ? 'activé' : 'désactivé'} avec succès`);
                    })
                    .catch(function(error) {
                        console.error("ERREUR LORS DE LA MODIFICATION DU STATUT : ", error);
                        $scope.showErrorMessage("Erreur lors de la modification du statut de l'utilisateur.");
                    });
                }
            }
        });
    };

    // Fonction pour supprimer un utilisateur
    $scope.deletereservation = function(reservationId, reservationname) {
        console.log("DELETE reservation - reservation ID:", reservationId, "reservationname:", reservationname);
        Swal.fire({
            title: 'Confirmation de suppression',
            text: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${reservationname}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-light'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Sending delete request to:", urlDeletereservation + '/' + reservationId);
                $http.delete(urlDeletereservation + '/' + reservationId)
                .then(function(response) {
                    console.log("Delete successful:", response);
                    $scope.loadReservation();
                    $scope.showSuccessMessage("Utilisateur supprimé avec succès");
                })
                .catch(function(error) {
                    console.error("ERREUR LORS DE LA SUPPRESSION : ", error);
                    $scope.showErrorMessage("Erreur lors de la suppression de l'utilisateur.");
                });
            }
        });
    };

    // Fonction pour afficher un message de succès
    $scope.showSuccessMessage = function(message) {
        Swal.fire({
            text: message,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "D'accord",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    };

    // Fonction pour afficher un message d'erreur
    $scope.showErrorMessage = function(message) {
        Swal.fire({
            text: message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "D'accord",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
        if ($scope.reservationMasterDto.id) {
            $scope.updatereservation();
        } else {
            $scope.createreservation();
        }
    };

    // Fonction pour mettre à jour un utilisateur
    $scope.updatereservation = function() {
        $http.put(urlUpdatereservation, $scope.reservationMasterDto)
            .then(function(response) {
                $scope.loadReservation();
                $('#kt_modal_add_reservation').modal('hide');
                $scope.showSuccessMessage("Utilisateur modifié avec succès");
                $scope.reservationMasterDto = {};
            })
            .catch(function(error) {
                console.error("ERREUR LORS DE LA MODIFICATION : ", error);
                $scope.showErrorMessage("Erreur lors de la modification de l'utilisateur.");
            });
    };

    // Afficher/masquer le modal
    $scope.modalShow = function() {
        $('#myModal').modal('show');
    };
    $scope.modalHide = function() {
        $('#myModal').modal('hide');
    };
}]);


// var KTreservationsList=function(){var e,t,n,r,o=document.getElementById("kt_table_reservations"),c=()=>{o.querySelectorAll('[data-kt-reservations-table-filter="delete_row"]').forEach((t=>{t.addEventListener("click",(function(t){t.preventDefault();const n=t.target.closest("tr"),r=n.querySelectorAll("td")[1].querySelectorAll("a")[1].innerText;Swal.fire({text:"Are you sure you want to delete "+r+"?",icon:"warning",showCancelButton:!0,buttonsStyling:!1,confirmButtonText:"Yes, delete!",cancelButtonText:"No, cancel",customClass:{confirmButton:"btn fw-bold btn-danger",cancelButton:"btn fw-bold btn-active-light-primary"}}).then((function(t){t.value?Swal.fire({text:"You have deleted "+r+"!.",icon:"success",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}}).then((function(){e.row($(n)).remove().draw()})).then((function(){a()})):"cancel"===t.dismiss&&Swal.fire({text:customerName+" was not deleted.",icon:"error",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}})}))}))}))},l=()=>{const c=o.querySelectorAll('[type="checkbox"]');t=document.querySelector('[data-kt-reservation-table-toolbar="base"]'),n=document.querySelector('[data-kt-reservation-table-toolbar="selected"]'),r=document.querySelector('[data-kt-reservation-table-select="selected_count"]');const s=document.querySelector('[data-kt-reservation-table-select="delete_selected"]');c.forEach((e=>{e.addEventListener("click",(function(){setTimeout((function(){a()}),50)}))})),s.addEventListener("click",(function(){Swal.fire({text:"Are you sure you want to delete selected customers?",icon:"warning",showCancelButton:!0,buttonsStyling:!1,confirmButtonText:"Yes, delete!",cancelButtonText:"No, cancel",customClass:{confirmButton:"btn fw-bold btn-danger",cancelButton:"btn fw-bold btn-active-light-primary"}}).then((function(t){t.value?Swal.fire({text:"You have deleted all selected customers!.",icon:"success",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}}).then((function(){c.forEach((t=>{t.checked&&e.row($(t.closest("tbody tr"))).remove().draw()}));o.querySelectorAll('[type="checkbox"]')[0].checked=!1})).then((function(){a(),l()})):"cancel"===t.dismiss&&Swal.fire({text:"Selected customers was not deleted.",icon:"error",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}})}))}))};const a=()=>{const e=o.querySelectorAll('tbody [type="checkbox"]');let c=!1,l=0;e.forEach((e=>{e.checked&&(c=!0,l++)})),c?(r.innerHTML=l,t.classList.add("d-none"),n.classList.remove("d-none")):(t.classList.remove("d-none"),n.classList.add("d-none"))};return{init:function(){o&&(o.querySelectorAll("tbody tr").forEach((e=>{const t=e.querySelectorAll("td"),n=t[3].innerText.toLowerCase();let r=0,o="minutes";n.includes("yesterday")?(r=1,o="days"):n.includes("mins")?(r=parseInt(n.replace(/\D/g,"")),o="minutes"):n.includes("hours")?(r=parseInt(n.replace(/\D/g,"")),o="hours"):n.includes("days")?(r=parseInt(n.replace(/\D/g,"")),o="days"):n.includes("weeks")&&(r=parseInt(n.replace(/\D/g,"")),o="weeks");const c=moment().subtract(r,o).format();t[3].setAttribute("data-order",c);const l=moment(t[5].innerHTML,"DD MMM YYYY, LT").format();t[5].setAttribute("data-order",l)})),(e=$(o).DataTable({info:!1,order:[],pageLength:10,lengthChange:!1,columnDefs:[{orderable:!1,targets:0},{orderable:!1,targets:6}]})).on("draw",(function(){l(),c(),a()})),l(),document.querySelector('[data-kt-reservation-table-filter="search"]').addEventListener("keyup",(function(t){e.search(t.target.value).draw()})),document.querySelector('[data-kt-reservation-table-filter="reset"]').addEventListener("click",(function(){document.querySelector('[data-kt-reservation-table-filter="form"]').querySelectorAll("select").forEach((e=>{$(e).val("").trigger("change")})),e.search("").draw()})),c(),(()=>{const t=document.querySelector('[data-kt-reservation-table-filter="form"]'),n=t.querySelector('[data-kt-reservation-table-filter="filter"]'),r=t.querySelectorAll("select");n.addEventListener("click",(function(){var t="";r.forEach(((e,n)=>{e.value&&""!==e.value&&(0!==n&&(t+=" "),t+=e.value)})),e.search(t).draw()}))})())}}}();KTUtil.onDOMContentLoaded((function(){KTreservationsList.init()}));
