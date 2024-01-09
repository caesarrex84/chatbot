using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class TipoUsuario
{
    public int Id { get; set; }

    public string TipoDeUsuario { get; set; } = null!;

    public bool Activo { get; set; }

    public virtual ICollection<Permiso> Permisos { get; } = new List<Permiso>();

    public virtual ICollection<Usuario> Usuarios { get; } = new List<Usuario>();
}
