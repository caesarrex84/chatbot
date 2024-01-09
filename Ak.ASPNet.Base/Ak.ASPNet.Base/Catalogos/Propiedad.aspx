<%@ Page Title="" Language="C#" MasterPageFile="~/web.Master" AutoEventWireup="true" CodeBehind="Propiedad.aspx.cs" Inherits="Ak.ASPNet.Base.Catalogos.Propiedad" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphHead" runat="server">
    <link href="/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.jqueryui.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.searchHighlight.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="server">
    <div class="row justify-content-center">
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
                        <li>Seleccione un elemento de la lista
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
                    Propiedades del usuario
                </div>
                <div class="card-body">
                    <div class="row">
                        <%--                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="control-label" for="sel_status">Estatus:</label>
                                <select id="sel_status" name="sel_status" class="form-control">
                                    <option value="0">Habilitados</option>
                                    <option value="1">Deshabilitados</option>
                                    <option value="2">Todos</option>
                                </select>
                            </div>
                        </div>--%>
                        <div class="col-md-4 offset-md-8">
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
                        <h5 class="modal-title" id="sModalLabel">Configurar propiedad</h5>
                        <button onclick="javascript:cancelUserOwnership()" class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div id="modal-edit" class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div id="ownership-data" class="card shadow mb-2 hidden-div">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Datos generales de la propiedad </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">

                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtName">Nombre:</label>
                                                    <input type="text" class="form-control form-control-user upCase" id="txtName" aria-describedby="Nombre" autocomplete="new-password" readonly />
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtWebsite">Website:</label>
                                                    <input type="text" class="form-control form-control-user upCase" id="txtWebsite" aria-describedby="Website" autocomplete="new-password" readonly />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div id="ownership-config" class="card shadow mb-2 hidden-div">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-dark">Configuración de la propiedad </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtGreeting">Saludo Inicial *:</label>
                                                    <input type="text" class="form-control form-control-user" id="txtGreeting" aria-describedby="Saludo Inicial" autocomplete="new-password" />
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtEmail">¿Desea recolectar los datos del usuario? *:</label>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="chAskDataGroup" id="chkAskUserDataYes" value="si">
                                                        <label class="form-check-label" for="chkAskUserDataYes">
                                                            Si
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="chAskDataGroup" id="chkAskUserDataNo" value="no">
                                                        <label class="form-check-label" for="chkAskUserDataNo">
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12" id="pnl_WhenAskingForData">
                                                <div class="form-group">
                                                    <label class="control-label" for="ddlRole">¿Cuándo se solicitarán los datos al usuario? *:</label>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="chkWhenAskGroup" id="chkWhenAskGroupInitial" value="initial">
                                                        <label class="form-check-label" for="chkWhenAskGroupInitial">
                                                            Al inicio del chat
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="chkWhenAskGroup" id="chkWhenAskGroupFinal" value="final">
                                                        <label class="form-check-label" for="chkWhenAskGroupFinal">
                                                            Al final del chat
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="card shadow mb-4">
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-dark">Preguntas para el usuario final</h6>
                                        <%--                               <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fas fa-plus-circle"></i>
                                        </a>
                                    </div>--%>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label class="control-label" for="txtSupervisor">Preguntas configuradas:</label>
                                                    <table class="table table-bordered table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Texto pregunta</th>
                                                                <th>Acción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="tb-question">
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td>
                                                                    <input type="text" class="form-control form-control-user" id="txtQuestion" aria-describedby="" autocomplete="new-password" />
                                                                </td>
                                                                <td class="text-center">
                                                                    <a href="javascript:AddQuestion();" class="btn btn-circle btn-primary"><i class="fa-plus-square fas"></i></a>
                                                                </td>
                                                            </tr>
                                                        </tfoot>
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
                        <a href="javascript:cancelUserOwnership()" class="btn btn-danger btn-icon-split">
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
    <script src="/scripts/Catalogos/propiedad.js"></script>
</asp:Content>
