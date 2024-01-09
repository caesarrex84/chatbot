using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class Permiso
{
    public int Id { get; set; }

    public int TipoUsuarioId { get; set; }

    public int PantallaId { get; set; }

    public bool RealizaCambios { get; set; }

    public virtual Pantalla Pantalla { get; set; } = null!;

    public virtual TipoUsuario TipoUsuario { get; set; } = null!;
}
