var laf = 0, elgn = false, laflim = 2;
let ur = 0;
let hasDestination = false;
let origin = 0;

function startLogin() {
    if (tokenized) {
        setTimeout(function (e) { startLogin() }, 500);
    } else {
        endProgress();
    }
}

$('#btn-forgot').click(function (e) {
    e.preventDefault();
    if (elgn) {
        $('#btn-retrieve').html('Recuperar contraseña');
        toggleById('pnl-login', 'pnl-retrieve');
    } else {
        jWarning('Por favor, pulsa la casilla de verificación "No soy un robot" para continuar.', 'reCAPTCHA');
    }
});

$('#btn-return').click(function (e) {
    e.preventDefault();
    toggleById('pnl-retrieve', 'pnl-login');
});

$('#txtUser').keypress(function (e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        $('#txtPassword').focus();
    }
});

$('#txtPassword').keypress(function (e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        loginAttempt();
    }
});

$(document).on('keypress', function (e) {
    if (e.which == 13) {
        loginAttempt()
    }
});

function enablelgn() {
    var v = grecaptcha.getResponse();
    if (v.length == 0) {
        disabledlgn();
    }
    if (v.length != 0) {
        hideById('divCaptcha');
        $('#divlogin').html('<a href="javascript:loginAttempt()" class="btn btn-primary btn-user btn-block">Ingresar </a>');
        $('#divRetrieve').html('<a href="javascript:retrieveAttempt()" class="btn btn-danger btn-user btn-block">Recuperar contraseña</a>');
        elgn = true;
    }
}

function disabledlgn() {
    showById('divCaptcha');
    $('#divlogin').html('');
    $('#divRetrieve').html('Pulsa "Ya tengo mi contraseña" y verifica la casilla de reCAPTCHA');
    elgn = false;
}

function loginAttempt() {
    if (elgn) {
        if ($('#txtUser').val() !== "" && $('#txtPassword').val() !== "") {
            AutenticateUser();
        } else {
            jWarning('Ingresar usuario y contraseña, si no lo recuerdas utiliza la opción "Olvidé mi contraseña".<br/><br/>Si aún no tienes asignado contacta al administrador.', 'Advertencia', '');
        }
    } else {
        jWarning('Verifica la casilla de selección para continuar.', 'Advertencia', '');
    }
}

function AutenticateUser() {
    startProgress();
    var sReq = {
        email: $('#txtUser').val(),
        password: $('#txtPassword').val()
    };
    $.ajax({
        type: 'POST',
        url: apiUrl + 'Users/Authentication',
        data: JSON.stringify(sReq),
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (response) {
            if (response.succeded) {
                localStorage.setItem('ak-api-token', response.jwToken);
                localStorage.setItem('ak-api-user', JSON.stringify(response.data));
                window.location.replace('inicio');
            } else {
                LastError(response);
                return false;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            GenericError(jqXHR);
            return false;
        }
    });
}

function retrieveAttempt() {
    if (elgn) {
        if ($('#txtEmail').val() !== "") {
            RetrievePassword()
        } else {
            jWarning('Ingresa tu correo para enviar una contraseña temporal.', 'Advertencia', '');
        }
    } else {
        jWarning('Verifica la casilla de selección para continuar.', 'Advertencia', '');
    }
}

function RetrievePassword() {
    startProgress();
    var sReq = {
        Application: baseRequest.Application,
        QueryStringCode: baseRequest.QueryStringCode,
        requestIP: baseRequest.requestIP,
        MacAdress: baseRequest.MacAdress,
        User: {
            Email: $('#txtEmail').val(),
            UserSection: $("#recSupplier").is(":checked") ? 2 : 0,
        },
    };
    var complexObject = JSON.stringify(sReq);
    $.ajax({
        type: 'POST',
        url: 'ws.asmx/RetrievePassword',
        data: "{'request': '" + complexObject + "' }",
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (data) {
            var response = jQuery.parseJSON(data.d);
            if (response.Success) {
                jAlert('Se ha enviado una contraseña temporal para ingresar a la plataforma.', 'Éxito');
                endProgress();
            } else {
                LastError(response);
                return false;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            GenericError(jqXHR);
            return false;
        }
    });
}

function setlaf(nval) {
    if (nval == undefined) {
        nval = 0;
    }
    laf = nval;
    createCookie('laf', laf, 1);
}

function getlaf() {
    var tl = readCookie('laf');
    if (tl === null) {
        laf = 0;
    } else {
        laf = Number(tl, 10);
    }
    return laf;
}

function DisableUserAccess() {
    startProgress();
    var sReq = {
        Application: baseRequest.Application,
        QueryStringCode: baseRequest.QueryStringCode,
        requestIP: baseRequest.requestIP,
        MacAdress: baseRequest.MacAdress,
        User: {
            Email: $('#txtUser').val(),
            UserSection: 0,
        },
    };
    var complexObject = JSON.stringify(sReq);
    $.ajax({
        type: 'POST',
        url: 'ws.asmx/DisableUserAccess',
        data: "{'request': '" + complexObject + "' }",
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (data) {
            return false;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            GenericError(jqXHR);
            return false;
        }
    });
}

$(document).ready(function () {
    startLogin()
});
