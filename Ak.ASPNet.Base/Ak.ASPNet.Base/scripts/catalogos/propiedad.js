let OwnershipList = [], cQuestions = [], cO;

function startOwnership() {
    if (!setupReady) {
        setTimeout(function (e) { startOwnership() }, 300)
    } else {
        endProgress()
        $('#txtGreeting').val('');
        getUserOwnership();
    }
}
$('#text_search').keyup(function () {
    $('#t_filter input').val($('#text_search').val());
    $('#t_filter input').keyup();
});

$('#btn-save').click(function (e) {
    e.preventDefault();
    if (isValidSave()) {
        saveUserOwnership();
    }
});

$("#sel_status").change(function () {
    startProgress();
    getUserOwnership();
});

function getUserOwnership(id = 0) {
    let fullList = id === 0;
    let getUrl = fullList ?
        apiUrl + 'Ownership/GetByUserId?idUser=' + aUsr.idUser :
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
                    OwnershipList = response.data;
                    drawTblUserOwnership();
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
}

function drawTblUserOwnership() {
    tempHTML = '';
    $('#pnl-List').html(tempHTML);
    tempHTML += '<table id="t" class="table table-striped table-bordered">';
    tempHTML += '<thead><tr>' +
        '<th>Nombre</th>' +
        '<th>Website</th>' +
        '<th>Recolecta datos</th>' +
        '<th>Acciones</th>' +
        '</tr></thead><tbody>';
    for (i = 0; i < OwnershipList.length; i++) {
        var O = OwnershipList[i];
        tempHTML += '<tr>' +
            '<td>' + unescape(O.name) + '</td>' +
            '<td>' + O.webSite + '</td>' +
            '<td>' + (O.requestInfo == true ? 'Si' : 'No') + '</td>' +
            '<td class="text-center">' +
            '<a href="javascript:getUserOwnership(' + O.id + ');" class="btn btn-circle btn-info btn-sm">' +
            (fullControl ? '<i class="fa-pencil-alt fas"></i>' : '<i class="fa-eye fas"></i>') + '</a> ';
        /*if (fullControl) {
            tempHTML +=
                '<a href="javascript:preSwitchStatus(' + O.id + ');" ' +
                'class="btn btn-circle btn-' + (O.active ? 'danger' : 'success') + ' btn-sm"><i class="fa-' + (O.active ? 'trash-alt' : 'check') + '  fas"></i></a>';
        }*/
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
$('input:radio[name="chAskDataGroup"]').change(function () {
    if ($(this).val() == 'si') {
        $('#pnl_WhenAskingForData').show();
    } else {
        $('#pnl_WhenAskingForData').hide();
    }
});
function showSingleOwnership() {
    if (cO !== undefined && cO !== null) {
        $('#txtName').val(unescape(cO.name));
        $("#txtWebsite").val(cO.webSite);
        $('#txtGreeting').val(cO.initialMessage);
        if (cO.requestInfo) {
            $('#chkAskUserDataYes').prop('checked', true);
            $('#pnl_WhenAskingForData').show();
            if (cO.requestInfoInAdvance) {
                $('#chkWhenAskGroupInitial').prop('checked', true);

            } else {
                $('#chkWhenAskGroupFinal').prop('checked', true);
            }

        } else {
            $('#chkAskUserDataNo').prop('checked', true);
            $('#pnl_WhenAskingForData').hide();
        }

        cQuestions = cO.aditionalQuestions;
        drawTblQuestion();

        /*$("#renew-div").show();
        if (fullControl) {
            $('#renew-div').show();
        } else {
            $('#renew-div').hide();
        }*/
        $('#sModal').modal();

        startProgressI('modal-edit');
        //setTimeout(function (e) { toggleById('user-towns', 'user-data'); }, 500)
        endProgressI('modal-edit');
        endProgress();
    } else {
        GenericError();
    }
}
function drawTblQuestion() {
    tempHTML = '';
    for (i = 0; i < cQuestions.length; i++) {
        var C = cQuestions[i];
        tempHTML += '<tr>' +
            '<td>' + C + '</td>' +
            '<td class="text-center">' +
            '<a href="javascript:deleteQuestion(\'' + C + '\');" class="btn btn-circle btn-danger btn-sm"><i class="fa-trash-alt fas"></i></a>';
        tempHTML += '</td></tr>';

    }
    $('#tb-question').html(tempHTML);
    $('#txtQuestion').val("");
    endProgressI();
}


function AddQuestion() {
    startProgressI();
    if ($('#txtQuestion').val()) {
        let cQ = cQuestions.filter(x => x == $('#txtQuestion').val());

        if (cQ.length == 0) {
            cQuestions.push($('#txtQuestion').val());
            drawTblQuestion();
            Notification('Se agregó la pregunta a la configuración. No olvide guardar los cambios.');
        } else {
            jError('La pregunta ya agregó previamente, ingrese una pregunta distinta.', 'Completar');
            endProgressI();
        }
    } else {
        jError('Debe seleccionar una línea.', 'Completar');
        endProgressI();
    }
};

function deleteQuestion(q) {
    startProgressI();
    var i = cQuestions.indexOf(q)
    cQuestions.splice(i, 1);
    drawTblQuestion();
    Notification('Se ha eliminado la pregunta. No olvide guardar los cambios.');
}

function saveUserOwnership() {
    startProgress();
    let _Url = !isUpdating ? apiUrl + 'Users' : apiUrl + 'Ownership/Ownerships/' + cO.id;
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
                Notification(response.message);
                cancelUserOwnership();
                getUserOwnership();
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

function isValidSave() {
    var isValid = true;
    var jM = 'Completa los datos: ' + ': <br/><br/>';
    if ($('#txtGreeting').val() === "") { isValid = false; jM += 'Saludo inicial<br/>'; }
    if (isValid) {
        cO.initialMessage = $('#txtGreeting').val();
        cO.aditionalQuestions = cQuestions;
        var rInfo = $('input[name="chAskDataGroup"]:checked').val();
        cO.RequestInfo = rInfo == "si" ? true : false;

        if (rInfo == "si") {
            var rAdvance = $('input[name="chkWhenAskGroup"]:checked').val();
            cO.requestInfoInAdvance = (rAdvance == "initial") ? true : false;
        } else {
            cO.requestInfoInAdvance = false;
        }
        saveUserOwnership();
    }
    else {
        Notification('Por favor, completa los campos obligatorios:<br /><br />' + jM);
    }
}

function cancelUserOwnership() {
    $('#sModalLabel').html('');
    $('#txtName').val('');
    $('#txtWebsite').val('');
    $('#txtGreeting').html('');
    $('#txtQuestion').val('');

    $('input:radio[name="chAskDataGroup"]').prop('checked', false);
    $('input:radio[name="chkWhenAskGroup"]').prop('checked', false);

    cO = undefined;
    cQuestions = [];
    isUpdating = false;
    $('#sModal').modal('hide');
}
startOwnership()