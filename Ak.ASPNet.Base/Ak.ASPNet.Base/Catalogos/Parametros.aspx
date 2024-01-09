<%@ Page Title="" Language="C#" MasterPageFile="~/web.Master" AutoEventWireup="true" CodeBehind="Parametros.aspx.cs" Inherits="Ak.ASPNet.Base.Catalogos.Parametros" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphHead" runat="server">
    <link href="/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.jqueryui.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.searchHighlight.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="server">
     <div class="row justify-content-center">
        <div class="align-items-center col-md-3 d-sm-flex justify-content-between mb-4">
            <a id="btn-instr" href="#" class="btn btn-icon-split btn-info">
                <span class="icon text-white-50">
                    <i class="fas fa-info"></i>
                </span>
                <span class="text">Información</span>
            </a>
        </div>
        <div class="col-lg-12" id="pnl-guide" style="display: none;">
            <div class="card mb-4">
                <div class="card-header">
                    Instrucciones
                </div>
                <div class="card-body">
                    <p><strong>Para Editar un registro:</strong></p>
                    <ul>
                        <li>Utilice el control de edición o cambie el valor en cada elemento de la lista
                        </li>
                        <li>Si es de texto o númerico complete la información solicitada en la caja de texto, si el valor es <strong>HTML</strong> podrá agregar saltos de línea y negritas y pulse en el botón "Guardar"
                        </li>
                        <li>Los valores numéricos sólo aceptan números del 0 al 999
                        </li>
                    </ul>
                    <p><strong>Los comodines son fijos no se pueden cambiar, es decir, sí un elemento HTML tiene un Comodín, no se podrá colocar en otro elemento HTML que no lo tenga inicialmente. Los elementos de este tipo son:</strong></p>
                    <ul>
                        <li>#systemName - Nombre del sistema configurado</li>
                        <li>#NOMBRE - Nombre completo del usuario/cliente/proveedor</li>
                        <li>#USUARIO - Nombre y tipo de usuario de Usuario </li>
                        <li>#LIGA - Liga de acceso al sistema, página o subasta</li>
                        <li>#PASS - Contraseña del usuario (temporal o permanente)</li>
                    </ul>
                    <p>
                        <strong>Si no puede ver todos los controles es probable que no tenga los permisos necesarios</strong>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div id="pnl-List-container" class="col-md-12">
            <div class="card mb-4">
                <div class="card-header">
                    Parámetros del sistema
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="control-label" for="sel_status">Categoría:</label>
                                <select id="ddlCat" name="ddlCat" class="form-control">
                                    <option value="">Todas</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4 offset-md-4">
                            <div class="form-group">
                                <label class="control-label" for="text_search">Búsqueda por palabra:</label>
                                <input id="text_search" type="text" class="form-control" />
                            </div>
                        </div>
                    </div>
                    <div id="pnl-row" class="row">
                        <div id="pnl-List" class="col-md-12 table-responsive">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fade modal" id="sModal" tabindex="-1" role="dialog" aria-labelledby="sModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Actulización de parámetro</h5>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 id="sModalLabel" class="m-0 font-weight-bold text-dark"></h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div id="edittext" class="col-md-12">
                                                <div class="form-group">
                                                    <label class="control-label">Valor *:</label>
                                                    <input type="text" class="form-control form-control-user mb-4"
                                                        id="txtValue" aria-describedby="Valor Parametro" placeholder="Valor Parametro" />
                                                </div>
                                            </div>
                                            <div id="edithtml" class="col-md-12">
                                                <div id="valhtml" class="form-group">
                                                </div>
                                            </div>
                                            <div id="editrol" class="col-md-12">
                                                <div class="form-group">
                                                    <label class="control-label" for="ddlRole">Tipo de usuario *:</label>
                                                    <select id="ddlRole" name="selRole" class="form-control">
                                                    </select>
                                                </div>
                                            </div>
                                            <div id="editday" class="col-md-12">
                                                <div class="form-group">
                                                    <label class="control-label" for="ddlRole">Día de la semana *:</label>
                                                    <select id="ddlDay" name="selRole" class="form-control">
                                                        <option value="-1">Seleccione</option>
                                                        <option value="0">Domingo</option>
                                                        <option value="1">Lunes</option>
                                                        <option value="2">Martes</option>
                                                        <option value="3">Miércoles</option>
                                                        <option value="4">Jueves</option>
                                                        <option value="5">Viernes</option>
                                                        <option value="6">Sábado</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="modal-controls" class="modal-footer">
                        <div class="hidden-div">
                            <button id="sModalcancel" class="btn btn-dark" type="button" data-dismiss="modal">Cerrar</button>
                        </div>
                        <a id="btn-cancel" href="#" class="btn btn-danger btn-icon-split">
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
    <script src="/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="/vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <script src="/vendor/datatables/dataTables.jqueryui.min.js"></script>
    <script src="/vendor/datatables/dataTables.searchHighlight.min.js"></script>
    <script src="/vendor/datatables/jquery.highlight.min.js"></script>
    <script src="/vendor/tinymce/tinymce.min.js"></script>
    <script src="/scripts/Catalogos/parametros.js"></script>
</asp:Content>
