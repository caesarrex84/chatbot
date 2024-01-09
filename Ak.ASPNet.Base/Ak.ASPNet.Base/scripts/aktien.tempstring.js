
// Option for Select same Value and Text
const opSelSameVal = (C) => (`<option value="${C}">${C}</option>`)

// Option for Select Value and Text
const opSelValText = (id, text) => (`<option value="${id}">${text}</option>`)

// TR Cliente 
const trClient = (U, editor) => (
    `<tr>
        <td>
            ${U.FullName}
        </td>
        <td>
            ${U.RFC}
        </td>
        <td>
            ${U.Email}
        </td>
        <td>
            ${U.AssignedCities !== null ? (U.AssignedCities.length > 0 ? U.AssignedCities[0].value : '') : ''}
        </td>
        <td class ="text-center">
            <a href="javascript:editS(${U.IdUser});" class ="btn btn-circle btn-info btn-sm">
                <i class ="fa-${editor ? 'pencil-alt' : 'eye'} fas"></i>
            </a>
            &nbsp;
             ${(() => {
                 if (editor) {
                     return `<a href="javascript:${U.Active ? 'deleteS' : 'enableS'}(${U.IdUser});" class ="btn btn-circle btn-${U.Active ? 'danger' : 'success'} btn-sm">
                            <i class ="fa-${U.Active ? 'trash-alt' : 'check'} fas"></i>
                            </a>`;
                 } else {
                     return ` `;
                 }
                }) ()}            
        </td>
    </tr>`)

const strMenuStart = (`
<a class="sidebar-brand d-flex align-items-center justify-content-center">
    <div class="sidebar-brand-icon">
        <img src="/images/logo_text.png" style="max-height: 42px; max-width: 100%;" />
    </div>
</a>
<hr class="sidebar-divider">
<div class="sidebar-heading"> Dashboard </div>
<!-- Nav Item - Dashboard -->
<li class="nav-item">
    <a class="nav-link" href="/Inicio"><i class="fas fa-fw fa-tachometer-alt"></i><span id="dashSpan">Ir a inicio</span></a>
</li>
<!-- Divider -->
<hr class="sidebar-divider"/>
<div class="sidebar-heading"> Menú </div>
`)

const strMenuElement = (M) => (`
 <!-- Nav Item - Pages Collapse Menu -->
<li class="nav-item">
    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapse_${M.idScreen}" aria-expanded="true" aria-controls="collapse_${M.idScreen}">
        <i class="${ M.icon }"></i>
        <span>${M.name}</span>
    </a>
    <div id="collapse_${M.idScreen}" class="collapse" aria-labelledby="heading_${M.idScreen}" data-parent="#accordionSidebar">
        <div class="bg-white py-2 collapse-inner rounded">
        ${M.subMenu.map(function (sm) {
            return '<a class="collapse-item" href="' + sm.url + '"><i class="' + sm.icon + ' mr-2"></i>' + sm.name + '</a>';
        }).join("")}
        </div>
    </div>
</li>`)

const strMenuEnd = (`
<!-- Divider -->
<hr class="sidebar-divider d-none d-md-block" />

<!-- Sidebar Toggler (Sidebar) -->
<div class="text-center d-none d-md-inline">
    <a class="border-0 btn-circle rounded-circle" href="javascript:menuToggle()" id="sidebarToggle"></a>
</div>
<div class="bg_overlay">
</div>
`)