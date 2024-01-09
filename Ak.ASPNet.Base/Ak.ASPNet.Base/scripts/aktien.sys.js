const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const shortMonthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const daysofweek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
var tempHTML, t, t2, t3, t4, t5, et;
let hasload = false, isUpdating = false;
const qlm = [5, 10, 15, 25, 50];
let qdl5 = 5, upP = 0, qdl = 10;
let States, Towns, fTowns, CDRS, idState, idTown;
let CarBrands, CarModels, fModels, idBrand, idModel;
let GPCategories, cGPC, cDate1, cDate2, cDate3;
let PDFLoadType = "";
let exportIndex = 0;
/// fbde = FilterByDateEnabled;
let fbde = false;
/// tsfd = TodayStringFixedDate;
const tsfd = pad(new Date().getDate(), 2) + '/' + pad(new Date().getMonth() + 1, 2) + '/' + new Date().getFullYear();

function toggleInfoPanel() {
    $('#pnl-guide').slideToggle();
}

$('#ui-close').click(function (e) {
    e.preventDefault();
    UserLogout();
});

function UserLogout() {
    startProgress();
    localStorage.removeItem('ak-api-token');
    localStorage.removeItem('ak-api-user');
    setTimeout(function (e) { window.location.replace('/Login'); }, 500);
}

function pageStart() {
    if (aUsr == null || aUsr == undefined) {
        setTimeout(function (e) { pageStart() }, 300)
    } else {
        setUserInfo();
        setUserMenu();
        fixAutocompletes();
        let currentScreen = getObjects(aUsr.userType.authorizeMenus, 'url', window.location.pathname)[0];
        if (currentScreen !== undefined) {
            $('.ttl_subs_flekk').html('<i class="' + currentScreen.icon + '"></i>&nbsp;' + currentScreen.name)
            fullControl = getObjects(aUsr.userType.authorizeMenus, 'url', window.location.pathname)[0].fullControl;
        } else {
            fullControl = false;
        }
        setupReady = true;
    }
}

function setUserInfo() {
    $('#ui-img').attr('src', aUsr.Picture)
    $('#ui-img').show();
    $('#ui-name').html(aUsr.fullName + '<br /><strong>' + aUsr.userType.user_Type + ' <i class="fa fa-chevron-down ml-2"></i></strong></p>');
}

function setUserMenu() {
    tempHTML = strMenuStart;
    for (let i in aUsr.userType.structuredMenus) {
        let M = aUsr.userType.structuredMenus[i];
        tempHTML += strMenuElement(M);
    }
    tempHTML += strMenuEnd;
    $('#accordionSidebar').html(tempHTML);
}

function menuToggle() {
    // Toggle the side navigation
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
    };
}

function GenericError(jqXHR) {
    if (jqXHR !== undefined) {
        console.log(jqXHR);
    }
    jError('El proceso no se ha podido completar. Por favor verifique que no ingresó caracteres tipo comillas: <br/><br/> &#39; o &#180; <br/><br/> E intente nuevamente.', 'Error:');
    endProgress();
}

function LastError(response) {
    jError(unescape(response.message), 'Error:');
    console.log(response);
    endProgress();
}

function startProgress() {
    $('#UpProgressMain').show();
}

function endProgress() {
    setTimeout(function (e) { $('#UpProgressMain').hide() }, 300);
}

function startProgressI(id) {
    tempHTML = '<div class="UpProgressInternal"><div class="Cont_Loading_I">' +
        '<img class="img_loading_I" src="/images/loading2.gif" alt="Loading..." /></div></div>';
    $('#' + id).append(tempHTML);
}

function endProgressI(id) {
    setTimeout(function (e) {
        $('#' + id + ' .UpProgressInternal').remove();
    }, 400);
}

function startProgressF(title) {
    if (title !== undefined && title !== null) {
        $('#loading_F_title').html(title);
    }
    upP = 0;
    drawProgressF();
    $('#UpFileProgress').show();
}

function updateProgressF(e) {
    if (e.lengthComputable) {
        upP = Math.floor((e.loaded / e.total) * 100);
        drawProgressF();
    }
}

function drawProgressF() {
    $('#loading_fup').html(upP + ' %');
    $('#loading_fupb').html('<div class="progress-bar bg-info" role="progressbar" style="width: ' + upP + '%" aria-valuenow="' + upP + '" aria-valuemin="0" aria-valuemax="100"></div>');
}

function endProgressF(message) {
    setTimeout(function (e) { $('#UpFileProgress').hide() }, 400);
    if (message !== undefined && message !== null) {
        Notification(message);
    }
}

function scrollTop() {
    $('html,body').animate({ scrollTop: $("#upMain").offset().top }, 'slow');
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i))
            continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function formatDate(iDate) {
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        var m = ct.getMonth(); var d = ct.getDate(); var y = ct.getFullYear();
        return pad(d, 2) + '/' + pad(m + 1, 2) + '/' + y;
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        return iDate.substring(8, 10) + '/' + iDate.substring(5, 7) + '/' + iDate.substring(0, 4);
    }
}

function formatDateSort(iDate) {
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        var m = ct.getMonth(); var d = ct.getDate(); var y = ct.getFullYear();
        return y + pad(m + 1, 2) + pad(d, 2);
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        return iDate.substring(0, 4) + iDate.substring(5, 7) + iDate.substring(8, 10);
    }
}

function formatDateStringMonth(iDate) {
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        var m = ct.getMonth(); var d = ct.getDate(); var y = ct.getFullYear();
        return pad(d, 2) + '/' + shortMonthNames[m] + '/' + y;
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        return iDate.substring(8, 10) + '/' + shortMonthNames[Number(iDate.substring(5, 7), 10) - 1] + '/' + iDate.substring(0, 4);
    }
}

function fixDateToStringDate(iDate, fixGMT) {
    var jsonDate = undefined;
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        jsonDate = ct.toJSON();
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        jsonDate = iDate;
    } else if (iDate.toString().indexOf('GMT') > -1) {
        var ct = iDate;
        var m = ct.getMonth(); var d = ct.getDate(); var y = ct.getFullYear();
        var h = ct.getHours(); var mi = ct.getMinutes(); var s = ct.getSeconds();
        return pad(d, 2) + '/' + pad(m + 1, 2) + '/' + y + ' ' + pad(h, 2) + ':' + pad(mi, 2) + ':' + pad(s, 2);
    }
    if (jsonDate === undefined) {
        return '';
    } else {
        return jsonDate.substring(8, 10) + '/' + jsonDate.substring(5, 7) + '/' + jsonDate.substring(0, 4) + ' ' + jsonDate.substring(11, 19);
    }
}

function fixDateToJsonDate(iDate) {
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        return ct.toJSON();
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        return iDate;
    }
}

function formatDateJS(iDate) {
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        var m = ct.getMonth(); var d = ct.getDate(); var y = ct.getFullYear();
        var h = ct.getHours(); var mi = ct.getMinutes(); var s = ct.getSeconds()
        return new Date(y, pad(m, 2), pad(d, 2), pad(h, 2), pad(mi, 2), pad(s, 2));
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        return new Date(iDate.substring(8, 10), iDate.substring(5, 7), iDate.substring(0, 4) + iDate.substring(11, 19));
    }
}

function formatDateStringMonthFull(iDate) {
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        var m = ct.getMonth(); var d = ct.getDate(); var y = ct.getFullYear();
        return pad(d, 2) + ' de ' + monthNames[m] + ' de ' + y;
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        return iDate.substring(8, 10) + ' de ' + monthNames[Number(iDate.substring(5, 7), 10) - 1] + ' de ' + iDate.substring(0, 4);
    }
}

function formatDateHour(iDate) {
    if (iDate === undefined || iDate === null) {
        return '';
    } else if (iDate.toString().indexOf('Date') > -1) {
        var ds = iDate.substr(6); var ct = new Date(parseInt(ds));
        var m = ct.getMonth(); var d = ct.getDate(); var y = ct.getFullYear();
        var h = ct.getHours(); var mi = ct.getMinutes(); var s = ct.getSeconds()
        return pad(d, 2) + '/' + shortMonthNames[m] + '/' + y + ' ' + pad(h, 2) + ':' + pad(mi, 2) + ':' + pad(s, 2);
    } else if (iDate.toString().indexOf('T') > -1 && iDate.toString().indexOf('Z') > -1) {
        return iDate.substring(8, 10) + '/' + iDate.substring(5, 7) + '/' + iDate.substring(0, 4) + iDate.substring(11, 19);
    }
}

function formatDateStringToJS(date) {
    var regDate = date.split("/");
    var rD = new Date(regDate[2], regDate[1] - 1, regDate[0]);
    return rD;
}

function formatDateApi(date) {
    var regDate = date.split("-");
    var dayB = regDate[2];
    var day = dayB.split("T");
    return day[0] + "/" + regDate[1] + "/" + regDate[0];
}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function Notification(message) {
    message = '<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Mensaje:</div>' + message;
    $('#nim-text').html(message)
    $('#nim-container').show()
    $('#nim-container').fadeTo('fast', 1)
    setTimeout(function (e) { $('#nim-container').fadeTo('slow', 0) }, 3500);
    setTimeout(function (e) { $('#nim-container').hide() }, 5000);
}

function isMobile() {
    try { document.createEvent("TouchEvent"); return true; }
    catch (e) { return false; }
}

function removeBR(input) {
    return htmlDecode(input).replace("<br/>", "");
}

function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function setOnlyNumbers() {
    $(".onlynumbers").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
}

function isNumberKey(txt, evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 46) {
        //Check if the text already contains the . character
        if (txt.value.indexOf('.') === -1) {
            return true;
        } else {
            return false;
        }
    } else {
        if (charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;
    }
    return true;
}

function setUpperCase() {
    $('.upCase').on("keypress keyup blur", function (event) {
        this.value = this.value.toLocaleUpperCase();
    });
}

function fixAutocompletes() {
    for (i = 1; i < 10; i++) {
        setTimeout(function (e) {
            $("input[autocomplete='off']").attr('autocomplete', 'new-password');
        }, i * 500)
    }
}

function addCommas(nStr) {
    if (!isNaN(nStr)) {
        nStr = Math.round(nStr * 100) / 100;
    } else {
        nStr = 0;
    }
    nStr = nStr.toFixed(0);
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function addCommasAndDecimals(nStr) {
    if (!isNaN(nStr)) {
        nStr = Math.round(nStr * 100) / 100;
    } else {
        nStr = 0;
    }
    nStr = nStr.toFixed(2);
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function toggleById(id1, id2) {
    hideById(id1);
    setTimeout(function (e) { showById(id2) }, 400);
}

function showById(id) {
    if (!$('#' + id).is(':visible')) { $('#' + id).slideToggle(); }
}

function hideById(id) {
    if ($('#' + id).is(':visible')) { $('#' + id).slideToggle(); }
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function fixDataTableColumns() {
    setTimeout(function () {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    }, 300);
    setTimeout(function () {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    }, 500);
    setTimeout(function () {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    }, 800);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function showHideGuide() {
    $('#pnl-guide').slideToggle();
}

/* Inicia carga de PDF */

let oPDF, responsePDF, responsePDFCard, responsePDFInsurance, responsePDFEmissions, responsePDFDoc1, responsePDFDoc2;

function startPDFupload(txt, type, modal, btn) {
    oPDF = {
        txt: txt,
        type: type,
        modal: modal,
        btn: btn,
    };
    responsePDF = undefined;
    setTimeout(function (e) { clearUploadPanel(); }, 200)
    $('#uploadModal').modal();
    $('#' + oPDF.modal).modal('hide');
}

$('#btn-file-ue').click(function (e) {
    e.preventDefault();
    $('#myFUE').click();
});

$('#myFUE').on('change', function () {
    startProgressI('sModalBody');
    //readURL(this);
    if ($(this)[0].files.length > 0) {
        var file = $('#myFUE')[0].files[0];
        $('#btn-file-ue .text').html('Archivo seleccionado');
        $('#btn-file-ue .icon i').removeClass('fa-search').addClass('fa-window-close');
        showById('excel-resume');
        $('#excel-resume .h5').html(file.name);
        $('#excel-resume .text-xs').html((file.size / 1024 / 1024).toFixed(2) + ' Mb');

        let fe = file.name.replace(/^.*\./, '').toLowerCase();
        switch (fe) {
            case 'xlsx': case 'xls':
                fe = 'excel';
                break;
            case 'png': case 'jpg': case 'gif':
                fe = 'image';
                break;
            case 'png': case 'jpg': case 'gif':
                fe = 'image';
                break;
            case 'docx': case 'doc': case 'docm':
                fe = 'word';
                break;
            default:
        }

        $('#excel-resume').find('i').removeAttr('class');
        $('#excel-resume').find('i').attr('class', '');
        $('#excel-resume').find('i').addClass('fa-2x fas text-secondary fa-file-' + fe);

        endProgressI('sModalBody');
    } else {
        clearUploadPanel();
        endProgressI('sModalBody');
    }
});

function clearUploadPanel() {
    $('#myFUE').val('');
    $('#btn-file-ue .text').html('Elegir Archivo');
    $('#btn-file-ue .icon i').removeClass('fa-window-close').addClass('fa-search');
    hideById('excel-resume');
    $('#excel-resume .h5').html('');
    $('#excel-resume .text-xs').html('');
}

function isValidUploadUniquePDF() {
    try {
        if ($('#myFUE')[0].files[0] == undefined || $('#myFUE')[0].files[0] == null) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

function completeUpladFile() {
    if (isValidUploadUniquePDF()) {
        startProgressF();
        var formData = new FormData();
        formData.append('type', oPDF.type);
        formData.append('user', aUsr.IdUser);
        formData.append('file', $('#myFUE')[0].files[0]);
        $.ajax({
            type: 'post',
            url: '/PDFs/Uploader.ashx',
            data: formData,
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { myXhr.upload.addEventListener('progress', updateProgressF, false); }
                return myXhr;
            },
            success: function (data) {
                var response = jQuery.parseJSON(data);
                if (response.Success) {
                    endProgressF();

                    switch (PDFLoadType) {
                        case "":
                            responsePDF = response.FlekkUpFile;
                            break;
                        case "card":
                            responsePDFCard = response.FlekkUpFile;
                            break;
                        case "emissions":
                            responsePDFEmissions = response.FlekkUpFile;
                            break;
                        case "insurance":
                            responsePDFInsurance = response.FlekkUpFile;
                            break;
                        case "doc1":
                            responsePDFDoc1 = response.FlekkUpFile;
                            break;
                        case "doc2":
                            responsePDFDoc2 = response.FlekkUpFile;
                            break;
                        default:
                            responsePDF = response.FlekkUpFile;
                            break;
                    }

                    $('#' + oPDF.txt).val(response.FlekkUpFile.fileName);
                    $('#' + oPDF.btn).attr("href", '/' + response.FlekkUpFile.fileURL);
                    $('#' + oPDF.btn).attr("target", "_blank");
                    $('#' + oPDF.btn).attr("download", "");
                    $('#' + oPDF.modal).modal();
                    $('#' + oPDF.modal).css('overflow-y', 'auto');
                    $('#uploadModal').modal('hide');
                    Notification('El archivo se subió correctamente. <br/><br/>No olvide completar el proceso y guardar los cambios');
                } else {
                    LastError(response);
                    endProgressF();
                    return false;
                }
            },
            processData: false,
            contentType: false,
            error: function (jqXHR, textStatus, errorThrown) {
                GenericError(jqXHR);
                endProgressF();
                return false;
            }
        });
    } else {
        jWarning('Debe seleccionar un archivo en formato PDF.', 'Corregir');
    }
}

function cancelUpladFile() {
    //$('#' + oPDF.txt).val('');
    $('#uploadModal').modal('hide');
    //$('#' + oPDF.btn).attr("href", 'javascript:noPDFloaded()');
    //$('#' + oPDF.btn).attr("target", "");
    $('#' + oPDF.modal).modal();
    $('#' + oPDF.modal).css('overflow-y', 'auto');
    oPDF = undefined;
}

function noPDFloaded() {
    Notification('Por favor, completa los campos obligatorios:<br /><br /> Aún no hay un PDF cargado.');
}

/* Termina Evidencia única */

/* Inicia mensaje modal */

function imagesModal(items, title) {
    let count = 0;
    tempHTML = '';
    tempHTML += '<div id="dynamicCarousel" class="carousel slide" data-ride="carousel">'
        + '<ol class="carousel-indicators">';
    for (i = 0; i < items.length; i++) {
        tempHTML += '<li data-target="#dynamicCarousel" data-slide-to="' + count + '" class="' + (count === 0 ? 'active' : '') + '"></li>';
        count++;
    }
    tempHTML += '</ol>';
    count = 0;
    tempHTML += '<div class="carousel-inner">';
    for (i = 0; i < items.length; i++) {
        var I = items[i];
        tempHTML += '<div class="carousel-item ' + (count === 0 ? 'active' : '') + '">';
        tempHTML += '<img src="' + I.url + '" >';
        if (I.text !== '' || I.title !== '') {
            tempHTML += '<div class="carousel-caption d-none d-md-block">';
            if (I.title !== '') { tempHTML += '<h5>' + I.title + '</h5>'; }
            if (I.text !== '') { tempHTML += '<p>' + I.text + '</p>'; }
            tempHTML += '</div>';
        }
        tempHTML += '</div>';
        count++;
    }
    tempHTML += '</div>';
    if (items.length > 1) {
        tempHTML += '<a class="carousel-control-prev" href="#dynamicCarousel" role="button" data-slide="prev">' +
            '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '<a class="carousel-control-next" href="#dynamicCarousel" role="button" data-slide="next">' +
            '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
            '<span class="sr-only">Next</span>' +
            '</a>';
    }
    tempHTML += '</div>';
    showMessageModal(title, tempHTML);
    $('#dynamicCarousel').carousel();
}

function showMessageModal(title, text) {
    $('#messageModalTitle').html(unescape(title));
    $('#messageModalText').html(unescape(text));
    $('#messageModal').modal();
}

function closeMessageModal() {
    $('#messageModalTitle').html('');
    $('#messageModalText').html('');
    $('#messageModal').modal('hide');
}

/* termina mensaje modal */


$('#sModal').modal({
    backdrop: 'static',
    keyboard: false,
    show: false,
})

$(document).on('keydown', function (event) {
    if (event.key == "Escape") {
        if ($("#popup_cancel").length > 0) {
            $('#popup_cancel').click()
        } else {
            $('#popup_ok').click()
        }
    }
});

/*
public enum setAction
{
    Select = 0,
    Create = 1,
    Update = 2,
    Delete = 3
}
public enum elementStatus
{
    Active = 0,
    Inactive = 1,
    All = 2
}
*/

function isValidField(fieldID) {
    var errorsF = "";
    var isValid = true;
    var fld = $("#" + fieldID);

    if (fld.val() == "") {
        if (fld.siblings("label").length == 0) {
            errorsF += fld.parent().siblings("label").html().replace(" *:", "") + " <br /> ";
        } else {
            errorsF += fld.siblings("label").html().replace("*:", "") + " <br /> ";
        }

        fld.addClass("formInputInvalid");
        isValid = false;
    } else {
        fld.removeClass("formInputInvalid");
    }


}

//** Validate content **//
function isValidForm(containerId, defaultSelectValue = "-1") {
    var isValid = true;
    var errors = "";

    $('#' + containerId).find('input').each(function () {
        if (!$(this).prop('required')) {
            console.log($(this).siblings("label").html() + "no obligatorio");
        } else {
            if ($(this).val() == "") {
                if ($(this)[0].type == "time") {
                    errors += "Horario preferido de recolección <br />"
                }
                else {
                    if ($(this).siblings("label").length == 0) {
                        errors += $(this).parent().siblings("label").html().replace(" *:", "") + " <br /> ";
                    } else {
                        errors += $(this).siblings("label").html().replace("*:", "") + " <br /> ";
                    }
                }

                $(this).addClass("formInputInvalid");
                isValid = false;
            } else {
                $(this).removeClass("formInputInvalid");
            }
        }
    });
    $('#' + containerId).find('select').each(function () {
        if (!$(this).prop('required')) {
            console.log($(this).siblings("label").html() + "no obligatorio");
        } else {
            if ($(this).val() == defaultSelectValue) {
                errors += $(this).siblings("label").html().replace("*:", "") + " <br /> ";
                $(this).addClass("formInputInvalid");
                isValid = false;
            } else {
                $(this).removeClass("formInputInvalid");
            }
        }
    });
    $('#' + containerId).find('textarea').each(function () {
        if (!$(this).prop('required')) {
            console.log($(this).siblings("label").html() + "no obligatorio");
        } else {
            if ($(this).val() == "") {
                errors += $(this).siblings("label").html().replace("*:", "") + " <br /> ";
                $(this).addClass("formInputInvalid");
                isValid = false;
            } else {
                $(this).removeClass("formInputInvalid");
            }
        }
    });
    return {
        isValid: isValid,
        ErrorMessage: errors
    }
}

function resetForm(containerId, ds) {
    //ds = defaultSelect
    if (ds === undefined || ds === null) { ds = '0'; }
    $('#' + containerId).find('input').each(function () {
        $(this).val('');
        $(this).removeClass("formInputInvalid");
    });
    $('#' + containerId).find('select').each(function () {
        $(this).val(ds);
        $(this).removeClass("formInputInvalid");
    });
    $('#' + containerId).find('textarea').each(function () {
        $(this).val('');
        $(this).removeClass("formInputInvalid");
    });
}

function setDateFilters(zerovalue = 'Todos', InitialYear = 2020) {
    tempHTML = '<option value="0">' + zerovalue + '</option>';
    for (i = 0; i < monthNames.length; i++) {
        var U = monthNames[i];
        U = U.charAt(0).toUpperCase() + U.slice(1).toLowerCase();
        tempHTML += '<option value="' + (i + 1) + '">' + U + '</option>';
    }
    $('#sel_month').html(tempHTML);
    tempHTML = '<option value="0">' + zerovalue + '</option>';
    for (i = InitialYear; i <= new Date().getFullYear(); i++) {
        tempHTML += '<option value="' + i + '">' + i + '</option>';
    }
    $('#sel_year').html(tempHTML);

}

//*** Parametro en cualquier página ***/

function getParameterValue(paramName, paramObj) {
    var sReq = {
        Application: baseRequest.Application,
        UserRequest: aUsr.IdUser,
        UserRequestRol: aUsr.IdUserType,
        QueryStringCode: baseRequest.QueryStringCode,
        requestIP: baseRequest.requestIP,
        MacAdress: baseRequest.MacAdress,
        Action: 0,
        Status: 0,
        Filters: { Parameter: paramName },
    };
    var complexObject = JSON.stringify(sReq);
    $.ajax({
        type: 'POST',
        url: '/ws.asmx/SetParameter',
        data: "{'request': '" + complexObject + "' }",
        contentType: 'application/json; utf-8',
        dataType: 'json',
        success: function (data) {
            var response = jQuery.parseJSON(data.d);
            if (response.Success) {
                paramObj.Value = response.SingleParameter.Value;
                return false;
            } else {
                console.log('Error al obtener parámetro ' + param);
                console.log(response);
                return false;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error al obtener parámetro ' + param);
            console.log(jqXHR);
            return false;
        }
    });
}

$(document).ready(function () {
    pageStart();
    setOnlyNumbers();
    setUpperCase();
});
