using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class Parametro
{
    public int IdParametro { get; set; }

    public string NombreParametro { get; set; } = null!;

    public string DescripcionParametro { get; set; } = null!;

    public string ValorParametro { get; set; } = null!;

    public string TipoParametro { get; set; } = null!;

    public string? Categoria { get; set; }
}
