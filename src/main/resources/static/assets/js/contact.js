$(document).ready(function(){
    
    (function($) {
        "use strict";

    
    jQuery.validator.addMethod('answercheck', function (value, element) {
        return this.optional(element) || /^\bcat\b$/.test(value)
    }, "type the correct answer -_-");

    // validate contactForm form
    $(function() {
        $('#contactForm').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                subject: {
                    required: true,
                    minlength: 4
                },
                number: {
                    required: true,
                    minlength: 5
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 20
                }
            },
            messages: {
                name: {
                    required: "Allez, vous avez bien un nom, non ?",
                    minlength: "Votre nom doit comporter au moins 2 caractères."
                },
                subject: {
                    required: "Allez, vous avez bien un sujet, non ?",
                    minlength: "Votre sujet doit comporter au moins 4 caractères."
                },
                number: {
                    required: "Allez, vous avez bien un numéro, non ?",
                    minlength: "Votre numéro doit comporter au moins 5 caractères."
                },
                email: {
                    required: "Pas d'email, pas de message."
                },
                message: {
                    required: "Euh... oui, vous devez écrire quelque chose pour envoyer ce formulaire.",
                    minlength: "C'est tout ? Vraiment ?"
                }
            },
            
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    type:"POST",
                    data: $(form).serialize(),
                    url:"contact_process.php",
                    success: function() {
                        $('#contactForm :input').attr('disabled', 'disabled');
                        $('#contactForm').fadeTo( "slow", 1, function() {
                            $(this).find(':input').attr('disabled', 'disabled');
                            $(this).find('label').css('cursor','default');
                            $('#success').fadeIn()
                            $('.modal').modal('hide');
		                	$('#success').modal('show');
                        })
                    },
                    error: function() {
                        $('#contactForm').fadeTo( "slow", 1, function() {
                            $('#error').fadeIn()
                            $('.modal').modal('hide');
		                	$('#error').modal('show');
                        })
                    }
                })
            }
        })
    })
        
 })(jQuery)
})