let Dashboard, Parts, trc, dnc, sdp, dnr, trcq, trct;
let Ownerships; let cO = null;

//CollectionDaysBackwardsGroup = 30 // Indica la cantidad de días hacia atras, para conteo de piezas recientes(default 30)
let cdbg = { Value: '30' };
//CollectionDaysBackwardsMax = 60 // Indica la cantidad máxima de días hacia atras, para buscar piezas pendientes por recolectar(default 90)
let cdbm = { Value: '60' };
let imgLoading = '<img src="/images/loading2.gif" alt="Loading..." style="max-width: 100%;height: 40px;">'

function startDashboard() {
    if (!setupReady) {
        setTimeout(function (e) { startDashboard() }, 300)
    } else {
        getMyOwnerships();
    }
}

$("#ddlOwnership").change(function () {
    startProgress();
    let id = Number($("#ddlOwnership option:selected").val(), 10);
    cO = Ownerships.find(x => x.id == id);
    getDashboard();
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
                        getDashboard();
                        break;
                    default:
                        //Puede elegir entre varias plazas
                        $('#ddlOwnership').append($("<option></option>").attr("value", 0).text("Selecciona Propiedad"));
                        $.each(Ownerships, function (key, R) {
                            $('#ddlOwnership').append($("<option></option>").attr("value", R.id).text(unescape(R.name)));
                        });
                        Notification('Puede administrar más de una Propiedad.<br/><br/>Seleccione una propiedad para iniciar.');
                        $('#ownershipContainer').slideToggle();
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

function getDashboard() {
    if (cO !== null && cO !== undefined) {
        startProgress();
        let wsURL = `${apiUrl}Dashboard?idPropiedad=${cO.id}`;

        $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
            },
            url: wsURL,
            contentType: 'application/json; utf-8',
            dataType: 'json',
            success: function (response) {
                Dashboard = response.data;
                drawDashboard();
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

function drawDashboard() {
    drawMonthChart();
    drawIncludeDataChart();
    drawYearChart();
    drawYearChartt();
    drawYearChartq();
    $('#tokensResume').html(`
        <div class="font-weight-bold mb-1 text-uppercase text-white text-xs">Tokens:<br/>Contratados / consumidos en el mes</div>
        <div id="totTokens" class="font-weight-bold h5 mb-0 text-white">${cO.tokenAmount} / ${Dashboard.currentMontTokens}</div>
        <div class="font-weight-bold mb-1 text-uppercase text-white text-xs mt-4">Querys:<br/>Límite / consumidos en el mes</div>
        <div id="totQuerys" class="font-weight-bold h5 mb-0 text-white">500 / ${Dashboard.currentMontQuerys}</div>
    `);
    $('.dashboarditem:hidden').slideToggle()
    endProgress();
}

function drawIncludeDataChart() {
    var ctx = document.getElementById("dnr");
    if (dnr !== undefined) { dnr.destroy(); }
    var val = Dashboard.currentMonthContact.map(x => x.value);
    var lbl = Dashboard.currentMonthContact.map(x => x.value + ' ' + x.label + ' dejaron datos');
    var bgc = ['rgb(100 100 0)', 'rgb(0 140 255)'];
    //var lbl = ['68 personas si dejaron datos', '7 personas sólo conversaron']
    //var bgc = ['rgb(0 140 255)', 'rgb(27 46 91)'];

    dnr = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: lbl,
            datasets: [{
                label: "Dejaron datos",
                backgroundColor: bgc,
                hoverBackgroundColor: bgc,
                borderColor: bgc,
                data: val,
            }
            ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            legend: {
                display: true,
                position: 'left'
            },
            tooltips: {
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        return chart.labels[tooltipItem.index]
                    }
                }
            },
        }
    });
}

function drawMonthChart() {
    var ctx = document.getElementById("sdp");
    if (sdp !== undefined) { sdp.destroy(); }
    var val = Dashboard.currentMonth.map(x => x.value);
    var lbl = Dashboard.currentMonth.map(x => x.label);

    sdp = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lbl,
            datasets: [{
                label: "Chats Iniciados",
                backgroundColor: "#4e73df",
                hoverBackgroundColor: "#2e59d9",
                borderColor: "#4e73df",
                data: val,
            }
            ],
        },
        options: barChartOptions
    });
}

function drawYearChart() {
    var ctx = document.getElementById("trc");
    if (trc !== undefined) { trc.destroy(); }

    trc = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Dashboard.months.map(x => x.label),
            datasets: [{
                label: "Chats Iniciados",
                backgroundColor: "rgb(0,0,255)",
                hoverBackgroundColor: "rgb(0,0,255)",
                borderColor: "rgb(0,0,255)",
                data: Dashboard.months.map(x => x.value),
            }],
        },
        options: barChartOptions
    });
}

function drawYearChartq() {
    var ctx = document.getElementById("trcq");
    if (trcq !== undefined) { trcq.destroy(); }
    
    trcq = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Dashboard.tokens.map(x => x.label),
            datasets: [{
                label: "Tokens consumidos cada mes",
                backgroundColor: "rgb(156,255,156)",
                hoverBackgroundColor: "rgb(156,255,156)",
                borderColor: "rgb(156,255,156)",
                data: Dashboard.tokens.map(x => x.value),
            }],
        },
        options: barChartOptions
    });
}

function drawYearChartt() {
    var ctx = document.getElementById("trct");
    if (trct !== undefined) { trct.destroy(); }
    
    trct = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Dashboard.querys.map(x => x.label),
            datasets: [{
                label: "Querys utilizados cada mes",
                backgroundColor: "rgb(0,255,0)",
                hoverBackgroundColor: "rgb(0,255,0)",
                borderColor: "rgb(0,255,0)",
                data: Dashboard.querys.map(x => x.value),
            }],
        },
        options: barChartOptions
    });
}

const barChartOptions = {
    maintainAspectRatio: false,
    layout: {
        padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
        }
    },
    scales: {
        xAxes: [{
            time: {
                unit: 'chats'
            },
            gridLines: {
                display: false,
                drawBorder: false
            },
            ticks: {
                maxTicksLimit: 6
            },
            maxBarThickness: 25,
        }
        ],
        yAxes: [{
            ticks: {
                padding: 10,
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                    return value;
                }
            },
            gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
            }
        }
        ],
    },
    legend: {
        display: true,
        position: 'bottom'
    },
    tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
            label: function (tooltipItem, chart) {
                return tooltipItem.xLabel + ' ' + tooltipItem.yLabel;
            }
        }
    },
    "animation": {
        "duration": 1,
        "onComplete": function () {
            var chartInstance = this.chart,
                ctx = chartInstance.ctx;

            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function (bar, index) {
                    var data = dataset.data[index];
                    if (data != '0') {
                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                    }
                });
            });
        }
    }
};

startDashboard()