using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class LogActividad
{
    public int Id { get; set; }

    public string Tabla { get; set; } = null!;

    public string Acción { get; set; } = null!;

    public int IdRegistro { get; set; }

    public string Elemento { get; set; } = null!;

    public string Descripcion { get; set; } = null!;

    public int UsuarioCreacion { get; set; }

    public DateTime FechaHoraCreacion { get; set; }
}
