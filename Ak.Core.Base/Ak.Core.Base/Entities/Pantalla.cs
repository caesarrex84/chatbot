using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class Pantalla
{
    public int Id { get; set; }

    public int? PadreId { get; set; }

    public string NombrePantalla { get; set; } = null!;

    public string DireccionPantalla { get; set; } = null!;

    public string Icono { get; set; } = null!;

    public int Posicion { get; set; }

    public bool Activo { get; set; }

    public virtual ICollection<Pantalla> InversePadre { get; } = new List<Pantalla>();

    public virtual Pantalla? Padre { get; set; }

    public virtual ICollection<Permiso> Permisos { get; } = new List<Permiso>();
}
