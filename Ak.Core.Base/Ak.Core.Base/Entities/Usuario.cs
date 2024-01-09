using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class Usuario
{
    public int Id { get; set; }

    public int TipoUsuarioId { get; set; }

    public string Correo { get; set; } = null!;

    public string? Numero { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apaterno { get; set; } = null!;

    public string Amaterno { get; set; } = null!;

    public string? Area { get; set; }

    public string? Imagen { get; set; }

    public bool Activo { get; set; }

    public bool Deshabilitado { get; set; }

    public string Contrasena { get; set; } = null!;

    public string? UltimaContrasena { get; set; }

    public DateTime FechaContrasena { get; set; }

    public bool ModoRecuperacion { get; set; }

    public string? ContrasenaTemporal { get; set; }

    public virtual ICollection<LogIngreso> LogIngresos { get; } = new List<LogIngreso>();

    public virtual ICollection<PropiedadUsuario> PropiedadUsuarios { get; } = new List<PropiedadUsuario>();

    public virtual TipoUsuario TipoUsuario { get; set; } = null!;
}
