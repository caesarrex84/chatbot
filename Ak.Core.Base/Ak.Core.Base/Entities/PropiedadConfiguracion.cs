using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class PropiedadConfiguracion
{
    public int Id { get; set; }

    public int PropiedadId { get; set; }

    public string SaludoInicial { get; set; } = null!;

    public bool PedirDatosParaIniciar { get; set; }

    public string? PreguntasAdicionales { get; set; }

    public virtual Propiedad Propiedad { get; set; } = null!;
}
