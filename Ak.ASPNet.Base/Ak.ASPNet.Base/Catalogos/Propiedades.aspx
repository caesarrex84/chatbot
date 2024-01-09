<%@ Page Title="" Language="C#" MasterPageFile="~/web.Master" AutoEventWireup="true" CodeBehind="Propiedades.aspx.cs" Inherits="Ak.ASPNet.Base.Catalogos.Propiedades" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphHead" runat="server">
    <link href="/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.jqueryui.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.searchHighlight.css" rel="stylesheet" />
    <link href="/vendor/datepicker/bootstrap-datepicker.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="server">
        <div class="row justify-content-center">
        <div class="align-items-center col-md-3 d-sm-flex justify-content-between mb-4 fullControl">
            <a id="btn-new" href="#" class="btn btn-icon-split btn-primary">
                <span class="icon text-white-50">
                    <i class="fa fa-plus-circle fas"></i>
                </span>
                <span class="text">Nueva propiedad</span>
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
                        <li>Utilice el control Nueva propiedad o Seleccione un elemento de la lista
                        </li>
                        <li>Complete la información solicitada en las cajas de texto, asigne permisos de visualización en el sistema y de clic en el botón "Guardar"
                        </li>
                        <li>Si pulsa "Cancelar" la pantalla regresará a un estatus inicial.
                        </li>
                        <li>Para eliminar o modificar los datos de un registro utilice los botones correspondientes en cada elemento de la lista. <i class="fa-pencil-alt fas"></i>o <i class="fa-trash-alt fas"></i>según sea el caso.
                        </li>
                    </ul>
                     <p>
                        <strong>El proceso de crear propiedades consta de 3 pasos</strong>
                    </p>
                      <ul>
                        <li>Paso 1: Crear propiedad con nombre y nombre de Web Site
                        </li>
                        <li>Paso 2: Generar API KEY
                        </li>
                        <li>Paso 3: Asignar usuarios
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
                    Propiedades del sistema
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
                        <h5 class="modal-title" id="sModalLabel">Nueva propiedad</h5>
                        <button onclick="javascript:cancelOwnership()" class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div id="modal-edit" class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div id="user-data" class="card shadow mb-2 hidden-div">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Datos de la propiedad </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtEmail">Nombre propiedad *:</label>
                                                    <input type="text" class="form-control form-control-user" id="txtOwnershipName" aria-describedby="Nombre propiedad" required/>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="ddlRole">Web Site *:</label>
                                                    <input type="text" class="form-control form-control-user" id="txtWebSite" aria-describedby="WebSite" required/>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtTokenAmount">Cantidad de Tokens *:</label>
                                                    <input type="text" class="form-control form-control-user onlynumbers" id="txtTokenAmount" aria-describedby="Cantidad de Tokens" required/>
                                                </div>
                                            </div>
                                            <div  class="col-md-12">
                                                 <div class="form-group">
                                                    <div id="valhtml" class="form-group">
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="apikit-pnl" class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-5">
                                                        <div class="form-group">
                                                            <label class="control-label" for="ddlRole">Fecha de vigencia *:</label>
                                                            <input type="text" class="form-control form-control-user" id="txtValidity" aria-describedby="datepicker"  placeholder="dd/mm/aaaa"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-5" id="seeAPIKIT-pnl" style="display:none">
                                                        <div class="form-group">
                                                            <label class="control-label" for="txtEmail">Api KEY:</label>
                                                            <input type="text" class="form-control form-control-user" id="txtApikit" aria-describedby="Api kit" disabled />
                                                            <input type="hidden" id="txtHiddenId" />
                                                             <input type="hidden" id="txtHiddenIdAK" />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2" style="align-self: end;">
                                                        <p style="text-align: center;">
                                                            <a href="javascript:GenerateAK()" class="btn btn-warning btn-icon-split">
                                                                <span class="icon text-white-50">
                                                                    <i class="far fa-lightbulb"></i>
                                                                </span>
                                                                <span class="text">Generar APIKEY</span>
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="col-md-12" id="assignUsers-pnl" style="display:none">
                                <div id="" class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Asignar usuarios </h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Para asignar los usuarios:</strong></p>
                                        <ul>
                                            <li>De clic en el botón <i class="fa-plus-square fas"></i> y el usuario se verá reflejado en pantalla
                                            </li>
                                            <li>Para eliminar el usuario utilice el botón  <i class="fa-trash-alt fas"></i> .
                                            </li>
                                        </ul>

                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="bg-primary card shadow text-white">
                                                    <div id="users-card" class="card-body">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12 table-responsive" id="pnl-Users">

                                                <div class="form-group">
                                                    <%--<label class="control-label" for="txtSupervisor">Líneas asignadas *:</label>--%>
                                                    <table class="table table-bordered table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Correo Electrónico</th>
                                                                <th>Número de Empleado</th>
                                                                <th>Nombre</th>
                                                                <th>Tipo usuario</th>
                                                                <th>Acción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="tb-Users">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="modal-controls" class="modal-footer">
                        <a href="javascript:cancelOwnership()" class="btn btn-danger btn-icon-split">
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
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" runat="server">
    <script src="/vendor/datepicker/jquery.timepicker.min.js"></script>
    <script src="/vendor/datepicker/bootstrap-datepicker.min.js"></script>
    <script src="/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="/vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <script src="/vendor/datatables/dataTables.jqueryui.min.js"></script>
    <script src="/vendor/datatables/dataTables.searchHighlight.min.js"></script>
    <script src="/vendor/datatables/jquery.highlight.min.js"></script>
    <script src="/vendor/tinymce/tinymce.min.js"></script>
    <script src="/scripts/Catalogos/propiedades.js"></script>
</asp:Content>