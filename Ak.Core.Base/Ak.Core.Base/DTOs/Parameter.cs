using Ak.Core.Base.Entities;

namespace Ak.Core.Base.DTOs
{
    public class Parameter
    {
        public Parameter()
        {

        }

        public Parameter(Parametro P)
        {
            this.IdParameter = P.IdParametro;
            this.Name = P.NombreParametro;
            this.Description = P.DescripcionParametro;
            this.Value = P.ValorParametro;
            this.Type = P.TipoParametro;
            this.Category = P.Categoria;
        }

        public Int32 IdParameter { get; set; }
        public String Name { get; set; } = String.Empty;
        public String Description { get; set; } = String.Empty;
        public String Value { get; set; } = String.Empty;
        public String Type { get; set; } = String.Empty;
        public String? Category { get; set; }
    }
}
