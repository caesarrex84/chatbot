using System;
using System.Collections.Generic;

namespace Ak.Core.Base.Entities;

public partial class ChatTokenDato
{
    public int Id { get; set; }

    public int ChatTokenId { get; set; }

    public string Etiqueta { get; set; } = null!;

    public string Dato { get; set; } = null!;

    public virtual ChatToken ChatToken { get; set; } = null!;
}
