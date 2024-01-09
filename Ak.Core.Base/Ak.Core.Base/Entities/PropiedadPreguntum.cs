using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class PropiedadPreguntum
{
    public int Id { get; set; }

    public int PropiedadId { get; set; }

    public string Pregunta { get; set; } = null!;

    public virtual Propiedad Propiedad { get; set; } = null!;
}
