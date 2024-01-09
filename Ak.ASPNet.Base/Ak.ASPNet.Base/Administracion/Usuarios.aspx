<%@ Page Title="" Language="C#" MasterPageFile="~/web.Master" AutoEventWireup="true" CodeBehind="Usuarios.aspx.cs" Inherits="Ak.ASPNet.Base.Administracion.Usuarios" %>

<asp:Content ID="Content4" ContentPlaceHolderID="cphHead" runat="server">
    <link href="/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.jqueryui.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.searchHighlight.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="cphBody" runat="server">
    <div class="row justify-content-center">
        <div class="align-items-center col-md-3 d-sm-flex justify-content-between mb-4 fullControl">
            <a id="btn-new" href="#" class="btn btn-icon-split btn-primary">
                <span class="icon text-white-50">
                    <i class="fa fa-plus-circle fas"></i>
                </span>
                <span class="text">Nuevo usuario</span>
            </a>
        </div>
        <div class="align-items-center col-md-3 d-sm-flex justify-content-between mb-4">
            <a href="javascript:toggleInfoPanel()" class="btn btn-icon-split btn-info">
                <span class="icon text-white-50">
                    <i class="fas fa-info"></i>
                </span>
                <span class="text">Información</span>
            </a>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12" id="pnl-guide" style="display: none;">
            <div class="card mb-4">
                <div class="card-header">
                    Instrucciones
                </div>
                <div class="card-body">
                    <p><strong>Para agregar o editar un registro:</strong></p>
                    <ul>
                        <li>Utilice el control Nuevo Usuario o Seleccione un elemento de la lista
                        </li>
                        <li>Complete la información solicitada en las cajas de texto, asigne permisos de visualización en el sistema y de clic en el botón "Guardar"
                        </li>
                        <li>Para asignar una o más poblaciones al usuario, utilice el ícomo <i class="fa-pencil-alt fas"></i>junto al elemento "Poblaciones asignadas"
                        </li>
                        <li>Si un usuario no tienen ninguna población asignada, podrá visualizar todas las poblaciones.
                        </li>
                        <li>Si pulsa "Cancelar" la pantalla regresará a un estatus inicial.
                        </li>
                        <li>Para eliminar o modificar los datos de un registro utilice los botones correspondientes en cada elemento de la lista. <i class="fa-pencil-alt fas"></i>o <i class="fa-trash-alt fas"></i>según sea el caso.
                        </li>
                    </ul>
                    <p>
                        <strong>Si no puede ver todos los controles es probable que no tenga los permisos necesarios</strong>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-lg-12">
            <div class="card mb-4">
                <div class="card-header">
                    Usuarios del sistema
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="control-label" for="sel_status">Estatus:</label>
                                <select id="sel_status" name="sel_status" class="form-control">
                                    <option value="0">Habilitados</option>
                                    <option value="1">Deshabilitados</option>
                                    <option value="2">Todos</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4 offset-md-4">
                            <div class="form-group">
                                <label class="control-label" for="text_search">Búsqueda por palabra:</label>
                                <input id="text_search" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-12 table-responsive" id="pnl-List">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fade modal" id="sModal" tabindex="-1" role="dialog" aria-labelledby="sModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="sModalLabel">Nuevo Usuario</h5>
                        <button onclick="javascript:cancelUser()" class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div id="modal-edit" class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div id="user-data" class="card shadow mb-2 hidden-div">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Datos del usuario </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtEmail">Correo electrónico *:</label>
                                                    <input type="text" class="form-control form-control-user" id="txtEmail" aria-describedby="Correo electrónico" autocomplete="new-password" />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="ddlRole">Tipo de usuario *:</label>
                                                    <select id="ddlRole" name="ddlRole" class="form-control">
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtNumber">Número de empleado:</label>
                                                    <input type="text" class="form-control form-control-user" id="txtNumber" aria-describedby="Número de empleado" autocomplete="new-password" />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtName">Nombre *:</label>
                                                    <input type="text" class="form-control form-control-user upCase" id="txtName" aria-describedby="Nombre" autocomplete="new-password" />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtMiddleName">Apellido paterno *:</label>
                                                    <input type="text" class="form-control form-control-user upCase" id="txtMiddleName" aria-describedby="Apellido paterno" autocomplete="new-password" />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtLastName">Apellido materno *:</label>
                                                    <input type="text" class="form-control form-control-user upCase" id="txtLastName" aria-describedby="Apellido materno" autocomplete="new-password" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div id="renew-div" class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Renovar contraseña </h6>
                                    </div>
                                    <div class="card-body">
                                        <p>
                                            Utilice esta opción <b>si un usuario ha perdido o no recuerda su contraseña</b>, el sistema enviará una contraseña temporal al correo registrado y el usuario tendrá que definir una nueva contraseña la siguiente vez que ingrese. 
                                        </p>
                                        <p style="text-align: center;">
                                            <a href="javascript:reSendPass()" class="btn btn-warning btn-icon-split">
                                                <span class="icon text-white-50">
                                                    <i class="fas fa-exclamation-triangle"></i>
                                                </span>
                                                <span class="text">Enviar nueva contraseña</span>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="modal-controls" class="modal-footer">
                        <a href="javascript:cancelUser()" class="btn btn-danger btn-icon-split">
                            <span class="icon text-white-50">
                                <i class="fa fa-times"></i>
                            </span>
                            <span id="btn-cancel-text" class="text">Cancelar</span>
                        </a>
                        <a id="btn-save" href="#" class="btn btn-success btn-icon-split">
                            <span class="icon text-white-50">
                                <i class="fas fa-check"></i>
                            </span>
                            <span class="text">Guardar</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="cphFooter" runat="server">
    <script src="/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="/vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <script src="/vendor/datatables/dataTables.jqueryui.min.js"></script>
    <script src="/vendor/datatables/dataTables.searchHighlight.min.js"></script>
    <script src="/vendor/datatables/jquery.highlight.min.js"></script>
    <script src="/scripts/administracion/usuarios.js"></script>
</asp:Content>
