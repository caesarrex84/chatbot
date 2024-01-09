using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class PropiedadLlave
{
    public int Id { get; set; }

    public int PropiedadId { get; set; }

    public string ApiKey { get; set; } = null!;

    public DateTime Vigencia { get; set; }

    public bool Activa { get; set; }

    public DateTime FechaCreacion { get; set; }

    public DateTime? FechaBaja { get; set; }

    public virtual Propiedad Propiedad { get; set; } = null!;
}
