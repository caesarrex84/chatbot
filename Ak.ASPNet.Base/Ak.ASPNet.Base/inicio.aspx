<%@ Page Title="" Language="C#" MasterPageFile="~/web.Master" AutoEventWireup="true" CodeBehind="inicio.aspx.cs" Inherits="Ak.ASPNet.Base.inicio" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphHead" runat="server">
    <link href="/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.jqueryui.min.css" rel="stylesheet" />
    <link href="/vendor/datatables/dataTables.searchHighlight.css" rel="stylesheet" />
    <link href="/vendor/datepicker/bootstrap-datepicker.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="server">
    <div class="row">
        <div class="col-md-12 mb-4">
            <div id="ownershipContainer" class="col-md-4 offset-md-4 hidden-div">
                <div class="form-group">
                    <label class="control-label" for="ddlOwnership">Propiedad :</label>
                    <select id="ddlOwnership" name="ddlOwnership" class="form-control">
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4">
            <!-- Project Card Example -->
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Chatbot con AI de ChatGPT Powered by</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <img class="img-fluid" src="/images/logoanimado.gif" />
                        </div>
                        <div class="col-md-12">
                            <div class="bg-primary card h-100 py-2 shadow">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div id="tokensResume" class="col mr-2">
                                            
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa- fa-2x fa-comment-dollar fas text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="dashboarditem col-md-8 hidden-div">
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-dark">Chats por día del mes actual</h6>
                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-bar">
                        <div class="chartjs-size-monitor">
                            <div class="chartjs-size-monitor-expand">
                                <div class=""></div>
                            </div>
                            <div class="chartjs-size-monitor-shrink">
                                <div class=""></div>
                            </div>
                        </div>
                        <canvas id="sdp"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div class="dashboarditem col-md-5 hidden-div">
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-dark">Chats del mes en los que dejaron datos</h6>
                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-bar">
                        <div class="chartjs-size-monitor">
                            <div class="chartjs-size-monitor-expand">
                                <div class=""></div>
                            </div>
                            <div class="chartjs-size-monitor-shrink">
                                <div class=""></div>
                            </div>
                        </div>
                        <canvas id="dnr"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div class="dashboarditem col-md-7 hidden-div">
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-dark">Acumulado mensual de chats iniciados del presente año</h6>
                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-bar">
                        <div class="chartjs-size-monitor">
                            <div class="chartjs-size-monitor-expand">
                                <div class=""></div>
                            </div>
                            <div class="chartjs-size-monitor-shrink">
                                <div class=""></div>
                            </div>
                        </div>
                        <canvas id="trc"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <!-- Querys Anuales -->
        <div class="dashboarditem col-md-12 hidden-div">
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-dark">Acumulado mensual de consumo de Querys del presente año</h6>
                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-bar">
                        <div class="chartjs-size-monitor">
                            <div class="chartjs-size-monitor-expand">
                                <div class=""></div>
                            </div>
                            <div class="chartjs-size-monitor-shrink">
                                <div class=""></div>
                            </div>
                        </div>
                        <canvas id="trcq"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <!-- Tokens Anuales -->
        <div class="dashboarditem col-md-12 hidden-div">
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-dark">Acumulado mensual de consumo de Tokens del presente año</h6>
                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-bar">
                        <div class="chartjs-size-monitor">
                            <div class="chartjs-size-monitor-expand">
                                <div class=""></div>
                            </div>
                            <div class="chartjs-size-monitor-shrink">
                                <div class=""></div>
                            </div>
                        </div>
                        <canvas id="trct"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" runat="server">
    <script src="vendor/chart.js/Chart.min.js"></script>
    <script src="/vendor/datepicker/jquery.timepicker.min.js"></script>
    <script src="/vendor/datepicker/bootstrap-datepicker.min.js"></script>
    <script src="/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="/vendor/datatables/dataTables.bootstrap4.min.js"></script>
    <script src="/vendor/datatables/dataTables.responsive.min.js"></script>
    <script src="/vendor/datatables/responsive.bootstrap4.min.js"></script>
    <script src="/vendor/datatables/dataTables.buttons.min.js"></script>
    <script src="/vendor/datatables/buttons.flash.min.js"></script>
    <script src="/vendor/datatables/jszip.min.js"></script>
    <script src="/vendor/datatables/buttons.html5.min.js"></script>
    <script src="/vendor/datatables/buttons.print.min.js"></script>
    <script src="/vendor/datatables/buttons.foundation.min.js"></script>
    <script src="/vendor/datatables/buttons.colVis.min.js"></script>

    <script src="/vendor/datatables/dataTables.jqueryui.min.js"></script>
    <script src="/vendor/datatables/dataTables.searchHighlight.min.js"></script>
    <script src="/vendor/datatables/jquery.highlight.min.js"></script>
    <script src="scripts/sys/inicio.js"></script>
</asp:Content>
