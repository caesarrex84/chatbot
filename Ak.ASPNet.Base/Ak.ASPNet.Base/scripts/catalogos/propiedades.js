var Ownerships, newUsers, users = [];
var cUser, cO, cAK = {};
var isUpdatingAK = false;;

function startOwnerships() {
    if (!setupReady) {
        setTimeout(function (e) { startOwnerships() }, 300)
    } else {
        if (!fullControl) {
            $('.fullControl').remove();
        }
        $('#txtValidity').datepicker('option', { dateFormat: 'dd/mm/yyyy' });
        getOwnerships();
        endProgress()
    }
}

startOwnerships()

$('#btn-new').click(function (e) {
    e.preventDefault();
    $('#sModalLabel').html('Creación de nueva propiedad');
    isUpdating = false;
    isUpdatingAK = false;
    newUsers = [];
    cO = {
        id: 0,
        name: "",
        webSite: "",
        configuration: "",
        creationDate: "",
        initialMessage: "",
        requestInfo: true,
        requestInfoInAdvance: false,
        aditionalQuestions: [],
        active: true
    }
    drawUser()
    $("#apikit-pnl").hide();
    $('#assignUsers-pnl').hide()
    $('#seeAPIKIT-pnl').hide()
    $('#txtValidity').val("")
    $('#txtApikit').val("")
    $('#valhtml').html("")
    $('#sModal').modal();
    $('#txtValidity').attr('required', false)
    $('#valhtml').html(
        '<label class="control-label">Configuración*:</label>' +
        '<textarea id="txtHtml" name="txtHtml"></textarea>');
    tinymce.init({
        selector: 'textarea#txtHtml',
        height: 300,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat',
        content_style: 'body { font-family: NexaLight, HelveticaNeue, Helvetica,Arial,sans-serif; font-size:14px }'
    });
    //    showSingleOwnership();

});

$('#text_search').keyup(function () {
    $('#t_filter input').val($('#text_search').val());
    $('#t_filter input').keyup();
});

$('#btn-save').click(function (e) {
    e.preventDefault();
    if (isValidSave()) {
        saveOwnership();
    }
});

$("#sel_status").change(function () {
    startProgress();
    getOwnerships();
});

function getUsers() {
    startProgress();
    $.ajax({
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'Users?status=0',
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                users = response.data;
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
};

function getOwnerships(id = 0) {
    let fullList = id === 0;
    let getUrl = fullList ?
        apiUrl + 'Ownership?status=' + $('#sel_status option:selected').val() :
        apiUrl + 'Ownership/' + id;
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
                    Ownerships = response.data;
                    drawOwnerships();
                    getUsers();
                } else {
                    cO = response.data;
                    isUpdating = true;
                    showSingleOwnership();
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
};

function drawOwnerships() {
    tempHTML = '';
    $('#pnl-List').html(tempHTML);
    tempHTML += '<table id="t" class="table table-striped table-bordered">';
    tempHTML += '<thead><tr>' +
        '<th>Nombre</th>' +
        '<th>WebSite</th>' +
        '<th>Saludo inicial</th>' +
        '<th>Usuarios Asignados</th>' +
        '<th>Limite de tokens</th>' +
        '<th>Acciones</th>' +
        '</tr></thead><tbody>';
    var hasLine = false;
    for (i = 0; i < Ownerships.length; i++) {
        var U = Ownerships[i];
        tempHTML += '<tr>' +
            '<td>' + unescape(U.name) + '</td>' +
            '<td>' + unescape(U.webSite) + '</td>' +
            '<td>' + U.initialMessage + '</td>' +
            '<td>' + U.asignedUsers + '</td>' +
            '<td>' + U.tokenAmount + '</td>' +
            '<td class="text-center">' +
            '<a href="javascript:getOwnerships(' + U.id + ');" class="btn btn-circle btn-info btn-sm">' +
            (fullControl ? '<i class="fa-pencil-alt fas"></i>' : '<i class="fa-eye fas"></i>') + '</a> ';
        if (fullControl) {
            tempHTML +=
                '<a href="javascript:preSwitchStatus(' + U.id + ');" ' +
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
};

function cancelOwnership() {
    $('#sModalLabel').html('');
    $('#txtOwnershipName').val('');
    $('#txtWebSite').val('');
    $('#valhtml').html('');
    $('#txtValidity').val('');
    $('#txtApikit').val('');
    $('#assignUsers-pnl').hide();
    $('#seeAPIKIT-pnl').hide();
    $('#txtValidity').val("");
    $('#txtApikit').val("");
    $("#txtTokenAmount").val("");
    $('#txtValidity').attr('required', false);
    newUsers = {}
    cO = undefined;
    isUpdating = false;
    $('#sModal').modal('hide');
};

function isValidSave() {
    var r = isValidForm('modal-edit')
    var isValid = r.isValid;
    var pVal = btoa(tinymce.activeEditor.getContent().replace(/<br *\/?>/gi, "\r\n").replace(/"/g, '\\"').replace("<p>", "").replace("</p>", ""))
    if (pVal === '') { isValid = false; r.ErrorMessage += 'Configuración<br/>'; }
    if (isValid) {
        cO = {
            name: escape($('#txtOwnershipName').val()),
            webSite: escape($("#txtWebSite").val()),
            tokenAmount: Number($("#txtTokenAmount").val()),
            configuration: pVal,
            id: cO.id
        }
        saveOwnership();
    }
    else {
        Notification('Por favor, completa los campos obligatorios:<br /><br />' + r.ErrorMessage);
    }
}

function saveOwnership() {
    startProgress();
    let _Url = !isUpdating ? apiUrl + 'Ownership' : apiUrl + 'Ownership/' + cO.id;
    let _type = !isUpdating ? 'POST' : 'PUT';

    $.ajax({
        type: _type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: _Url,
        data: JSON.stringify(cO),
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                if (isUpdating) {
                    getOwnerships();
                    cancelOwnership();
                } else {
                    cO = response.data;
                    Notification(response.message);
                    $("#apikit-pnl").show();
                    $('#assignUsers-pnl').show()
                    getOwnerships(cO.id);
                    isUpdating = true;
                }
              
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

function showSingleOwnership() {
    if (cO !== undefined && cO !== null) {

        $('#txtOwnershipName').val(unescape(cO.name));
        $("#txtWebSite").val(unescape(cO.webSite));
        $('#txtHiddenId').val(cO.id);
        $("#txtTokenAmount").val(cO.tokenAmount);
        var textConf = atob(cO.configuration).replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/\\\"/g, '"');
        $('#valhtml').html(
            '<label class="control-label">Configuración *:</label>' +
            '<textarea id="txtHtml" name="txtHtml">' + textConf + '</textarea>');
        tinymce.init({
            selector: 'textarea#txtHtml',
            height: 300,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat',
            content_style: 'body { font-family: NexaLight, HelveticaNeue, Helvetica,Arial,sans-serif; font-size:14px }'
        });
        getApiKit(cO.id)
        if (cO.userIds != null || cO.userIds != undefined) {
            newUsers = []
            for (i = 0; i < cO.userIds.length; i++) {

            }
            cO.userIds.forEach(element => {
                var user = users.find(x => x.idUser == element);
                newUsers.push(user);
            });
        }
        drawUser()
        $('#assignUsers-pnl').show()
        $('#sModal').modal();
        startProgressI('modal-edit');
        endProgressI('modal-edit');
        endProgress();
    } else {
        GenericError();
    }
}

function preSwitchStatus(id) {
    if (id != undefined) {
        cO = Ownerships.find(X => X.id == id);
        if (cO !== undefined && c0 !== null) {
            jConfirm(strConfirmStatus(cO), 'Confirmar',
                function (r) { if (r) { switchStatus(cO.id) } });
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
        url: apiUrl + 'Ownerships/' + id,
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Notification(response.message);
                cancelOwnership();
                getOwnerships();
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

function addUserList(id) {

    startProgressI();
    if (newUsers === undefined || newUsers === null) {
        newUsers = [];
    }
    var newUser = getObjects(users, 'idUser', id)[0];
    var auxU = getObjects(newUsers, 'idUser', newUser.idUser);
    if (!(auxU.length > 0)) {
        newUsers.push(newUser);
        drawTblUsers();
        Notification('El usuario se agregó correctamente');
        $('#tdc_' + id).html(
            '<span class="hint--top" data-hint="Quitar">' +
            '<a href="javascript:deleteUser(' + id + ');" class="btn btn-circle btn-danger btn-sm"><i class="fa-trash-alt fas"></i></a>' +
            '</span>');

    } else {
        jError('El usuario ya existe en la lista.', 'Completar');
        endProgressI();
    }
    endProgress();
}

function drawTblUsers() {
    tempHTML = '<div class="text-white"></div>';
    if (newUsers.length > 0) {
        tempHTML += (newUsers.length + ' ' + (newUsers.length === 1 ? ' usuario asignado' : ' usuarios asignados'));
        tempHTML += '<div class="mb-2 mt-3 small text-white-50">';
        for (i = 0; i < newUsers.length; i++) {
            var C = newUsers[i];
            tempHTML += unescape(C.idUser) + ' - ' + unescape(C.fullName) + '<br/>';
        }
        tempHTML += '</div>';
    } else {
        tempHTML += ' Sin usuarios asignados';
    }
    $('#users-card').html(tempHTML);
    endProgressI();
}

function drawUser() {
    tempHTML = '';
    $('#pnl-Users').html(tempHTML);
    tempHTML += '<table id="t2" class="table table-striped table-bordered">';
    tempHTML += '<thead><tr>' +
        '<th>Correo Electrónico</th>' +
        '<th>Número de Empleado</th>' +
        '<th>Nombre</th>' +
        '<th>Tipo usuario</th>' +
        '<th>Acciones</th>' +
        '</tr></thead><tbody>';
    for (i = 0; i < users.length; i++) {
        var U = users[i];
        var asigned = getObjects(newUsers, 'idUser', U.idUser).length != 0;
        tempHTML +=
            '<tr>' +
            '<td>' + U.email + '</td>' +
            '<td>' + U.number + '</td>' +
            '<td>' + U.fullName + '</td>' +
            '<td>' + U.userType.user_Type + '</td>' +
            '<td id="tdc_' + U.idUser + '" style="text-align: center;">' +
            '<span class="hint--top" data-hint="' + (!asigned ? 'Agregar' : 'Quitar') + '">' +
            '<a href="javascript:' + (!asigned ? 'addUser' : 'deleteUser') + '(\'' + U.idUser + '\');" ' +
            'class="btn btn-circle btn-' + (asigned ? 'danger' : 'success') + ' btn-sm">' +
            '<i class="fa-' + (asigned ? 'trash-alt' : 'plus-circle') + ' fas"></i></a>' +
            '</span>' +
            '</td>' +
            '</tr>';
    }
    tempHTML += '</tbody></table>';
    $('#pnl-Users').html(tempHTML);
    if (t2 !== undefined) {
        t2.destroy();
    }
    t2 = $('#t2').DataTable({
        "order": [],
        searchHighlight: true,
        "iDisplayLength": 5,
        "aLengthMenu": [[5, 10, 15, 25, 50], [5, 10, 15, 25, 50]],
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
        }
    });
    drawTblUsers();
    endProgressI();
}

function deleteUser(id) {
    startProgressI();
    var cS = getObjects(newUsers, 'idUser', id)[0];
    var i = newUsers.indexOf(cS)
    newUsers.splice(i, 1);
    drawTblUsers();
    Notification('El usuario se ha eliminado de la lista.');

    $('#tdc_' + id).html(
        '<span class="hint--top" data-hint="Agregar">' +
        '<a href="javascript:addUser(' + id + ');" class="btn btn-circle btn-success btn-sm"><i class="fa-plus-circle fas"></i></a>' +
        '</span>');
    endProgress();
}

startOwnerships()

function getApiKit(id = 0) {
    startProgress();
    $.ajax({
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'OwnershipKey?status=0&idProperty=' + id,
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                cAK = response.data[0]
                if (cAK != undefined) {
                    $('#seeAPIKIT-pnl').show()
                    $('#txtValidity').val(formatDateApi(cAK.validity))
                    $('#txtApikit').val(cAK.apI_Key)
                    $('#txtHiddenIdAK').val(cAK.id)
                    isUpdatingAK = true;
                } else {
                    $('#seeAPIKIT-pnl').hide()
                    $('#txtValidity').val("")
                    $('#txtApikit').val("")
                    isUpdatingAK = false;
                }
                $('#apikit-pnl').show()
                $('#txtValidity').attr('required', true)

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

function GenerateAK() {
    startProgress();
    var cWK = {};
    if ($('#txtValidity').val() != "") {
        cWK = {
            id: $('#txtHiddenIdAK').val() != "" ? $('#txtHiddenIdAK').val() : 0,
            ownershipId: $('#txtHiddenId').val() != "" ? $('#txtHiddenId').val() : 0,
            validity: formatDateStringToJS($('#txtValidity').val())
        }
        let _Url = !isUpdatingAK ? apiUrl + 'OwnershipKey' : apiUrl + 'OwnershipKey/' + cWK.id;
        let _type = !isUpdatingAK ? 'POST' : 'PUT';

        $.ajax({
            type: _type,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
            },
            url: _Url,
            data: JSON.stringify(cWK),
            contentType: 'application/json; utf-8',
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if (response.succeded) {
                    Notification(response.message);
                    getOwnerships(cO.id);
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
    } else {
        Notification('Por favor, completa los campos obligatorios:<br /><br />' + 'Fecha de vigencia *');
        endProgress();
    }

}

function removeUser(id) {
    startProgress();
    let _Url = apiUrl + 'Ownership/RemovePropertyFromUser?idUser=' + cO.id + '&idOwnership=' + cO.id;
    let _type = 'PUT';

    $.ajax({
        type: _type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: _Url,
        data: JSON.stringify(cO),
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                deleteUser(id);
                getOwnerships();
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

function addUser(id) {
    startProgress();
    let _Url = apiUrl + 'Ownership/AddPropertyToUser?idUser=' + id + '&idOwnership=' + cO.id;
    let _type = 'PUT';

    $.ajax({
        type: _type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: _Url,
        data: JSON.stringify(cO),
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                addUserList(id);
                getOwnerships();
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