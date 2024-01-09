using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class PropiedadConsumo
{
    public int Id { get; set; }

    public int PropiedadId { get; set; }

    public int Anio { get; set; }

    public int Mes { get; set; }

    public int Querys { get; set; }

    public int Tokens { get; set; }

    public virtual Propiedad Propiedad { get; set; } = null!;
}
