var Roles, Users, cU;

function startUsuarios() {
    if (!setupReady) {
        setTimeout(function (e) { startUsuarios() }, 300)
    } else {
        if (!fullControl) {
            $('.fullControl').remove();
        }
        getRoles()
    }
}

$('#btn-new').click(function (e) {
    e.preventDefault();
    $('#sModalLabel').html('Creación de nuevo usuario');
    isUpdating = false;
    cU = {
        idUser: 0,
        email: '',
        password: '',
        number: '',
        name: '',
        middleName: '',
        lastName: '',
        fullName: '',
        idUserType: 0,
        userType: {
            idUserType: 0,
            user_Type: '',
            active: false,
            authorizeMenus: [],
            structuredMenus: []
        },
        recoveryMode: false,
        active: false
    };

    showSingleUser();
    $("#renew-div").hide();
});

$('#text_search').keyup(function () {
    $('#t_filter input').val($('#text_search').val());
    $('#t_filter input').keyup();
});

$('#btn-save').click(function (e) {
    e.preventDefault();
    if (isValidSave()) {
        saveUser();
    }
});

$("#sel_status").change(function () {
    startProgress();
    getUsers();
});

function getRoles() {
    startProgress();
    $.ajax({
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'UserType',
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Roles = response.data;
                $('#ddlRole').append($("<option></option>").attr("value", 0).text("Selecciona Rol"));
                $.each(Roles, function (key, R) {
                    $('#ddlRole').append($("<option></option>").attr("value", R.idUserType).text(unescape(R.user_Type)));
                });
                getUsers();
            } else {
                LastError(response);
                endProgress();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            GenericError();
            endProgress();
        }
    });
}

function getUsers(id = 0) {
    let fullList = id === 0;
    let getUrl = fullList ?
        apiUrl + 'Users?status=' + $('#sel_status option:selected').val() :
        apiUrl + 'Users/' + id;
    startProgress();

    $.ajax({
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: getUrl,
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                if (fullList) {
                    Users = response.data;
                    drawUsers();
                } else {
                    cU = response.data;
                    isUpdating = true;
                    showSingleUser();
                }
            } else {
                LastError(response);
                endProgress();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            GenericError();
            endProgress();
        }
    });
}

function drawUsers() {
    tempHTML = '';
    $('#pnl-List').html(tempHTML);
    tempHTML += '<table id="t" class="table table-striped table-bordered">';
    tempHTML += '<thead><tr>' +
        '<th>Nombre</th>' +
        '<th>Correo</th>' +
        '<th>Número Empleado</th>' +
        '<th>Tipo usuario</th>' +
        '<th>Acciones</th>' +
        '</tr></thead><tbody>';
    var hasLine = false;
    for (i = 0; i < Users.length; i++) {
        var U = Users[i];
        tempHTML += '<tr>' +
            '<td>' + U.fullName + '</td>' +
            '<td>' + U.email + '</td>' +
            '<td>' + U.number + '</td>' +
            '<td>' + U.userType.user_Type + '</td>' +
            '<td class="text-center">' +
            '<a href="javascript:getUsers(' + U.idUser + ');" class="btn btn-circle btn-info btn-sm">' +
            (fullControl ? '<i class="fa-pencil-alt fas"></i>' : '<i class="fa-eye fas"></i>') + '</a> ';
        if (fullControl) {
            tempHTML +=
                '<a href="javascript:preSwitchStatus(' + U.idUser + ');" ' +
                'class="btn btn-circle btn-' + (U.active ? 'danger' : 'success') + ' btn-sm"><i class="fa-' + (U.active ? 'trash-alt' : 'check') + '  fas"></i></a>';
        }
        tempHTML += '</td></tr>';
    }
    tempHTML += '</tbody></table>';

    $('#pnl-List').html(tempHTML);
    if (t !== undefined) {
        t.destroy();
    }
    t = $('#t').DataTable({
        "order": [],
        searchHighlight: true,
        "iDisplayLength": qdl,
        "aLengthMenu": [qlm, qlm],
        "language": {
            "decimal": "",
            "emptyTable": "No hay registros para los filtros ingresados",
            "info": "Mostrando _START_ de _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrados de _MAX_ registros totales)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrando _MENU_ registros a la vez",
            "loadingRecords": "Cargando...",
            "processing": "Procesando ...",
            "search": "Buscar:",
            "zeroRecords": "No se encontraron registros",
            "paginate": {
                "first": "Inicio",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
        },
        "initComplete": function (settings, json) {
            endProgress();
        }
    });
    $('#t_filter label').hide();
}

function cancelUser() {
    $('#sModalLabel').html('');
    $('#txtEmail').val('');
    $("#ddlRole").val('0');
    $('#txtNumber').val('');
    $('#txtName').val('');
    $('#txtMiddleName').val('');
    $('#txtLastName').val('');
    $('#txtArea').val('');
    $('#txtTowns').val('');

    cU = undefined;
    isUpdating = false;
    $('#sModal').modal('hide');
}

function isValidSave() {
    var isValid = true;
    var jM = 'Completa los datos: ' + ': <br/><br/>';

    if ($('#txtEmail').val() === "") { isValid = false; jM += 'Correo<br/>'; }
    else { if (emailRegex.test($('#txtEmail').val()) === false) { isValid = false; jM += 'El correo es incorrecto <br/>'; } }
    var IdUT = Number($("#ddlRole option:selected").val(), 10);
    if (IdUT == -1) {
        isValid = false; jM += 'Seleccione Tipo de Usuario<br/>';
    }
    if ($('#txtName').val() === "") { isValid = false; jM += 'Nombre<br/>'; }
    if ($('#txtMiddleName').val() === "") { isValid = false; jM += 'Apellido paterno<br/>'; }
    if ($('#txtLastName').val() === "") { isValid = false; jM += 'Apellido materno<br/>'; }

    if (isValid) {
        cU.name = $('#txtName').val();
        cU.middleName = $('#txtMiddleName').val();
        cU.lastName = $('#txtLastName').val();
        cU.number = $('#txtNumber').val();
        cU.email = $('#txtEmail').val();
        cU.idUserType = Number($("#ddlRole option:selected").val(), 10);
        cU.userType.idUserType = Number($("#ddlRole option:selected").val(), 10);
        cU.userType.user_Type = $("#ddlRole option:selected").text();
        saveUser();
    }
    else {
        Notification('Por favor, completa los campos obligatorios:<br /><br />' + jM);
    }
}

function saveUser() {
    startProgress();
    let _Url = !isUpdating ? apiUrl + 'Users' : apiUrl + 'Users/' + cU.idUser;
    let _type = !isUpdating ? 'POST' : 'PUT';

    $.ajax({
        type: _type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: _Url,
        data: JSON.stringify(cU),
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Notification(response.message);
                cancelUser();
                getUsers();
            } else {
                LastError(response);
                endProgress();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            GenericError();
            endProgress();
        }
    });
}

function showSingleUser() {
    if (cU !== undefined && cU !== null) {
        $('#txtEmail').val(cU.email);
        $("#ddlRole").val(cU.idUserType);
        $('#txtNumber').val(cU.number);
        $('#txtName').val(cU.name);
        $('#txtMiddleName').val(cU.middleName);
        $('#txtLastName').val(cU.lastName);
        $("#renew-div").show();
        if (fullControl) {
            $('#renew-div').show();
        } else {
            $('#renew-div').hide();
        }
        $('#sModal').modal();

        startProgressI('modal-edit');
        setTimeout(function (e) { toggleById('user-towns', 'user-data'); }, 500)
        endProgressI('modal-edit');
        endProgress();
    } else {
        GenericError();
    }
}

function preSwitchStatus(id) {
    if (id != undefined) {
        cU = Users.find(X => X.idUser == id);
        if (cU !== undefined && cU !== null) {
            jConfirm(strConfirmStatus(cU), 'Confirmar',
                function (r) { if (r) { switchStatus(cU.idUser) } });
        } else {
            GenericError();
        }
    } else {
        GenericError();
    }
}
const strConfirmStatus = (R) => (`<p>El usuario <b> ${R.fullName}</b> será ${R.active ? 'deshabilitado y no podrá ingresar al sistema' : 'reactivado y podrá ingresar nuevamente al sistema'}</p><p>¿Desea continuar?</p>`)

function switchStatus(id) {
    startProgress();
    $.ajax({
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'Users/' + id,
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Notification(response.message);
                cancelUser();
                getUsers();
            } else {
                LastError(response);
                endProgress();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            GenericError();
            endProgress();
        }
    });
}

function reSendPass() {
    jConfirm(strSendPass(cU), 'Confirmar', function (r) { if (r) { sendPass() } });
}
const strSendPass = (R) => (`<p>El usuario <b> ${R.fullName}</b> recibirá una contraseña temporal que le permitirá el ingreso al sistema en su correo <b>${cU.email}</b></p><p>¿Desea continuar?</p>`)

function sendPass() {
    startProgress();
    $.ajax({
        type: 'PUT',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'Users/PasswordRecovery/' + cU.email,
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Notification(response.message);
                endProgress();
            } else {
                LastError(response);
                endProgress();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            GenericError();
            endProgress();
        }
    });
}

startUsuarios()
