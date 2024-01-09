using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class ChatTokenPregunta
{
    public int Id { get; set; }

    public int ChatTokenId { get; set; }

    public string Pregunta { get; set; } = null!;

    public string Respuesta { get; set; } = null!;

    public virtual ChatToken ChatToken { get; set; } = null!;
}
