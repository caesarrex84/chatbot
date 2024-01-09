using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class Propiedad
{
    public int Id { get; set; }

    public string NombrePropiedad { get; set; } = null!;

    public string WebSite { get; set; } = null!;

    public DateTime FechaCreacion { get; set; }

    public string? SaludoInicial { get; set; }

    public string? Configuracion { get; set; }
 //   public int? NumeroToken { get; set; }

    public bool SolicitarDatos { get; set; }

    public bool SolicitarDatosParaIniciar { get; set; }

    public bool Activo { get; set; }

    public virtual ICollection<ChatToken> ChatTokens { get; } = new List<ChatToken>();

    public virtual ICollection<PropiedadConsumo> PropiedadConsumos { get; } = new List<PropiedadConsumo>();

    public virtual ICollection<PropiedadLlave> PropiedadLlaves { get; } = new List<PropiedadLlave>();

    public virtual ICollection<PropiedadPreguntum> PropiedadPregunta { get; } = new List<PropiedadPreguntum>();

    public virtual ICollection<PropiedadUsuario> PropiedadUsuarios { get; } = new List<PropiedadUsuario>();
}
