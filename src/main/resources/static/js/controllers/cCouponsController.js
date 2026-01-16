// Contrôleur JS pour la gestion des coupons
$(document).ready(function() {
    loadCoupons();

    function loadCoupons() {
        $.get('/api/coupons', function(data) {
            let tbody = '';
            data.forEach(function(coupon) {
                tbody += `<tr>
                    <td>${coupon.code}</td>
                    <td>${coupon.description}</td>
                    <td>${coupon.typeReduction}</td>
                    <td>${coupon.montant}</td>
                    <td>${coupon.dateDebut}</td>
                    <td>${coupon.dateFin}</td>
                    <td>${coupon.actif ? 'Oui' : 'Non'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-coupon" data-id="${coupon.id}">Modifier</button>
                        <button class="btn btn-sm btn-danger delete-coupon" data-id="${coupon.id}">Supprimer</button>
                    </td>
                </tr>`;
            });
            $('#couponsTable tbody').html(tbody);
        });
    }

    // Ajout d'un coupon
    $('#addCouponForm').submit(function(e) {
        e.preventDefault();
        let formData = $(this).serializeJSON();
        $.ajax({
            url: '/api/coupons',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function() {
                $('#addCouponModal').modal('hide');
                loadCoupons();
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    });

    // Suppression d'un coupon
    $(document).on('click', '.delete-coupon', function() {
        if(confirm('Supprimer ce coupon ?')) {
            let id = $(this).data('id');
            $.ajax({
                url: '/api/coupons/' + id,
                type: 'DELETE',
                success: function() {
                    loadCoupons();
                }
            });
        }
    });

    // Pré-remplir le formulaire de modification
    $(document).on('click', '.edit-coupon', function() {
        let id = $(this).data('id');
        $.get('/api/coupons/' + id, function(coupon) {
            $('#editCouponForm [name=id]').val(coupon.id);
            $('#editCouponForm [name=code]').val(coupon.code);
            $('#editCouponForm [name=description]').val(coupon.description);
            $('#editCouponForm [name=typeReduction]').val(coupon.typeReduction);
            $('#editCouponForm [name=montant]').val(coupon.montant);
            $('#editCouponForm [name=dateDebut]').val(coupon.dateDebut);
            $('#editCouponForm [name=dateFin]').val(coupon.dateFin);
            $('#editCouponForm [name=actif]').prop('checked', coupon.actif);
            $('#editCouponModal').modal('show');
        });
    });

    // Modification d'un coupon
    $('#editCouponForm').submit(function(e) {
        e.preventDefault();
        let id = $('#editCouponForm [name=id]').val();
        let formData = $(this).serializeJSON();
        $.ajax({
            url: '/api/coupons/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function() {
                $('#editCouponModal').modal('hide');
                loadCoupons();
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    });
});
