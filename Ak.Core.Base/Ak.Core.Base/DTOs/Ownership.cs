using Ak.Core.Base.Entities;
using Newtonsoft.Json;
using System.Security.Cryptography;

namespace Ak.Core.Base.DTOs
{

    public class Ownership
    {
        public Ownership() { }

        public Ownership(Propiedad P)
        {
            this.Id = P.Id;
            this.Name = P.NombrePropiedad;
            this.WebSite = P.WebSite;
            this.CreationDate = P.FechaCreacion;
            this.InitialMessage = P.SaludoInicial ?? String.Empty;
            this.RequestInfo = P.SolicitarDatos;
            this.RequestInfoInAdvance = P.SolicitarDatosParaIniciar;
            this.Active = P.Activo;
            this.Configuration = P.Configuracion ?? String.Empty;
      //      this.TokenAmount =  P.NumeroToken ?? 0 ;

            this.AditionalQuestions = !P.PropiedadPregunta.Any() ? new List<string>() :
                P.PropiedadPregunta.Select(X=>X.Pregunta).ToList();

            this.AsignedUsers = P.PropiedadUsuarios.Count;
            this.UserIds = !P.PropiedadUsuarios.Any() ? new List<int>() :
                P.PropiedadUsuarios.Select(X => X.UsuarioId).ToList();
        }

        public Int32 Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string WebSite { get; set; } = String.Empty;
        public DateTime CreationDate { get; set; }
        public String InitialMessage { get; set; } = String.Empty;
        public String Configuration { get; set; } = String.Empty;
        public Int32? TokenAmount { get; set; } = 0;
        public Boolean RequestInfo { get; set; } = false;
        public Boolean RequestInfoInAdvance { get; set; } = false;
        public List<String> AditionalQuestions { get; set; } = new List<string>();
        public Boolean Active { get; set; }

        public Int32 AsignedUsers { get; set; }
        public List<Int32> UserIds { get; set; } = new List<Int32>();
    }

    public class OwnershipKey
    {
        public OwnershipKey()
        {
            ValidKey = false;
        }

        public OwnershipKey(PropiedadLlave PL)
        {
            this.Id = PL.Id;
            this.OwnershipId = PL.PropiedadId;
            this.API_Key = PL.ApiKey;
            this.Validity = PL.Vigencia;
            this.Active = PL.Activa;
            this.CreationDate = PL.FechaCreacion;
            this.DeleteDate = PL.FechaBaja;

            this.ValidKey = PL.Vigencia.Date >= DateTime.Now.Date;
        }

        public Int32 Id { set; get; } = 0;
        public Int32 OwnershipId { set; get; } = 0;
        public String API_Key { set; get; } = String.Empty;
        public DateTime Validity { set; get; }
        public Boolean Active { get; } = false;
        public DateTime CreationDate { get;}
        public DateTime? DeleteDate { get;  }

        public Boolean ValidKey { get; }
    }

}
