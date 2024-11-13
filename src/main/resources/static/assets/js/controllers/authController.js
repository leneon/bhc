"use strict";

var KTSigninGeneral = function () {
    var e, t, i;
    return {
        init: function () {
            e = document.querySelector("#kt_sign_in_form"),
            t = document.querySelector("#kt_sign_in_submit"),
            i = FormValidation.formValidation(e, {
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: "L'identifiant est requise"
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "Le mot de passe est requis"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger,
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                        eleInvalidClass: "",
                        eleValidClass: ""
                    })
                }
            }),

            t.addEventListener("click", function (n) {
                n.preventDefault(),
                i.validate().then(function (validationStatus) {
                    if ("Valid" == validationStatus) {
                        t.setAttribute("data-kt-indicator", "on"),
                        t.disabled = !0;

                        // Gather form data
                        const formData = {
                            username: e.querySelector('[name="email"]').value,
                            password: e.querySelector('[name="password"]').value
                        };

                        // Make API request
                        fetch('auth/signin', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Vos identifiants sont incorrect, veuillez réessayer.");
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Stocker le token après la connexion réussie
                            localStorage.setItem("token", data.accessToken);

                            // Handle successful login
                            Swal.fire({
                                text: "Vous vous êtes connecté avec succès !",
                                icon: "success",
                                buttonsStyling: !1,
                                confirmButtonText: "Ok, compris !",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (t) {
                                if (t.isConfirmed) {
                                    e.querySelector('[name="email"]').value = "",
                                    e.querySelector('[name="password"]').value = "";

                                    // Redirection vers une page protégée
                                    sendAuthenticatedRequest('bhc/dashboard', function(err, response) {
                                        if (err) {
                                            Swal.fire({
                                                text: "Erreur lors de la récupération des données : " + err,
                                                icon: "error",
                                                buttonsStyling: !1,
                                                confirmButtonText: "Ok, compris !",
                                                customClass: {
                                                    confirmButton: "btn btn-primary"
                                                }
                                            });
                                        } else {
                                            // Ici, tu peux traiter la réponse et afficher les données
                                            console.log("Réponse du serveur : ", response);
                                            // Rediriger vers la page souhaitée
                                            window.location.href = "bhc/dashboard"; // ou la page de ton choix
                                        }
                                    });
                                }
                            });
                        })
                        .catch(error => {
                            Swal.fire({
                                text: error,
                                icon: "error",
                                buttonsStyling: !1,
                                confirmButtonText: "Ok, compris !",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        })
                        .finally(() => {
                            t.removeAttribute("data-kt-indicator");
                            t.disabled = !1;
                        });
                    } else {
                        Swal.fire({
                            text: "Désolé, il semble qu'il y ait des erreurs détectées, veuillez réessayer.",
                            icon: "error",
                            buttonsStyling: !1,
                            confirmButtonText: "Ok, compris !",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            });
        }
    };
}();

// Fonction pour envoyer une requête GET avec le token
function sendAuthenticatedRequest(url, callback) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Aucun token trouvé");
        return;
    }

    // Créer la requête
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    // Ajouter l'en-tête Authorization avec le token
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    console.log("=====================> :"+token)
    // Gérer la réponse
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, xhr.responseText);
        } else {
            callback(`Erreur ${xhr.status}: ${xhr.statusText}`);
        }
    };

    xhr.onerror = function () {
        callback("Erreur réseau");
    };

    // Envoyer la requête
    xhr.send();
}


KTUtil.onDOMContentLoaded(function () {
    KTSigninGeneral.init();
});
