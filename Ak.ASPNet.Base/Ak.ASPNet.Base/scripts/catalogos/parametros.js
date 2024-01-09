var Categories, Parameters, cP, Roles;

function startParameters() {
    if (!setupReady) {
        setTimeout(function (e) { startParameters() }, 300)
    } else {
        if (!fullControl) {
            $('.fullControl').remove();
        }
        getRoles();

    }
}


$('#btn-instr').click(function (e) {
    e.preventDefault();
    $('#pnl-guide').slideToggle();
});

$('#text_search').keyup(function () {
    $('#t_filter input').val($('#text_search').val());
    $('#t_filter input').keyup();
});

$('#btn-cancel').click(function (e) {
    e.preventDefault();
    cancelParameters()
});

$('#btn-save').click(function (e) {
    e.preventDefault();
    if (isValidSave()) {
        saveParameters();
    }
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
                getParameters()


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

function getParameters(id = 0) {
    let fullList = id === 0;
    let getUrl = fullList ?
        apiUrl + 'Parameters' :
        apiUrl + 'Parameters/' + id;
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
                    Parameters = response.data;
                    if (Categories === undefined) {
                        setCategories();
                    }
                    drawParameters();
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

/********************************/
/* Inicia - Select de Categoría */
/********************************/

function setCategories() {
    Categories = Parameters.map(P => P.category).filter(onlyUnique);
    for (i = 0; i < Categories.length; i++) {
        $('#ddlCat').append(opSelSameVal(Categories[i]));
    }
}

$("#ddlCat").change(function () {
    startProgressI('pnl-row');
    drawParameters();
    endProgressI('pnl-row');
});

/********************************/
/*  Fin - Select de Categoría   */
/********************************/

function drawParameters() {
    let cat = $('#ddlCat option:selected').val();

    tempHTML = '';
    $('#pnl-List').html(tempHTML);

    tempHTML += '<table id="t" class="table table-striped table-bordered">';
    tempHTML += '<thead><tr>' +
        '<th>Categoría</th>' +
        '<th>Código</th>' +
        '<th>Función</th>' +
        '<th>Valor</th>' +
        (fullControl ? '<th>Cambiar</th>' : '');
    tempHTML += '</tr></thead><tbody>';
    for (i = 0; i < Parameters.length; i++) {
        var R = Parameters[i];
        if (cat === '' || R.category == cat) {
            var button = '';
            if (R.type === 'bit') {
                var control = R.value == 'true' ? 'checked' : '';
                button =
                    '<label class="switch">' +
                    '<input onchange="toggleParameter(\'' + R.idParameter + '\')" id="' + R.idParameter + '_chk" type="checkbox" class="primary switch-control" ' + control + '>' +
                    '<span class="slider round"></span></label></td>';
            } else {
                button =
                    '<a href="javascript:editS(\'' + R.idParameter + '\');" class="btn btn-circle btn-info btn-sm">' +
                    '<i class="' + (R.type === 'html' ? 'fa-code fas' : 'fa-pencil-alt ') + ' fas"></i></a> ';
            }

            var value = R.value;
            if (R.type === 'day') {
                try {
                    value = daysofweek[R.value];
                } catch (e) {
                    console.log(e);
                    value = 'sin asignar';
                }
            } else if (R.type === 'rol') {
                value = 'sin asignar';
                for (j = 0; j < Roles.length; j++) {
                    if (Roles[j].IdUsertype == R.value) {
                        value = Roles[j].User_Type;
                        break;
                    }
                }
            } else if (R.type === 'html') {
                try {
                    value = atob(value);
                } catch (e) {
                    value = value;
                }
            }
            else if (R.type === 'gpt') {
                try {
                    value = atob(value);
                } catch (e) {
                    value = value;
                }
            }

            tempHTML +=
                '<tr>' +
                '<td>' + R.category + '</td>' +
                '<td>' + R.name + '</td>' +
                '<td>' + R.description + '</td>' +
                '<td id="' + R.idParameter + '_val">' + value + '</td>' +
                (fullControl ? '<td style="text-align: center;">' + button + '</td>' : '') +
                '</tr>';
        }
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

function cancelParameters() {
    cP = undefined;
    $('#txtValue').val('');
    $('#valhtml').html('');
    isUpdating = false;
    $('#sModal').modal('hide');
}

function isValidSave() {
    var isValid = true;
    var pVal = '';
    if (cP.type == 'day') {
        pVal = $('#ddlDay option:selected').val();
        if (pVal === '-1') { isValid = false; }
    } else if (cP.type == 'rol') {
        pVal = $('#ddlRole option:selected').val();
        if (pVal === '0') { isValid = false; }
    } else if (cP.type == 'gpt') {
        pVal = btoa(tinymce.activeEditor.getContent().replace(/<br *\/?>/gi, "\r\n").replace(/"/g, '\\"').replace("<p>", "").replace("</p>", ""))
        if (pVal === '') { isValid = false; }
    }else {
        pVal = cP.type == 'html' ?
            btoa(tinymce.activeEditor.getContent().replace(/(\r\n|\n|\r)/gm, ""))
            : $('#txtValue').val();
        if (pVal === '') { isValid = false; }
        if (cP.type == 'int') {
            if (isNaN($('#txtValue').val())) {
                isValid = false;
            }
        }
    }
    if (isValid) {
        cP.value = pVal;
        saveParameters();
    }
    else {
        jWarning('El valor es obligatorio, si el valor es Numérico no se puede cambiar por texto.', 'Completar/Corregir');
    }
}

function toggleParameter(id) {
    cP = getObjects(Parameters, 'idParameter', id)[0];
    if (cP !== undefined && cP !== null) {
        cP.value = cP.value == 'true' ? 'false' : 'true';
        saveParameters();
    }
}

function saveParameters() {
    startProgress();
    let _Url = apiUrl + 'Parameters/' + cP.idParameter;
    let _type = 'PUT';

    $.ajax({
        type: _type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: _Url,
        data: JSON.stringify(cP),
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.succeded) {
                Notification(response.message);

                startProgressI('pnl-List');

                var value = cP.value;
                if (cP.type === 'day') {
                    try {
                        value = daysofweek[cP.value];
                    } catch (e) {
                        console.log(e);
                        value = 'sin asignar';
                    }
                } else if (cP.type === 'rol') {
                    value = 'sin asignar';
                    for (j = 0; j < Roles.length; j++) {
                        if (Roles[j].IdUserType == cP.value) {
                            value = Roles[j].User_Type;
                            break;
                        }
                    }
                } else if (cP.type === 'html') {
                    try {
                        value = atob(value);
                    } catch (e) {
                        value = value;
                    }
                }
                $('#' + cP.idParameter + '_val').html(value);
                cancelParameters();
                cP = undefined;
                setTimeout(function (e) { endProgressI('pnl-List'); }, 700);
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

function editS(id) {
    cP = getObjects(Parameters, 'idParameter', id)[0];
    if (cP !== undefined && cP !== null) {
        $('#sModalLabel').html('Valor del parámetro <strong>' + cP.name + '</strong>');
        if (cP.type == 'day') {
            $('#editday').show();
            $('#editrol').hide();
            $('#edittext').hide();
            $('#edithtml').hide();
            $('#ddlDay').val(cP.value);
            $('#sModal .modal-dialog').removeClass('modal-lg');
            $('#sModal').modal();
        } else if (cP.type == 'rol') {
            $('#editday').hide();
            $('#editrol').show();
            $('#edittext').hide();
            $('#edithtml').hide();
            $('#ddlRole').val(cP.value);
            $('#sModal .modal-dialog').removeClass('modal-lg');
            $('#sModal').modal();
        }  else if (cP.type == 'gpt') {
            try {
                cP.value = atob(cP.value);
            } catch (e) {
                cP.value = cP.value;
            }
            $('#editday').hide();
            $('#editrol').hide();
            $('#edittext').hide();
            $('#edithtml').show();
            $('#valhtml').html(
                '<label class="control-label">Valor en HTML*:</label>' +
                '<textarea id="txtHtml" name="txtHtml">' + cP.value + '</textarea>');
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

            $('#sModal .modal-dialog').addClass('modal-lg');
            $('#sModal').modal();
        }
        else if (cP.type != 'html') {
            $('#txtValue').val(cP.value);
            $('#editday').hide();
            $('#editrol').hide();
            $('#edittext').show();
            $('#edithtml').hide();
            $('#sModal .modal-dialog').removeClass('modal-lg');
            $('#sModal').modal();
        }
        else {
            try {
                cP.value = atob(cP.value);
            } catch (e) {
                cP.value = cP.value;
            }
            $('#editday').hide();
            $('#editrol').hide();
            $('#edittext').hide();
            $('#edithtml').show();
            $('#valhtml').html(
                '<label class="control-label">Valor en HTML*:</label>' +
                '<textarea id="txtHtml" name="txtHtml">' + cP.value + '</textarea>');
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

            $('#sModal .modal-dialog').addClass('modal-lg');
            $('#sModal').modal();
        }
    } else {
        GenericError();
    }
}

$("#sel_cat").change(function () {
    startProgress();
    getParameters();
});

startParameters()