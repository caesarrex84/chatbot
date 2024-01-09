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
    public class ChatSumaryController : Controller
    {
        private readonly sAkDbContext _dbContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;
        private readonly IConfiguration _configuration;
        private APIResponse<string> respString;
        private APIResponse<ChatSumary> resp;
        private APIResponse<IEnumerable<ChatSumary>> respList;

        public ChatSumaryController(sAkDbContext dbContext, JwtAuthenticationManager jwtAuthenticationManager, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            this.jwtAuthenticationManager = jwtAuthenticationManager;

            this.respString = new APIResponse<string>()
            {
                Succeded = false
            };
            this.respList = new APIResponse<IEnumerable<ChatSumary>>()
            {
                Succeded = false,
                Data = new List<ChatSumary>()
            };
            this.resp = new APIResponse<ChatSumary>()
            {
                Succeded = false,
                Data = new ChatSumary()
            };
        }

        [HttpGet("CreateChatToken")]
        public async Task<IActionResult> CreateChatToken(Int32 idPropiedad)
        {
            try
            {
                if (idPropiedad == 0)
                {
                    respString.Succeded = false;
                    respString.Message = _configuration.GetValue<String>("OpenAI:Messages:PropertyError");

                    return Ok(respString);
                }

                DateTime _DT = DateTime.Now;
                String _token = APITools.encrypt(_DT.Ticks.ToString());
                _token = Regex.Replace(_token, "[^a-zA-Z0-9 -]", "");

                ChatToken CT = new ChatToken()
                {
                    PropiedadId = idPropiedad,
                    Token = _token,
                    FechaCreacion = _DT
                };

                _dbContext.ChatTokens.Add(CT);

                await _dbContext.SaveChangesAsync();

                respString.Succeded = true;
                respString.Data = _token;
                respString.Message = _configuration.GetValue<String>("OpenAI:Messages:Success");

                return Ok(respString);

            }
            catch (Exception ex)
            {
                respString.Succeded = false;
                respString.Data = ex.Message;

                return Ok(respString);
            }
        }


        [HttpPost("SaveChatData")]
        public async Task<IActionResult> SaveChatData([FromBody] ChatSumary chatSumary)
        {
            try
            {
                var CT = await _dbContext.ChatTokens.
                    SingleOrDefaultAsync(X => X.Token == chatSumary.ChatToken);

                if (CT == null)
                {
                    respString.Message = _configuration.GetValue<String>("UserMessages:Generic:Unauthorized");
                    return Ok(respString);
                }

                CT.Nombre = chatSumary.Name;
                CT.Telefono = chatSumary.Phone;
                CT.Correo = chatSumary.Email;

                _dbContext.Entry(CT).State = EntityState.Modified;

                List<ChatTokenDato> adicionales =
                    (from X in chatSumary.AditionalData
                     select new ChatTokenDato()
                     {
                         ChatTokenId = CT.Id,
                         Etiqueta = X.Label,
                         Dato = X.Data
                     }).ToList();

                _dbContext.ChatTokenDatos.AddRange(adicionales);
                await _dbContext.SaveChangesAsync();

                respString.Succeded = true;
                respString.Message = _configuration.GetValue<String>("OpenAI:Messages:Success");

                return Ok(respString);
            }
            catch (Exception ex)
            {
                respString.Succeded = false;
                respString.Data = ex.Message;

                return Ok(respString);
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get(Int32 idPropiedad, DateTime FechaInicial, DateTime FechaFinal)
        {
            if (idPropiedad == 0)
            {
                respString.Succeded = false;
                respString.Message = _configuration.GetValue<String>("OpenAI:Messages:PropertyError");

                return Ok(respString);
            }

            var chatsList = await _dbContext.ChatTokens
                .Include(C => C.ChatTokenDatos)
                .Include(C => C.ChatTokenPregunta)
                .Where(C => C.PropiedadId == idPropiedad &&
                (FechaInicial.Date <= C.FechaCreacion.Date && FechaFinal.Date >= C.FechaCreacion.Date))
                .Select(C => new ChatSumary(C)).ToListAsync();

            respList = new APIResponse<IEnumerable<ChatSumary>>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = chatsList
            };
            return Ok(respList);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var chat = await _dbContext.ChatTokens.FindAsync(id);

            if (chat == null)
            {
                respString.Succeded = false;
                respString.Message = _configuration.GetValue<String>("OpenAI:Messages:PropertyError");

                return Ok(respString);
            }

            resp = new APIResponse<ChatSumary>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = new ChatSumary(chat)
            };

            return Ok(resp);
        }

        [HttpGet("GetMessagesFromToken/{chatToken}")]
        public async Task<IActionResult> GetMessagesFromToken(string chatToken)
        {
            var chat = await _dbContext.ChatTokens
                .Include(C => C.ChatTokenPregunta)
                .Where(C => C.Token == chatToken).SingleOrDefaultAsync();

            if (chat == null)
            {
                respString.Succeded = false;
                respString.Message = _configuration.GetValue<String>("OpenAI:Messages:PropertyError");

                return Ok(respString);
            }

            resp = new APIResponse<ChatSumary>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = new ChatSumary(chat)
            };

            return Ok(resp);
        }

    }
}
