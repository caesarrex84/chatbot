using Ak.Core.Base.DTOs;
using Ak.Core.Base.Entities;
using Ak.Core.Base.Manager;
using Ak.Core.Base.Wrappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Ak.Core.Base.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserTypeController : ControllerBase
    {
        private readonly sAkDbContext _dbContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private APIResponse<UserType> resp;
        private APIResponse<IEnumerable<UserType>> respList;
        private APIResponse<IEnumerable<MenuItem>> respSystemScreens;

        public UserTypeController(sAkDbContext dbContext, JwtAuthenticationManager jwtAuthenticationManager, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            this._dbContext = dbContext;
            this.jwtAuthenticationManager = jwtAuthenticationManager;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;

            resp = new APIResponse<UserType>()
            {
                Succeded = false,
                Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError"),
            };
            respList = new APIResponse<IEnumerable<UserType>>()
            {
                Succeded = false,
                Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError"),
            };
            respSystemScreens = new APIResponse<IEnumerable<MenuItem>>()
            {
                Succeded = false,
                Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError"),
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll(Int32 status = 2)
        {
            var userTypes = await (from TU in _dbContext.TipoUsuarios where TU.Id > 0 select new UserType(TU)).ToListAsync();
            if (status != 2)
                userTypes = userTypes.Where(X => X.Active == (status == 0)).ToList();

            foreach (var ut in userTypes)
            {
                ut.AuthorizeMenus = await _dbContext.Permisos
                .Include(X => X.Pantalla)
                .Where(X => X.TipoUsuarioId == ut.IdUserType)
                .Select(X => new MenuItem(
                    X.Pantalla,
                    X.Pantalla.Padre,
                    X.RealizaCambios)).ToListAsync();

            }

            respList = new APIResponse<IEnumerable<UserType>>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = userTypes
            };
            return Ok(respList);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            //Si es 0, se recupera el id del usuario por medio del Token
            if (id == 0)
            {
                var token = HttpContext.Request.Headers["Authorization"];
                var idUserRequest = jwtAuthenticationManager.readToken(token.ToString());
                var U = await _dbContext.Usuarios.FindAsync(idUserRequest);
                if(U == null)
                {
                    resp.Succeded = false;
                    resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                    return Ok(resp);
                }
                id = U.TipoUsuarioId;
            }

            var TU = await _dbContext.TipoUsuarios.FindAsync(id);

            if (TU == null)
            {
                resp.Succeded = false;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            {
                List<MenuItem> AuthorizeMenus = await _dbContext.Permisos
                   .Include(X => X.Pantalla)
                   .Where(X => X.TipoUsuarioId == TU.Id)
                   .Select(X => new MenuItem(
                       X.Pantalla,
                       X.Pantalla.Padre,
                       X.RealizaCambios)).ToListAsync();

                var Ppages = await (from P in _dbContext.Pantallas
                                    where AuthorizeMenus.Select(X => X.IdParent).Distinct().Contains(P.Id)
                                    select new MenuItem(P, null, false)).ToListAsync();

                foreach (var P in Ppages)
                {
                    P.SubMenu = (from C in AuthorizeMenus where C.IdParent == P.IdScreen select C).ToList();
                }
                Ppages = Ppages.Where(X => X.SubMenu.Any()).ToList();
                Ppages.AddRange((from C in AuthorizeMenus where C.IdParent == (int?)null select C).ToList());
                Ppages = Ppages.OrderBy(X => X.Order).ToList();

                List<MenuItem> StructuredMenus = Ppages;

                resp = new APIResponse<UserType>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = new UserType(TU, AuthorizeMenus, StructuredMenus),
                };
                return Ok(resp);
            }
        }

        [Authorize]
        [HttpGet("GetSystemScreens")]
        public async Task<IActionResult> GetSystemScreens()
        {
            var screens = await _dbContext.Pantallas
                .Include(X => X.Padre)
                .Where(X => X.PadreId != (Int32?)null)
                .Select(X => new MenuItem(X, X.Padre, false)).ToListAsync();

            respSystemScreens = new APIResponse<IEnumerable<MenuItem>>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = screens
            };
            return Ok(respSystemScreens);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserType UT)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var idUserRequest = jwtAuthenticationManager.readToken(token.ToString());

            #region Validaciones

            // Si no tenemos id de Usuario regresamos Unauthorized
            if (idUserRequest == 0)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Unauthorized");
                return Ok(resp);
            }

            #endregion

            var existUT = await _dbContext.TipoUsuarios.AnyAsync(x => x.TipoDeUsuario == UT.User_Type);
            if (existUT)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:DuplicatedName");
                return Ok(resp);
            }

            try
            {
                TipoUsuario TU = new TipoUsuario()
                {
                    TipoDeUsuario = UT.User_Type,
                    Activo = true
                };

                _dbContext.TipoUsuarios.Add(TU);
                await _dbContext.SaveChangesAsync();

                List<Permiso> perms = (from P in UT.AuthorizeMenus
                                       select new Permiso()
                                       {
                                           PantallaId = P.IdScreen,
                                           TipoUsuarioId = TU.Id,
                                           RealizaCambios = P.fullControl,
                                       }).ToList();

                _dbContext.Permisos.AddRange(perms);
                await _dbContext.SaveChangesAsync();

                LogActividad LA = new()
                {
                    Acción = "Post",
                    Tabla = "TipoDeUsuario",
                    IdRegistro = TU.Id,
                    Elemento = JsonConvert.SerializeObject(UT),
                    Descripcion = "A User Type has been created",
                    FechaHoraCreacion = DateTime.Now,
                    UsuarioCreacion = idUserRequest,
                };
                _dbContext.LogActividads.Add(LA);
                await _dbContext.SaveChangesAsync();

                resp.Succeded = true;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Success");
                resp.Data = new UserType(TU);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                resp.Succeded = false;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError");
                resp.Exception = ex.Message;
            }

            return Ok(resp);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UserType UT)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var idUserRequest = jwtAuthenticationManager.readToken(token.ToString());

            #region Validaciones

            // Si no tenemos id de Usuario regresamos Unauthorized
            if (idUserRequest == 0)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Unauthorized");
                return Ok(resp);
            }

            var TU = await _dbContext.TipoUsuarios.FindAsync(id);
            if (TU == null || id != UT.IdUserType)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            var existUT = await _dbContext.TipoUsuarios.AnyAsync(x => x.Id != UT.IdUserType && x.TipoDeUsuario == UT.User_Type);
            if (existUT)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:DuplicatedName");
                return Ok(resp);
            }

            #endregion

            try
            {
                TU.TipoDeUsuario = UT.User_Type;
                _dbContext.Entry(TU).State = EntityState.Modified;

                var toDel = await _dbContext.Permisos.Where(X => X.TipoUsuarioId == id).ToListAsync();
                _dbContext.Permisos.RemoveRange(toDel);

                List<Permiso> perms = (from P in UT.AuthorizeMenus
                                       select new Permiso()
                                       {
                                           PantallaId = P.IdScreen,
                                           TipoUsuarioId = TU.Id,
                                           RealizaCambios = P.fullControl,
                                       }).ToList();

                _dbContext.Permisos.AddRange(perms);
                await _dbContext.SaveChangesAsync();

                LogActividad LA = new()
                {
                    Acción = "Put",
                    Tabla = "TipoDeUsuario",
                    IdRegistro = TU.Id,
                    Elemento = JsonConvert.SerializeObject(UT),
                    Descripcion = "A User Type has been Updated",
                    FechaHoraCreacion = DateTime.Now,
                    UsuarioCreacion = idUserRequest,
                };
                _dbContext.LogActividads.Add(LA);
                await _dbContext.SaveChangesAsync();

                resp.Succeded = true;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Success");
                resp.Data = new UserType(TU);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                resp.Succeded = false;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError");
                resp.Exception = ex.Message;
            }

            return Ok(resp);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var idUserRequest = jwtAuthenticationManager.readToken(token.ToString());

            #region Validaciones

            // Si no tenemos id de Usuario regresamos Unauthorized
            if (idUserRequest == 0)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Unauthorized");
                return Ok(resp);
            }

            #endregion

            var TU = await _dbContext.TipoUsuarios.FindAsync(id);
            if (TU == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            TU.Activo = !TU.Activo;

            _dbContext.Entry(TU).State = EntityState.Modified;

            LogActividad LA = new LogActividad()
            {
                Acción = "Delete",
                Tabla = "Tipo Usuario",
                IdRegistro = TU.Id,
                Elemento = JsonConvert.SerializeObject(TU),
                Descripcion = String.Format("UserType {0} has been {1}", id, (TU.Activo ? "enabled" : "disabled")),
                FechaHoraCreacion = DateTime.Now,
                UsuarioCreacion = idUserRequest,
            };
            _dbContext.LogActividads.Add(LA);

            try
            {
                await _dbContext.SaveChangesAsync();
                resp.Succeded = true;
                resp.Message = TU.Activo ?
                    _configuration.GetValue<String>("UserMessages:Generic:RecordEnabled") :
                    _configuration.GetValue<String>("UserMessages:Generic:RecordDisabled");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                resp.Succeded = false;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError");
                resp.Exception = ex.Message;
            }

            return Ok(resp);
        }


    }
}
