using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class LogIngreso
{
    public int Id { get; set; }

    public int? IdUsuario { get; set; }

    public int? IdCliente { get; set; }

    public int? IdProveedor { get; set; }

    public string Terminal { get; set; } = null!;

    public DateTime FechaIngreso { get; set; }

    public DateTime? FechaSalida { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
