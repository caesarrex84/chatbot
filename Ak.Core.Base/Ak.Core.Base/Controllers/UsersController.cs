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
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Hosting;
using System.Net.Mail;
using System.Net;
using System.Xml.Linq;
using static System.Collections.Specialized.BitVector32;
using System.IO;
using System.Net.Mime;
using System.Text.RegularExpressions;

namespace Ak.Core.Base.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly sAkDbContext _dbContext;
        private readonly JwtAuthenticationManager jwtAuthenticationManager;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private APIResponse<User> resp;
        private APIResponse<IEnumerable<User>> respList;

        public UsersController(sAkDbContext dbContext, JwtAuthenticationManager jwtAuthenticationManager, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            this._dbContext = dbContext;
            this.jwtAuthenticationManager = jwtAuthenticationManager;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;

            resp = new APIResponse<User>()
            {
                Succeded = false,
                Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError"),
            };
            respList = new APIResponse<IEnumerable<User>>()
            {
                Succeded = false,
                Message = _configuration.GetValue<String>("UserMessages:Generic:GenericError"),
            };
        }

        [AllowAnonymous]
        [HttpPost("Authentication")]
        public async Task<IActionResult> Authentication([FromBody] User user)
        {
            var U = await _dbContext.Usuarios
                .SingleOrDefaultAsync(X => X.Correo == user.Email && X.Contrasena == APITools.encrypt(user.Password));
            if (U == null)
            {
                return Unauthorized(resp);
            }

            var UT = await _dbContext.TipoUsuarios.FindAsync(U.TipoUsuarioId);
            var token = jwtAuthenticationManager.generateToken(U.Id);
            if (token == null || UT == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Authentication:UserNotFound");
                return Unauthorized(resp);
            }
            else
            {
                #region Typo de Usuario

                List<MenuItem> AuthorizeMenus = await _dbContext.Permisos
                    .Include(X => X.Pantalla)
                    .Where(X => X.TipoUsuarioId == UT.Id)
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
                var usr = new User(U);
                usr.UserType = new UserType(UT, AuthorizeMenus, StructuredMenus);

                #endregion

                resp = new APIResponse<User>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = usr,
                    JWToken = token,
                };
            }

            return Ok(resp);
        }

        [Authorize]
        [HttpGet("ValidateCurrentUser")]
        public async Task<IActionResult> ValidateCurrentUser()
        {
            var token = HttpContext.Request.Headers["Authorization"];
            if (String.IsNullOrEmpty(token))
            {
                return Unauthorized(resp);
            }
            var idUserRequest = jwtAuthenticationManager.readToken(token.ToString());
            var U = await _dbContext.Usuarios.FindAsync(idUserRequest);
            var UT = await _dbContext.TipoUsuarios.FindAsync(U.TipoUsuarioId);
            if (U == null)
            {
                return Unauthorized(resp);
            }
            else
            {
                #region Typo de Usuario

                List<MenuItem> AuthorizeMenus = await _dbContext.Permisos
                   .Include(X => X.Pantalla)
                   .Where(X => X.TipoUsuarioId == UT.Id)
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
                var usr = new User(U);
                usr.UserType = new UserType(UT, AuthorizeMenus, StructuredMenus);

                #endregion

                resp = new APIResponse<User>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Authentication:TokenActive"),
                    Data = usr,
                    JWToken = token,
                };
            }

            return Ok(resp);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll(Int32 status = 2)
        {
            var users = await _dbContext.Usuarios
                .Include(U => U.TipoUsuario)
                .Where(U => U.Id > 0)
                .Select(U => new User(U, U.TipoUsuario)).ToListAsync();

            if (status != 2)
                users = users.Where(X => X.Active == (status == 0)).ToList();

            respList = new APIResponse<IEnumerable<User>>()
            {
                Succeded = true,
                Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                Data = users
            };
            return Ok(respList);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _dbContext.Usuarios
               .Include(U => U.TipoUsuario)
               .Where(U => U.Id == id)
               .Select(U => new User(U, U.TipoUsuario)).SingleOrDefaultAsync();

            if (user == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }
            else
            {
                resp = new APIResponse<User>()
                {
                    Succeded = true,
                    Message = _configuration.GetValue<String>("UserMessages:Generic:Success"),
                    Data = user
                };
            }

            return Ok(resp);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User user)
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

            var existU = await _dbContext.Usuarios.AnyAsync(x => x.Correo == user.Email);
            if (existU)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:DuplicatedEmail");
                return Ok(resp);
            }

            #endregion

            try
            {
                Usuario U = new Usuario()
                {
                    Numero = user.Number,
                    Nombre = user.Name,
                    Apaterno = user.MiddleName,
                    Amaterno = user.LastName,
                    TipoUsuarioId = user.IdUserType,
                    Activo = true,
                };

                _dbContext.Usuarios.Add(U);
                await _dbContext.SaveChangesAsync();

                LogActividad LA = new()
                {
                    Acción = "Post",
                    Tabla = "Usuarios",
                    IdRegistro = U.Id,
                    Elemento = JsonConvert.SerializeObject(U),
                    Descripcion = "A User has been created",
                    FechaHoraCreacion = DateTime.Now,
                    UsuarioCreacion = idUserRequest,
                };
                _dbContext.LogActividads.Add(LA);
                await _dbContext.SaveChangesAsync();

                resp.Succeded = true;
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Success");
                resp.Data = new User(U);
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
        public async Task<IActionResult> Put(int id, [FromBody] User user)
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
            if (user == null || user.IdUser != id)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            #endregion

            var U = await _dbContext.Usuarios.SingleOrDefaultAsync(X => X.Id == id);
            if (U == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            //U.Correo = user.Email;
            //U.Contrasena = user.Password;   
            U.Numero = user.Number;
            U.Nombre = user.Name;
            U.Apaterno = user.MiddleName;
            U.Amaterno = user.LastName;
            U.TipoUsuarioId = user.IdUserType;
            U.Activo = true;

            _dbContext.Entry(U).State = EntityState.Modified;

            LogActividad LA = new()
            {
                Acción = "Put",
                Tabla = "Usuarios",
                IdRegistro = U.Id,
                Elemento = JsonConvert.SerializeObject(U),
                Descripcion = "The user has been updated",
                FechaHoraCreacion = DateTime.Now,
                UsuarioCreacion = idUserRequest,
            };
            _dbContext.LogActividads.Add(LA);

            try
            {
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

            var U = await _dbContext.Usuarios.FindAsync(id);
            if (U == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            U.Activo = !U.Activo;

            _dbContext.Entry(U).State = EntityState.Modified;

            LogActividad LA = new()
            {
                Acción = "Delete",
                Tabla = "Usuario",
                IdRegistro = U.Id,
                Elemento = JsonConvert.SerializeObject(U),
                Descripcion = String.Format("User {0} has been {1}", id, (U.Activo ? "enabled" : "disabled")),
                FechaHoraCreacion = DateTime.Now,
                UsuarioCreacion = idUserRequest,
            };
            _dbContext.LogActividads.Add(LA);

            try
            {
                await _dbContext.SaveChangesAsync();
                resp.Succeded = true;
                resp.Message = U.Activo ?
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
        [HttpPut("UpdatePassword/{id}/{newpass}")]
        public async Task<IActionResult> UpdatePassword(int id, string newpass)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var idUserRequest = jwtAuthenticationManager.readToken(token.ToString());

            #region Validaciones

            // Si no tenemos id de Usuario regresamos Unauthorized
            if (idUserRequest != id)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:Unauthorized");
                return Ok(resp);
            }

            #endregion

            var U = await _dbContext.Usuarios.SingleOrDefaultAsync(X => X.Id == id);
            if (U == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            U.Contrasena = APITools.encrypt(newpass);
            U.Activo = true;

            _dbContext.Entry(U).State = EntityState.Modified;

            LogActividad LA = new()
            {
                Acción = "Put",
                Tabla = "Usuarios",
                IdRegistro = U.Id,
                Elemento = "New Password has been set",
                Descripcion = "The user password has been set",
                FechaHoraCreacion = DateTime.Now,
                UsuarioCreacion = idUserRequest,
            };
            _dbContext.LogActividads.Add(LA);

            try
            {
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

        [HttpPut("PasswordRecovery/{email}")]
        public async Task<IActionResult> PasswordRecovery(string email)
        {
            var U = await _dbContext.Usuarios.SingleOrDefaultAsync(X => X.Correo == email);
            if (U == null)
            {
                resp.Message = _configuration.GetValue<String>("UserMessages:Generic:RecordNotFound");
                return Ok(resp);
            }

            U.ModoRecuperacion = true;
            U.ContrasenaTemporal = APITools.encrypt("");
            _dbContext.Entry(U).State = EntityState.Modified;

            var parameters = await (from P in _dbContext.Parametros select new Parameter(P)).ToListAsync();

            var user = new User(U);
            var To = U.Correo;
            var Subject = "Prueba email ASP-CORE";
            var Body = String.Format("Estimado {0}: <br/><br/>" +
                "Tu contraseña temporal para ingresar al sistema es: <br/><br/><b>{1}</b><br/><br/>" +
                "Ingresa al sistema para completar el proceso.",
                user.FullName,
                APITools.decrypt(U.ContrasenaTemporal));

            string path = _webHostEnvironment.ContentRootPath;
            Body = APITools.BuildEmail(path, Body);

            var host = _configuration.GetValue<String>("SMTPConfig:host");
            var port = int.Parse(_configuration.GetValue<String>("SMTPConfig:port"));
            var userName = _configuration.GetValue<String>("SMTPConfig:userName");
            var From = _configuration.GetValue<String>("SMTPConfig:userNameAlias");
            var password = _configuration.GetValue<String>("SMTPConfig:password");
            var enableSsl = bool.Parse(_configuration.GetValue<String>("SMTPConfig:enableSsl"));
            var defaultCredentials = bool.Parse(_configuration.GetValue<String>("SMTPConfig:defaultCredentials"));

            #region Images as Resources
            List<string> imgs = new List<string>();
            foreach (Match m in Regex.Matches(Body, "<img.+?src=[\"'](.+?)[\"'].+?>", RegexOptions.IgnoreCase | RegexOptions.Multiline))
            {
                imgs.Add(m.Groups[1].Value);
            }

            string[] sources = imgs.ToArray();
            LinkedResource[] LinkedResources = new LinkedResource[imgs.Count];
            for (int i = 0; i < imgs.Count; i++)
            {
                sources[i] = imgs[i];
                sources[i] = sources[i].Substring(sources[i].IndexOf("data"), sources[i].Length - sources[i].IndexOf("data"));
                //sources[i] = sources[i].Substring(0, sources[i].IndexOf("\"") - 1);
            }
            ContentType c = new ContentType("image/jpeg");
            for (int i = 0; i < imgs.Count; i++)
            {
                System.Net.Mime.ContentType ct = new ContentType();
                Body = Body.Replace(sources[i], ("cid:" + i));
                sources[i] = sources[i].Replace("data:image/jpeg;base64,", "");
                ct.MediaType = "image/jpeg";
                if (sources[i].Contains("image/png"))
                {
                    sources[i] = sources[i].Replace("data:image/png;base64,", "");
                    ct.MediaType = "image/png";
                }

                byte[] imageBytes = System.Convert.FromBase64String(sources[i]);

                LinkedResources[i] = new LinkedResource(new MemoryStream(imageBytes));
                LinkedResources[i].ContentType = c;
                LinkedResources[i].ContentId = i.ToString();
                LinkedResources[i].TransferEncoding = TransferEncoding.Base64;
                LinkedResources[i].ContentType = ct;

            }
            #endregion
            MailMessage message = new MailMessage(From, To, Subject, Body);
            //if (attachmentFilename != null && attachmentFilename.Count > 0)
            //    foreach (String str in attachmentFilename)
            //    {
            //        String path = ligaServicios() + "/PDFs/" + str;
            //        paths += path;
            //        if (File.Exists(path))
            //        {
            //            Attachment attachment = new Attachment(path);
            //            attachment.NameEncoding = Encoding.UTF8;
            //            ContentDisposition disposition = attachment.ContentDisposition;
            //            disposition.CreationDate = File.GetCreationTime(path);
            //            disposition.ModificationDate = File.GetLastWriteTime(path);
            //            disposition.ReadDate = File.GetLastAccessTime(path);
            //            disposition.FileName = Path.GetFileName(path);
            //            disposition.Size = new FileInfo(path).Length;
            //            disposition.DispositionType = DispositionTypeNames.Attachment;
            //            message.Attachments.Add(attachment);
            //        }
            //    }
            #region Images as Resources - AlternateView 
            AlternateView alternativeView = AlternateView.CreateAlternateViewFromString(Body, null, MediaTypeNames.Text.Html);
            alternativeView.ContentId = "htmlView";
            alternativeView.TransferEncoding = TransferEncoding.SevenBit;
            for (int i = 0; i < imgs.Count; i++)
            {
                alternativeView.LinkedResources.Add(LinkedResources[i]);
            }
            message.AlternateViews.Add(alternativeView);
            #endregion
            message.IsBodyHtml = true;
            message.HeadersEncoding = Encoding.UTF8;
            message.BodyEncoding = Encoding.UTF8;
            SmtpClient emailClient = new SmtpClient(host, port);
            NetworkCredential SMTPUserInfo = new NetworkCredential(userName, password);
            emailClient.UseDefaultCredentials = defaultCredentials;
            emailClient.EnableSsl = enableSsl;
            emailClient.Credentials = SMTPUserInfo;
            emailClient.Send(message);

            // Envío del mensaje de correo electrónico

            try
            {
                await _dbContext.SaveChangesAsync();
                resp.Succeded = true;
                resp.Message = _configuration.GetValue<String>("UserMessages:Authentication:PasswordRecovery");
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
