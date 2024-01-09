let Ownerships; let cO = null;
let Chats; 

let iUser = '<span><i class="fa-solid fa-chalkboard-user"></i></span>';
let iRobot = '<span><i class="fa-solid fa-robot"></i></span>';

function startChats() {
    if (!setupReady) {
        setTimeout(function (e) { startChats() }, 300)
    } else {
        var t = new Date();
        var t1 = new Date(t.getFullYear(), t.getMonth(), 1);
        var t2 = new Date(t.getFullYear(), t.getMonth() + 1, 0);
        $('#txtDateStart').val(pad(t1.getDate(), 2) + '/' + pad(t1.getMonth() + 1, 2) + '/' + t1.getFullYear());
        $('#txtDateEnd').val(pad(t2.getDate(), 2) + '/' + pad(t2.getMonth() + 1, 2) + '/' + t2.getFullYear());
        $('#txtDateStart, #txtDateEnd').datepicker();
        getMyOwnerships();
    }
}

$("#ddlOwnership").change(function () {
    startProgress();
    let id = Number($("#ddlOwnership option:selected").val(), 10);
    cO = Ownerships.find(x => x.id == id);
    getChats();
});

function getMyOwnerships() {
    $.ajax({
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        },
        url: apiUrl + 'Ownership/GetByUserId?idUser=' + aUsr.idUser,
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            if (response.succeded) {
                Ownerships = response.data;

                switch (Ownerships.length) {
                    case 0:
                        jWarning('No se encontró ninguna Propiedad configurada en el sistema o no tiene suficientes permisos de visualización.', 'Falta configuración');
                        endProgress();
                        break;
                    case 1:
                        //Sólo hay una plaza asignada
                        cO = Ownerships[0];
                        $('#ddlOwnership').append($("<option></option>").attr("value", cO.id).text(cO.name));
                        $('#ddlOwnership').attr('disabled', 'disabled');
                        getChats();
                        break;
                    default:
                        //Puede elegir entre varias plazas
                        $('#ddlOwnership').append($("<option></option>").attr("value", 0).text("Selecciona Propiedad"));
                        $.each(Ownerships, function (key, R) {
                            $('#ddlOwnership').append($("<option></option>").attr("value", R.id).text(unescape(R.name)));
                        });
                        Notification('Puede administrar más de una Propiedad.<br/><br/>Seleccione una propiedad para iniciar.');
                        endProgress();
                        break;
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

function getChats() {
    if (cO !== null && cO !== undefined) {
        startProgress();
        let wsURL = `${apiUrl}ChatSumary?idPropiedad=${cO.id}&FechaInicial=${transformDate('txtDateStart')}&FechaFinal=${transformDate('txtDateEnd')}`;
        
        $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
            },
            url: wsURL,
            contentType: 'application/json; utf-8',
            dataType: 'json',
            success: function (response) {
                Chats = response.data;
                drawChats();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                GenericError();
                endProgress();
            }
        });
    } else {
        Notification('Seleccione una Propiedad para poder realizar la busqueda de chats');
        endProgress();
    }
}

function drawChats() {
    tempHTML = '';
    $('#pnl-List').html(tempHTML);
    tempHTML += '<table id="t" class="table table-striped table-bordered">';
    tempHTML += '<thead><tr>' +
        '<th>Fecha del chat</th>' +
        '<th>Dejó Datos</th>' +
        '<th>Número de preguntas</th>' +
        '<th>Detalle</th>' +
        '</tr></thead><tbody>';
    var hasLine = false;
    for (i = 0; i < Chats.length; i++) {
        var R = Chats[i];
        tempHTML += `
            <tr>
                <td>${R.chatDate.substring(0, 19).replace('T', ' ') }</td>
                <td>${(R.aditionalData.length > 0 ? 'Sí' : 'No')}</td>
                <td>${R.conversation.length}</td>
                <td class="text-center">
                    <a href="javascript:showChatDetail(${R.id});" class="btn btn-circle btn-info btn-sm">
                        <i class="fa-eye fas"></i>
                    </a>
                </td>
            </tr>`;
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

function showChatDetail(id) {
    for (i = 0; i < Chats.length; i++) {
        var cC = Chats[i];
        if (cC.id == id) {
            $('#aditionalData').html('');
            $.each(cC.aditionalData, function (key, R) {
                $('#aditionalData').append(`${R.label}</br><b>${R.data}</b></br>`);
            });

            $('#conversation').html('');
            $.each(cC.conversation, function (key, R) {
                $('#conversation').append(`${iUser} : ${R.label}</br>${iRobot} : ${R.data}</br>`);
            });
        }
    }    
    $('#dModal').modal();
}

function closeDetail() {
    $('#dModal').modal('hide');
}

function transformDate(id) {
    let T = $('#' + id).val();
    return `${T.substring(6, 10) }-${T.substring(3, 5) }-${T.substring(0, 2) }`;
}

startChats()