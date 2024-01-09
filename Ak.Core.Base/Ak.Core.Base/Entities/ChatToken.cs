using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class ChatToken
{
    public int Id { get; set; }

    public int PropiedadId { get; set; }

    public string Token { get; set; } = null!;

    public DateTime FechaCreacion { get; set; }

    public string? Nombre { get; set; }

    public string? Telefono { get; set; }

    public string? Correo { get; set; }

    public virtual ICollection<ChatTokenDato> ChatTokenDatos { get; } = new List<ChatTokenDato>();

    public virtual ICollection<ChatTokenPregunta> ChatTokenPregunta { get; } = new List<ChatTokenPregunta>();

    public virtual Propiedad Propiedad { get; set; } = null!;
}
