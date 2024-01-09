using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class PropiedadUsuario
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public int PropiedadId { get; set; }

    public virtual Propiedad Propiedad { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
