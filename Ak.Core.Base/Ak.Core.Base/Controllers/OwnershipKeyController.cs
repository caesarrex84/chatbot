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
using System.Text.RegularExpressions;

namespace Ak.Core.Base.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class OwnershipKeyController : Controller
    {
        private readonly sAkDbContext _dbContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;
        private readonly IConfiguration _configuration;
        private APIResponse<OwnershipKey> resp;
        private APIResponse<IEnumerable<OwnershipKey>> respList;
        private APIResponse<Ownership> respPublic;

        public OwnershipKeyController(sAkDbContext dbContext, JwtAuthenticationManager jwtAuthenticationManager, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            this.jwtAuthenticationManager = jwtAuthenticationManager;

            this.resp = new APIResponse<OwnershipKey>()
            {
                Succeded = false,
                Data = new OwnershipKey(),
            };
            this.respList = new APIResponse<IEnumerable<OwnershipKey>>()
            {
                Succeded = false,
                Data = new List<OwnershipKey>(),
            };
            this.respPublic = new APIResponse<Ownership>()
            {
                Succeded = false,
                Data = new Ownership(),
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll(Int32 status = 2, Int32 idProperty = 0)
        {
            var ownerships = idProperty == 0 ?
                await _dbContext.PropiedadLlaves
                .Select(PL => new OwnershipKey(PL)).ToListAsync() :
                await _dbContext.PropiedadLlaves.Where(PL => PL.PropiedadId == idProperty)
                .Select(PL => new OwnershipKey(PL)).ToListAsync();

            if (status != 2)
                ownerships = ownerships.Where(X => X.Active == (status == 0)).ToList();

            respList = new APIResponse<IEnumerable<OwnershipKey>>()
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
            var PL = await _dbContext.PropiedadLlaves.FindAsync(id);

            if (PL == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            {
                resp = new APIResponse<OwnershipKey>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = new OwnershipKey(PL),
                };
                return Ok(resp);
            }

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OwnershipKey oKey)
        {
            var P = await _dbContext.Propiedads
                .Include(P => P.PropiedadLlaves)
                .Where(P => P.Id == oKey.OwnershipId).SingleOrDefaultAsync();

            if (P == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            {
                foreach (var LL in P.PropiedadLlaves)
                {
                    LL.Activa = false;
                    _dbContext.Entry(LL).State = EntityState.Modified;
                }

                DateTime now = DateTime.Now;
                String NewKey =
                    P.NombrePropiedad + "_" +
                    oKey.Validity.ToShortDateString() + "_" +
                    APITools.getRamdomAlphanumericCode(15);
                NewKey = APITools.encrypt(NewKey);
                NewKey = Regex.Replace(NewKey, "[^a-zA-Z0-9 -]", "");

                PropiedadLlave PL = new()
                {
                    PropiedadId = oKey.OwnershipId,
                    Vigencia = oKey.Validity,
                    ApiKey = NewKey,
                    FechaCreacion = now,
                    Activa = true
                };

                _dbContext.PropiedadLlaves.Add(PL);
                await _dbContext.SaveChangesAsync();

                resp = new APIResponse<OwnershipKey>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = new OwnershipKey(PL),
                };
                return Ok(resp);
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] OwnershipKey oKey)
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
            // Si el Id de URL y de objeto es diferente
            if (id != oKey.Id)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Unauthorized");
                return Ok(resp);
            }
            #endregion

            var PL = await _dbContext.PropiedadLlaves.SingleOrDefaultAsync(X => X.Id == id);
            if (PL == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            try
            {
                PL.Vigencia = oKey.Validity;
                PL.Activa = true;
                _dbContext.Entry(PL).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                LogActividad LA = new()
                {
                    Acción = "Put",
                    Tabla = "PropiedadLlaves",
                    IdRegistro = PL.Id,
                    Elemento = JsonConvert.SerializeObject(oKey),
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

            var PL = await _dbContext.PropiedadLlaves.SingleOrDefaultAsync(X => X.Id == id);
            if (PL == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            try
            {
                PL.Activa = false;
                _dbContext.Entry(PL).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                LogActividad LA = new()
                {
                    Acción = "Delete",
                    Tabla = "PropiedadLlaves",
                    IdRegistro = PL.Id,
                    Elemento = String.Empty,
                    Descripcion = "The ownership Key has been deleted",
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

        [HttpGet("ValidateApiKey/{ApiKey}/{WebSite}")]
        public async Task<IActionResult> ValidateApiKey(string ApiKey, string WebSite)
        {
            var PL = await _dbContext.PropiedadLlaves
                .Include(P => P.Propiedad)
                .ThenInclude(P => P.PropiedadPregunta)
                .Where(P => P.ApiKey == ApiKey && P.Propiedad.WebSite == WebSite)
                .SingleOrDefaultAsync();

            if (PL == null)
            {
                respPublic.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(respPublic);
            }
            else
            {
                var _key = new OwnershipKey(PL);
                if (_key.ValidKey)
                {
                    respPublic.Succeded = true;
                    respPublic.Data = new Ownership(PL.Propiedad);
                    respPublic.Message = _configuration.GetValue<String>("ClientsMessage:ApiKeyMessages:ApiKeyValid");
                }
                else
                {
                    respPublic.Message = _configuration.GetValue<String>("ClientsMessage:ApiKeyMessages:ApiKeyInvalid");
                }

                return Ok(respPublic);
            }

        }

    }
}
