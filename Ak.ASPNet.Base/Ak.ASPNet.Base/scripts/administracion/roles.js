var Roles, cR, systemScreens;

function startRoles() {
    if (!setupReady) {
        setTimeout(function (e) { startRoles() }, 300)
    } else {
        if (!fullControl) {
            $('.fullControl').remove();
        }
        getSystemScreens()
    }
}

$('#btn-new').click(function (e) {
    e.preventDefault();
    $('#sModalLabel').html('Creación de nuevo Rol');
    isUpdating = false;
    setScreens();
    $('#sModal').modal()
});

$('#text_search').keyup(function () {
    $('#t_filter input').val($('#text_search').val());
    $('#t_filter input').keyup();
});

$("#sel_status").change(function () {
    startProgress();
    getRoles();
});

function getSystemScreens() {
    $.ajax({
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'UserType/GetSystemScreens',
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                systemScreens = response.data;
                getRoles()
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

function getRoles(id = 0) {
    let fullList = id === 0;
    let getUrl = fullList ?
        apiUrl + 'UserType?status=' + $('#sel_status option:selected').val() :
        apiUrl + 'UserType/' + id;
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
                    Roles = response.data;
                    drawRoles();
                } else {
                    cR = response.data;
                    editS();
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

function drawRoles() {
    tempHTML = '';
    $('#pnl-List').html(tempHTML);

    tempHTML += '<table id="t" class="table table-striped table-bordered">';
    tempHTML += '<thead><tr>' +
        '<th>Nombre del rol</th>' +
        '<th>Número de permisos</th>' +
        '<th>Acciones</th>' +
        '</tr></thead><tbody>';
    for (i = 0; i < Roles.length; i++) {
        var R = Roles[i];
        var tot = R.authorizeMenus.length;

        tempHTML += '<tr>' +
            '<td>' + R.user_Type + '</td>' +
            '<td>' + tot + '</td>' +
            '<td class="text-center">' +
            '<a href="javascript:getRoles(' + R.idUserType + ');" class="btn btn-circle btn-info btn-sm">' +
            (fullControl ? '<i class="fa-pencil-alt fas"></i>' : '<i class="fa-eye fas"></i>') + '</a> ';
        if (fullControl) {
            tempHTML +=
                '<a href="javascript:preSwitchStatus(' + R.idUserType + ');" ' +
                'class="btn btn-circle btn-' + (R.active ? 'danger' : 'success') + ' btn-sm"><i class="fa-' + (R.active ? 'trash-alt' : 'check') + '  fas"></i></a>';
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
    $('#t_filter').hide();
}

function setScreens() {
    tempHTML = '';
    $('#chk-list').html(tempHTML);
    tempHTML += '<table id="tscreens" class="table table-striped table-bordered tableFixHead">';
    tempHTML += '<thead><tr>' +
        //'<th>Menú Padre</th>' +
        '<th>Pantalla</th>' +
        '<th>Permiso de ingreso</th>' +
        '<th>Realiza modificaciones</th>' +
        '</tr></thead><tbody>';
    for (i = 0; i < systemScreens.length; i++) {
        var S = systemScreens[i];
        var id = S.idScreen;
        var access = '';
        var control = '';
        var authorize = '';
        if (cR != undefined) {
            let p = cR.authorizeMenus.find(x => x.idScreen == id);
            if (p != undefined && p !== null) {
                access = 'checked';
                control = p.fullControl ? 'checked' : '';
                authorize = p.Authorize ? 'checked' : '';
            }
        }

        tempHTML += '<tr>' +
            //'<td>' + S.ParentName + '</td>' +
            '<td>' + S.name + '</td>' +
            '<td style="text-align: center;"><label class="switch ">' +
            '<input id="' + S.idScreen + '_access" type="checkbox" class="primary switch-access"' + access + '/>' +
            '<span class="slider round"></span></label></td>' +
            '<td style="text-align: center;"><label class="switch">' +
            '<input id="' + S.idScreen + '_control" type="checkbox" class="primary switch-control" ' + control + '/>' +
            '<span class="slider round"></span></label></td>' +
            '</tr>';
    }
    tempHTML += '</tbody></table>';
    $('#chk-list').html(tempHTML);
    $('.switch-access').click(function () {
        if (!$(this).is(':checked')) {
            var cid = '#' + this.id.replace('_access', '') + '_control';
            if ($(cid).is(':checked')) {
                $(cid).click();
            }
        }
    });
    $('.switch-control').click(function () {
        if ($(this).is(':checked')) {
            var cid = '#' + this.id.replace('_control', '') + '_access';
            if (!$(cid).is(':checked')) {
                $(cid).click();
            }
        }
    });
    $('.switch-authorize').click(function () {
        if ($(this).is(':checked')) {
            var cid = '#' + this.id.replace('_authorize', '') + '_access';
            if (!$(cid).is(':checked')) {
                $(cid).click();
            }
        }
    });
}

function cancelRol() {
    $('#sModal').modal('hide');
    cR = undefined;
    $('#txtRole').val('');
    $('#sModalLabel').val('');
    $('#chk-list').html('');
    isUpdating = false;
}

function isValidSave() {
    if ($('#txtRole').val() != '') {
        if (!isUpdating) {
            cR = {
                user_Type: $('#txtRole').val(),
            };
        } else {
            cR.user_Type = $('#txtRole').val();
        }
        var Screens = [];
        for (i = 0; i < systemScreens.length; i++) {
            var S = systemScreens[i];
            var sa = $('#' + S.idScreen + '_access');
            var sc = $('#' + S.idScreen + '_control');
            var au = $('#' + S.idScreen + '_authorize');
            if (sa.is(':checked')) {
                Screens.push({
                    idScreen: S.idScreen,
                    fullControl: sc.is(':checked'),
                    authorize: au.is(':checked'),
                });
            }
        }
        if (Screens.length > 0) {
            cR.AuthorizeMenus = Screens;
            saveRol();
        } else {
            Notification('Por favor, completa los campos obligatorios:<br /><br />Debe asignar por lo menos un permiso visualización de pantallas.');
        }
    } else {
        Notification('Por favor, completa los campos obligatorios:<br /><br />Todos los campos son requeridos.');
    }
}

function saveRol() {
    startProgress();
    let _Url = !isUpdating ? apiUrl + 'UserType' : apiUrl + 'UserType/' + cR.idUserType;
    let _type = !isUpdating ? 'POST' : 'PUT';

    $.ajax({
        type: _type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: _Url,
        data: JSON.stringify(cR),
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Notification(response.message);
                cancelRol();
                getRoles();
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

function editS() {
    if (cR !== undefined && cR !== null) {
        $('#sModalLabel').html(`Edición del Rol: <b>${cR.user_Type}</b>`);
        $('#txtRole').val(cR.user_Type);
        isUpdating = true;
        setScreens();
        $('#sModal').modal();
        endProgress();
    } else {
        GenericError();
    }
}

function preSwitchStatus(id) {
    if (id != undefined) {
        cR = Roles.find(x => x.idUserType == id);
        if (cR !== undefined && cR !== null) {
            jConfirm(deleteSAlert(cR), 'Confirmar',
                function (r) { if (r) { strConfirmStatus(cR.idUserType) } });
        } else {
            GenericError();
        }
    } else {
        GenericError();
    }
}
const strConfirmStatus = (R) => (`<p>El rol <b> ${R.user_Type}</b> será ${R.active ? 'deshabilitado' : 'reactivado'}</p><p>¿Desea continuar?</p>`)

function switchStatus(id) {
    startProgress();
    $.ajax({
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'UserType/' + id,
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Notification(response.message);
                cancelRol();
                getRoles();
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

startRoles()