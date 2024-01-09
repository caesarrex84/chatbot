using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Ak.Core.Base.Entities;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Ak.Core.Base.Manager;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ak.Core.Base.DTOs;
using Ak.Core.Base.Wrappers;
using Newtonsoft.Json;

namespace Ak.Core.Base.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParametersController : ControllerBase
    {
        private readonly sAkDbContext _dbContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;
        private readonly IConfiguration _configuration;
        private APIResponse<Parameter> resp;
        private APIResponse<IEnumerable<Parameter>> respList;

        public ParametersController(sAkDbContext dbContext, JwtAuthenticationManager jwtAuthenticationManager, IConfiguration configuration)
        {
            this._dbContext = dbContext;
            this.jwtAuthenticationManager = jwtAuthenticationManager;
            _configuration = configuration;
            resp = new APIResponse<Parameter>()
            {
                Succeded = false,
                Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError"),
            };
            respList = new APIResponse<IEnumerable<Parameter>>()
            {
                Succeded = false,
                Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError"),
            };
        }

        // GET: api/<Parameters>
        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var parameters = await (from P in _dbContext.Parametros select new Parameter(P)).ToListAsync();

            respList = new APIResponse<IEnumerable<Parameter>>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = parameters
            };
            return Ok(respList);
        }

        // GET api/<Parameters>/5
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var parameter = await (from P in _dbContext.Parametros
                                   where P.IdParametro == id
                                   select new Parameter(P)).SingleOrDefaultAsync();

            if (parameter == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            {
                resp = new APIResponse<Parameter>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = parameter
                };
            }

            return Ok(resp);
        }

        //// POST api/<Parameters>
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //#INFO - Los Parametros no se pueden crear desde Front
        //}

        // PUT api/<Parameters>/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Parameter parameter)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var idUser = jwtAuthenticationManager.readToken(token.ToString());

            #region Validaciones

            // Si no tenemos id de Usuario regresamos Unauthorized
            if (idUser == 0)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Unauthorized");
                return Ok(resp);
            }
            // Si el objeto viene vacío o el id no coincide
            if (parameter == null || parameter.IdParameter != id)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            #endregion

            var P = await _dbContext.Parametros.SingleOrDefaultAsync(X => X.IdParametro == id);
            if (P == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            try
            {
                P.ValorParametro = parameter.Value;
                _dbContext.Entry(P).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                LogActividad LA = new()
                {
                    Acción = "Put",
                    Tabla = "Parametro",
                    IdRegistro = P.IdParametro,
                    Elemento = JsonConvert.SerializeObject(P),
                    Descripcion = "The ownership has been updated",
                    FechaHoraCreacion = DateTime.Now,
                    UsuarioCreacion = idUser,
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

        //// DELETE api/<Parameters>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //#INFO - Los Parametros no se pueden eliminar desde Front
        //}
    }
}
