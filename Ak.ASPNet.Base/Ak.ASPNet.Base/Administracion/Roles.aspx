<%@ Page Title="" Language="C#" MasterPageFile="~/web.Master" AutoEventWireup="true" CodeBehind="Roles.aspx.cs" Inherits="Ak.ASPNet.Base.Administracion.Roles" %>

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
                <span class="text">Nuevo rol</span>
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
                        <li>Utilice el control Nuevo Rol o Seleccione un elemento de la lista
                        </li>
                        <li>Complete la información solicitada en las cajas de texto, asigne permisos de visualización en el sistema y de clic en el botón "Guardar"
                        </li>
                        <li>
                            <strong>Las reglas de negocio y procesos de autorización no se modifican con la asignación de pantallas o módulos.</strong>
                        </li>
                        <li>Si pulsa "Cancelar" la pantalla regresará a un estatus inicial.
                        </li>
                        <li>Para eliminar o modificar los datos de un registro utilice los botones correspondientes en cada elemento de la lista.
                        </li>
                    </ul>
                    <p>
                        <strong>Si no puede ver todos los controles es probable que no tenga los permisos necesarios</strong>
                    </p>
                </div>
            </div>
        </div>
        <div id="pnl-List-container" class="col-md-12">
            <div class="card mb-4">
                <div class="card-header">
                    Roles del sistema
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label" for="sel_status">Estatus:</label>
                                <select id="sel_status" name="sel_status" class="form-control">
                                    <option value="0">Habilitados</option>
                                    <option value="1">Deshabilitados</option>
                                    <option value="2">Todos</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
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
                        <h5 class="modal-title" id="sModalLabel">Nuevo Rol</h5>
                        <button href="javascript:cancelRol()" class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Nombre del rol</h6>
                                    </div>
                                    <div class="card-body">
                                        <input type="text" class="form-control form-control-user mb-4" id="txtRole" aria-describedby="Role Name" placeholder="Nombre del rol" />
                                        <%--<p class="small">Nota: Las reglas de negocio del sistema, así como los procesos de autorización no se modifican con la asignación de pantallas, módulos o permisos.</p>--%>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Permisos (Sólo ingreso / para realizar modificaciones)</h6>
                                    </div>
                                    <div id="chk-list" class="card-body overflow60fixedH">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="modal-controls" class="modal-footer">
                        <a href="javascript:cancelRol()" class="btn btn-danger btn-icon-split">
                            <span class="icon text-white-50">
                                <i class="fa fa-times"></i>
                            </span>
                            <span id="btn-cancel-text" class="text">Cancelar</span>
                        </a>
                        <a href="javascript:isValidSave()" class="btn btn-success btn-icon-split fullControl">
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
    <script src="/scripts/administracion/roles.js"></script>
</asp:Content>
