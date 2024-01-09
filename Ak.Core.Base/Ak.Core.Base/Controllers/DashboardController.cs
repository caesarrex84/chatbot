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
    public class DashboardController : Controller
    {
        private readonly sAkDbContext _dbContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;
        private readonly IConfiguration _configuration;
        private APIResponse<DashboardDTO> resp;

        public DashboardController(sAkDbContext dbContext, JwtAuthenticationManager jwtAuthenticationManager, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            this.jwtAuthenticationManager = jwtAuthenticationManager;

            this.resp = new APIResponse<DashboardDTO>()
            {
                Succeded = false,
                Data = new DashboardDTO()
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get(Int32 idPropiedad)
        {
            if (idPropiedad == 0)
            {
                resp.Succeded = false;
                resp.Message = _configuration.GetValue<String>("OpenAI:Messages:PropertyError");

                return Ok(resp);
            }

            DashboardDTO data = new DashboardDTO();

            var datos = await _dbContext.ChatTokens
                .Include(C => C.ChatTokenDatos)
                .Include(C => C.ChatTokenPregunta)
                .Where(C => C.PropiedadId == idPropiedad && C.FechaCreacion.Year == DateTime.Now.Year)
                .ToListAsync();

            var _months = (from d in datos
                           group d by new
                           {
                               Month = d.FechaCreacion.Month
                           } into g
                           select new DashboardItem()
                           {
                               Label = APITools.monthName(g.Key.Month),
                               Value = g.Count(),
                           }).ToList();
            foreach (var M in data.Months)
                if (_months.Any(X => X.Label == M.Label))
                    M.Value = _months.Single(X => X.Label == M.Label).Value;

            var _currentMonth = (from d in datos.Where(X => X.FechaCreacion.Month == DateTime.Now.Month)
                                 group d by new
                                 {
                                     Day = d.FechaCreacion.Day
                                 } into g
                                 select new DashboardItem()
                                 {
                                     Label = g.Key.Day.ToString(),
                                     Value = g.Count(),
                                 }).ToList();

            foreach (var D in data.CurrentMonth)
                if (_currentMonth.Any(X => X.Label == D.Label))
                    D.Value = _currentMonth.Single(X => X.Label == D.Label).Value;

            data.CurrentMonthContact = (from d in datos.Where(X => X.FechaCreacion.Month == DateTime.Now.Month)
                                        group d by new
                                        {
                                            ContactInfo = d.ChatTokenDatos.Any()
                                        } into g
                                        select new DashboardItem()
                                        {
                                            Label = g.Key.ContactInfo ? "Sí" : "No",
                                            Value = g.Count(),
                                        }).ToList();

            var _consumos = await _dbContext.PropiedadConsumos
                .Where(C => C.PropiedadId == idPropiedad && C.Anio == DateTime.Now.Year).ToListAsync();

            var _tokens = (from C in _consumos
                           select new DashboardItem()
                           {
                               Label = APITools.monthName(C.Mes),
                               Value = C.Tokens,
                           }).ToList();

            var _querys = (from C in _consumos
                           select new DashboardItem()
                           {
                               Label = APITools.monthName(C.Mes),
                               Value = C.Querys,
                           }).ToList();

            foreach (var D in data.Tokens)
                if (_tokens.Any(X => X.Label == D.Label))
                    D.Value = _tokens.Single(X => X.Label == D.Label).Value;

            foreach (var D in data.Querys)
                if (_querys.Any(X => X.Label == D.Label))
                    D.Value = _querys.Single(X => X.Label == D.Label).Value;

            data.CurrentMontQuerys = data.Querys.Single(X => X.Label == APITools.monthName(DateTime.Now.Month)).Value;
            data.CurrentMontTokens = data.Tokens.Single(X => X.Label == APITools.monthName(DateTime.Now.Month)).Value;

            resp = new APIResponse<DashboardDTO>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = data
            };
            return Ok(resp);
        }

    }

}
