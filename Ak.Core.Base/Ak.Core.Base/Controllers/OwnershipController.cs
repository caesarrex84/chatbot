using Ak.Core.Base.DTOs;
using Ak.Core.Base.Entities;
using Ak.Core.Base.Manager;
using Ak.Core.Base.Wrappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Completions;
using OpenAI_API.Moderation;
using System;
using System.Text.Json;

namespace Ak.Core.Base.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnershipController : Controller
    {
        private readonly sAkDbContext _dbContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;
        private readonly IConfiguration _configuration;
        private APIResponse<Ownership> resp;
        private APIResponse<IEnumerable<Ownership>> respList;

        public OwnershipController(sAkDbContext dbContext, JwtAuthenticationManager jwtAuthenticationManager, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            this.jwtAuthenticationManager = jwtAuthenticationManager;

            this.resp = new APIResponse<Ownership>()
            {
                Succeded = false,
                Data = new Ownership(),
            };
            this.respList = new APIResponse<IEnumerable<Ownership>>()
            {
                Succeded = false,
                Data = new List<Ownership>(),
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll(Int32 status = 2)
        {
            var ownerships = await _dbContext.Propiedads
                .Include(P => P.PropiedadUsuarios)
                .Select(P => new Ownership(P)).ToListAsync();

            if (status != 2)
                ownerships = ownerships.Where(X => X.Active == (status == 0)).ToList();

            respList = new APIResponse<IEnumerable<Ownership>>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = ownerships
            };
            return Ok(respList);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var ownership = await _dbContext.Propiedads
                .Include(P => P.PropiedadUsuarios)
                .Include(P => P.PropiedadPregunta)
                .Where(P => P.Id == id)
                .Select(P => new Ownership(P)).FirstOrDefaultAsync();

            if (ownership == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            
            {
                resp = new APIResponse<Ownership>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = ownership
                };
            }

            return Ok(resp);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Ownership ownership)
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

            var existO = await _dbContext.Propiedads.AnyAsync(x => x.NombrePropiedad == ownership.Name);
            if (existO)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:DuplicatedName");
                return Ok(resp);
            }

            #endregion

            try
            {
                Propiedad P = new()
                {
                    NombrePropiedad = ownership.Name,
                    WebSite = ownership.WebSite,
                    Configuracion = ownership.Configuration,
                    SaludoInicial = ownership.InitialMessage,
                    SolicitarDatos = ownership.RequestInfo,
                    SolicitarDatosParaIniciar = ownership.RequestInfoInAdvance,
                    FechaCreacion = DateTime.Now,
             //       NumeroToken = ownership.TokenAmount,
                    Activo = true,
                };

                _dbContext.Propiedads.Add(P);
                await _dbContext.SaveChangesAsync();

                if (ownership.AditionalQuestions.Any())
                {
                    List<PropiedadPreguntum> questions = (from Q in ownership.AditionalQuestions
                                                          select new PropiedadPreguntum()
                                                          {
                                                              PropiedadId = P.Id,
                                                              Pregunta = Q,
                                                          }).ToList();
                    _dbContext.PropiedadPregunta.AddRange(questions);
                    await _dbContext.SaveChangesAsync();
                }

                LogActividad LA = new()
                {
                    Acción = "Post",
                    Tabla = "Propiedad",
                    IdRegistro = P.Id,
                    Elemento = JsonConvert.SerializeObject(P),
                    Descripcion = "A ownership has been created",
                    FechaHoraCreacion = DateTime.Now,
                    UsuarioCreacion = idUserRequest,
                };
                _dbContext.LogActividads.Add(LA);
                await _dbContext.SaveChangesAsync();

                resp.Succeded = true;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Success");
                resp.Data = new Ownership(P);
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
        public async Task<IActionResult> Put(int id, [FromBody] Ownership ownership)
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
            // Si el objeto viene vacío o el id no coincide
            if (ownership == null || ownership.Id != id)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            #endregion

            var P = await _dbContext.Propiedads
                .Include(P => P.PropiedadPregunta)
                .Where(P => P.Id == id)
                .SingleOrDefaultAsync();

            if (P == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            try
            {
                P.NombrePropiedad = ownership.Name;
                P.WebSite = ownership.WebSite;
                P.Configuracion = ownership.Configuration;
                P.SolicitarDatos = ownership.RequestInfo;
                P.SolicitarDatosParaIniciar = ownership.RequestInfoInAdvance;
                P.Activo = true;
        //        P.NumeroToken = ownership.TokenAmount;
                _dbContext.Entry(P).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                LogActividad LA = new()
                {
                    Acción = "Put",
                    Tabla = "Propiedad",
                    IdRegistro = P.Id,
                    Elemento = JsonConvert.SerializeObject(ownership),
                    Descripcion = "The ownership has been updated",
                    FechaHoraCreacion = DateTime.Now,
                    UsuarioCreacion = idUserRequest,
                };
                _dbContext.LogActividads.Add(LA);
                await _dbContext.SaveChangesAsync();


                resp.Succeded = true;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Success");
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
        [HttpPut("Ownerships/{id}")]
        public async Task<IActionResult> PutOwnerships(int id, [FromBody] Ownership ownership)
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
            // Si el objeto viene vacío o el id no coincide
            if (ownership == null || ownership.Id != id)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            #endregion

            var P = await _dbContext.Propiedads
                .Include(P => P.PropiedadPregunta)
                .Where(P => P.Id == id)
                .SingleOrDefaultAsync();

            if (P == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            try
            {
                P.NombrePropiedad = ownership.Name;
                P.WebSite = ownership.WebSite;
                P.Configuracion = ownership.Configuration;
                P.SaludoInicial = ownership.InitialMessage;
                P.SolicitarDatos = ownership.RequestInfo;
              //  P.NumeroToken = ownership.TokenAmount;
                P.SolicitarDatosParaIniciar = ownership.RequestInfoInAdvance;
                P.Activo = true;
                _dbContext.Entry(P).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                if (P.PropiedadPregunta.Any())
                {
                    _dbContext.PropiedadPregunta.RemoveRange(P.PropiedadPregunta);
                    await _dbContext.SaveChangesAsync();
                }

                if (ownership.AditionalQuestions.Any())
                {
                    List<PropiedadPreguntum> questions = (from Q in ownership.AditionalQuestions
                                                          select new PropiedadPreguntum()
                                                          {
                                                              PropiedadId = P.Id,
                                                              Pregunta = Q,
                                                          }).ToList();
                    _dbContext.PropiedadPregunta.AddRange(questions);
                    await _dbContext.SaveChangesAsync();
                }

                LogActividad LA = new()
                {
                    Acción = "Put",
                    Tabla = "Propiedad",
                    IdRegistro = P.Id,
                    Elemento = JsonConvert.SerializeObject(ownership),
                    Descripcion = "The ownership has been updated",
                    FechaHoraCreacion = DateTime.Now,
                    UsuarioCreacion = idUserRequest,
                };
                _dbContext.LogActividads.Add(LA);
                await _dbContext.SaveChangesAsync();


                resp.Succeded = true;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Success");
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

            var P = await _dbContext.Propiedads.FindAsync(id);
            if (P == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            P.Activo = !P.Activo;

            _dbContext.Entry(P).State = EntityState.Modified;

            LogActividad LA = new()
            {
                Acción = "Delete",
                Tabla = "Propiedad",
                IdRegistro = P.Id,
                Elemento = JsonConvert.SerializeObject(P),
                Descripcion = String.Format("Ownership {0} has been {1}", id, (P.Activo ? "enabled" : "disabled")),
                FechaHoraCreacion = DateTime.Now,
                UsuarioCreacion = idUserRequest,
            };
            _dbContext.LogActividads.Add(LA);

            try
            {
                await _dbContext.SaveChangesAsync();
                resp.Succeded = true;
                resp.Message = P.Activo ?
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

        [Authorize]
        [HttpGet("GetByUserId")]
        public async Task<IActionResult> GetByUserId(int idUser)
        {
            var ownership = await _dbContext.PropiedadUsuarios
                .Include(P => P.Propiedad)
                .Where(P => P.UsuarioId == idUser)
               .Select(P => new Ownership(P.Propiedad)).ToListAsync();

            if (ownership == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            {
                respList = new APIResponse<IEnumerable<Ownership>>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = ownership
                };
            }

            return Ok(respList);
        }

        [Authorize]
        [HttpPut("AddPropertyToUser")]
        public async Task<IActionResult> AddPropertyToUser(int idUser, int idOwnership)
        {
            var PU = await _dbContext.PropiedadUsuarios
                .SingleOrDefaultAsync(P => P.UsuarioId == idUser && P.PropiedadId == idOwnership);

            if (PU != null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:DuplicatedRecord");
                return Ok(resp);
            }
            else
            {
                PU = new()
                {
                    PropiedadId = idOwnership,
                    UsuarioId = idUser,
                };
                _dbContext.PropiedadUsuarios.Add(PU);
                await _dbContext.SaveChangesAsync();

                resp = new APIResponse<Ownership>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success")
                };
            }

            return Ok(resp);
        }

        [Authorize]
        [HttpPut("RemovePropertyFromUser")]
        public async Task<IActionResult> RemovePropertyToUser(int idUser, int idOwnership)
        {
            var PU = await _dbContext.PropiedadUsuarios
                .SingleOrDefaultAsync(P => P.UsuarioId == idUser && P.PropiedadId == idOwnership);

            if (PU == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            {
                _dbContext.PropiedadUsuarios.Remove(PU);
                await _dbContext.SaveChangesAsync();

                resp = new APIResponse<Ownership>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success")
                };
            }

            return Ok(resp);
        }

    }
}
