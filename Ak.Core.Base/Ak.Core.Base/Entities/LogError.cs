using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class LogError
{
    public int Id { get; set; }

    public string Proceso { get; set; } = null!;

    public string Detalle { get; set; } = null!;

    public string Excepcion { get; set; } = null!;

    public string InnerExcepcion { get; set; } = null!;

    public int UsuarioCreacion { get; set; }

    public DateTime FechaHoraCreacion { get; set; }
}
