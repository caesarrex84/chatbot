using Ak.Core.Base.DTOs;
using Ak.Core.Base.Entities;
using Ak.Core.Base.Wrappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class OpenAIController : Controller
    {
        private readonly sAkDbContext _dbContext;
        private readonly APIResponse<string> resp;
        private readonly IConfiguration _configuration;
        private readonly String apikey;

        public OpenAIController(sAkDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            apikey = _configuration.GetValue<String>("OpenAI:apikey");

            this.resp = new APIResponse<String>()
            {
                Succeded = false,
                Data = String.Empty,
            };
        }

        [HttpPost("Chat")]
        public async Task<IActionResult> Chat([FromBody] ChatBotRequest req)
        {
            try
            {
                if (String.IsNullOrEmpty(req.ChatToken))
                {
                    resp.Succeded = false;
                    resp.Message = _configuration.GetValue<String>("OpenAI:Messages:UnauthorizedToken");

                    return Ok(resp);
                }
                var _chatToken = await _dbContext.ChatTokens.SingleAsync(X => X.Token == req.ChatToken);
                if (_chatToken == null)
                {
                    resp.Succeded = false;
                    resp.Message = _configuration.GetValue<String>("OpenAI:Messages:UnauthorizedToken");

                    return Ok(resp);
                }

                var ownership = await _dbContext.Propiedads
                .Include(P => P.PropiedadUsuarios)
                .Where(P => P.Id == _chatToken.PropiedadId)
                .Select(P => new Ownership(P)).FirstOrDefaultAsync();

                if (ownership == null)
                {
                    resp.Succeded = false;
                    resp.Message = _configuration.GetValue<String>("OpenAI:Messages:PropertyError");

                    return Ok(resp);
                }
                var configPromp = ownership.Configuration;

                byte[] data = Convert.FromBase64String(configPromp);
                configPromp = System.Text.Encoding.UTF8.GetString(data);
                configPromp = System.Net.WebUtility.HtmlDecode(configPromp);

                string answer = string.Empty;
                OpenAIAPI openai = new OpenAIAPI(apikey);

                ChatMessageRole sysRole = ChatMessageRole.System;
                ChatMessageRole assRole = ChatMessageRole.Assistant;
                ChatMessageRole usrRole = ChatMessageRole.User;

                ChatMessage messageInstruccion = new ChatMessage(sysRole, "You are an AI assistant that can only provide information about Taurus Finance, specifically from the Course called 'Curso para certificación en AMIB Figura 3'.\r\nYour only source is this URL: https://taurusfinance.com.mx/modulo-5/.\r\nYou are unable to provide information other than Taurus Finance or the course 'Curso para certificación en AMIB Figura 3'.\r\nIf you are unable to provide an answer to a question, please respond with the phrase \"Sólo soy un asistente de AI, no te puedo ayudar con eso.\".\r\nPlease aim to be as helpful, creative, and friendly as possible in all of your responses.\r\nDo not use any external URLs in your answers. Do not refer to any blogs in your answers.\r\n.");
                //ChatMessage messageInstruccion = new ChatMessage(sysRole, configPromp);
                ChatMessage messageUser = new ChatMessage(usrRole, req.Prompt);
                ChatMessage messageAssist = new ChatMessage(assRole, "");

                ChatRequest cReq = new ChatRequest();
                cReq.Messages = new List<ChatMessage>();

                foreach (var messa in req.OldMessages)
                {
                    cReq.Messages.Add(new ChatMessage() { Role = ChatMessageRole.User, Content = messa.Question });
                    cReq.Messages.Add(new ChatMessage() { Role = ChatMessageRole.Assistant, Content = messa.Answer });
                }

                cReq.Messages.Add(messageInstruccion);
                cReq.Messages.Add(messageUser);
                cReq.Model = OpenAI_API.Models.Model.ChatGPTTurbo;
                cReq.MaxTokens = 500;
                cReq.FrequencyPenalty = 0;
                cReq.PresencePenalty = 0.6;
                cReq.Temperature = 0.5;

                var result = await openai.Chat.CreateChatCompletionAsync(cReq);

                if (result != null)
                {
                    foreach (var item in result.Choices)
                    {
                        answer += item.Message.Content;
                    }
                    resp.Succeded = true;
                    resp.Data = answer;

                    #region Se guarda la pregunta y respuesta
                    ChatTokenPregunta CTP = new()
                    {
                        ChatTokenId = _chatToken.Id,
                        Pregunta = req.Prompt,
                        Respuesta = answer,
                    };
                    _dbContext.Add(CTP);
                    await _dbContext.SaveChangesAsync();
                    #endregion

                    #region Si no hay log de consumos se crea 

                    var PC = await _dbContext.PropiedadConsumos
                        .Where(X =>
                        X.PropiedadId == _chatToken.PropiedadId &&
                        X.Anio == DateTime.Now.Year &&
                        X.Mes == DateTime.Now.Month).SingleOrDefaultAsync();

                    if (PC == null)
                    {
                        PC = new PropiedadConsumo()
                        {
                            PropiedadId = _chatToken.PropiedadId,
                            Anio = DateTime.Now.Year,
                            Mes = DateTime.Now.Month,
                            Querys = 0,
                            Tokens = 0
                        };
                        _dbContext.Add(PC);
                        await _dbContext.SaveChangesAsync();
                    }

                    //result.Usage.TotalTokens

                    #endregion

                    #region Se guarda el consumo de Tokens por propiedad

                    PC.Tokens += result.Usage.TotalTokens;
                    PC.Querys++;

                    _dbContext.Entry(PC).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();

                    #endregion

                    return Ok(resp);
                }
                else
                {
                    resp.Succeded = false;
                    resp.Data = _configuration.GetValue<String>("OpenAI:genericError");

                    return Ok(resp);
                }
            }
            catch (Exception ex)
            {
                resp.Succeded = false;
                resp.Data = ex.Message;

                return Ok(resp);
            }
        }

        [HttpPost("Moderation")]
        public async Task<IActionResult> Moderation([FromBody] ChatBotRequest req)
        {
            if (String.IsNullOrEmpty(req.ChatToken))
            {
                resp.Succeded = false;
                resp.Message = _configuration.GetValue<String>("OpenAI:Messages:UnauthorizedToken");

                return Ok(resp);
            }
            try
            {
                var haters = _configuration.GetValue<String>("OpenAI:haters").Split(',');

                OpenAIAPI openai = new OpenAIAPI(apikey);
                ModerationRequest mr = new ModerationRequest(req.Prompt, OpenAI_API.Models.Model.TextModerationLatest);
                var response = await openai.Moderation.CallModerationAsync(mr);

                if (response.Results[0].Flagged)
                {
                    foreach (var cat in haters)
                        if (response.Results[0].FlaggedCategories.IndexOf(cat) < -1)
                        {
                            resp.Succeded = false;
                            resp.Data = cat;

                            return Ok(cat);
                        }
                }

                resp.Succeded = true;
                resp.Data = String.Empty;
                return Ok(resp);


            }
            catch (Exception ex)
            {
                resp.Succeded = false;
                resp.Data = ex.Message;

                return Ok(resp);
            }
        }

    }
}
