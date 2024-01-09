<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="Ak.ASPNet.Base.login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Iniciar Sesión</title>
    <link href="css/aktien.css" rel="stylesheet" />
    <link href="css/aktien.alert.css" rel="stylesheet" />
    <link href="css/aktien.base.css" rel="stylesheet" />
    <link href="css/sb-admin-2.css" rel="stylesheet" />
    <script src='https://www.google.com/recaptcha/api.js'></script>
</head>
<script>
    let tokenized = false;
    let setupReady = false;
    let fullControl = false;
    let aUsr;
</script>
<body class="bg-primary">
    <div class="container">
        <!-- Outer Row -->
        <div class="row justify-content-center">
            <div class="col-xl-10 col-lg-12 col-md-9">
                <div class="card o-hidden border-0 shadow-lg my-5 cardlogg">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row" id="pnl-login">
                            <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                            <div class="col-lg-6">
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text_ttlflekk mb-4 txt_bldblumarine">ChatBot</h1>
                                        <p class="mb-4">
                                            Pantalla de ingreso al
                                                            <br />
                                            <strong>Sistema de Administración de chatBot</strong>
                                            <br />
                                            <br />
                                            Aktien TI + ChatGPT
                                        </p>
                                    </div>
                                    <form class="user">
                                        <div class="form-group">
                                            <input id="txtUser" name="txtUser" type="text" class="form-control form-control-user" placeholder="Usuario" />
                                        </div>
                                        <div class="form-group">
                                            <input type="password" id="txtPassword" name="txtPassword" class="form-control form-control-user" placeholder="Contraseña" />
                                        </div>
                                        <div class="form-group">
                                            <div id="divCaptcha" class="form-group col">
                                                <div class="g-recaptcha" data-sitekey="6Le5ThYUAAAAAIyAuHlYf_NJyJRqixgM4EIEgjAq" data-callback="enablelgn" data-expired-callback="disabledlgn"></div>
                                            </div>
                                            <div id="divlogin" class="form-group">
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="text-center">
                                            <a id="btn-forgot" href="#" class="small">Olvidé mi contraseña</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div class="hidden-div" id="pnl-retrieve">
                            <div class="row">
                                <div class="col-lg-6 d-none d-lg-block bg-password-image"></div>
                                <div class="col-lg-6">
                                    <form class="p-5 user">
                                        <div id="dv-panel" class="text-center">
                                            <h1 class="h4 text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
                                            <p class="mb-4">
                                                Lo entendemos, algunas veces pasa.<br />
                                                <br />
                                                Simplemente ingresa tu dirección de correo electrónico y te enviaremos una contraseña temporal para ingresar.
                                                            <br />
                                                <br />
                                                Tendrás que definir una nueva contraseña por tu seguridad si completas el proceso. Si recuerdas tu contraseña la podrás seguir utilizando.
                                            </p>
                                        </div>
                                        <div class="form-group">
                                            <input type="text" id="txtEmail" class="form-control form-control-user" placeholder="Correo electrónico" />
                                        </div>
                                        <div id="divRetrieve" class="form-group">
                                            Pulsa "Ya tengo mi contraseña" y verifica la casilla de reCAPTCHA
                                        </div>
                                        <hr/>
                                        <div class="text-center">
                                            <a id="btn-return" class="small" href="#">Ya tengo mi contraseña</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="UpProgressMain">
        <div id="Cont_Loading">
            <img id="img_loading" src="images/loading.gif" alt="Loading..." />
        </div>
    </div>
    <script src="scripts/jquery-3.3.1.min.js"></script>
    <script src="scripts/bootstrap.min.js"></script>
    <script src="scripts/jquery.easing.min.js"></script>
    <script src="scripts/aktien.api.js"></script>
    <script src="scripts/aktien.alert.js"></script>
    <script src="scripts/aktien.sys.js"></script>
    <script src="scripts/sys/login.js"></script>
    <script>
        document.getElementById("UpProgressMain").style.display = "block";
        document.getElementById("UpProgressMain").style.visibility = "visible";
    </script>
</body>
</html>
