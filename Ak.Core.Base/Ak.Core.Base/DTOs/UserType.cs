using Ak.Core.Base.Entities;

namespace Ak.Core.Base.DTOs
{
    public class UserType
    {
        public UserType()
        {

        }

        public UserType(TipoUsuario TU)
        {
            this.IdUserType = TU.Id;
            this.User_Type = TU.TipoDeUsuario;
            this.Active = TU.Activo;
            this.AuthorizeMenus = AuthorizeMenus;
            this.StructuredMenus = StructuredMenus;
        }
        public UserType(TipoUsuario TU, List<MenuItem> AuthorizeMenus, List<MenuItem> StructuredMenus)
        {
            this.IdUserType = TU.Id;
            this.User_Type = TU.TipoDeUsuario;
            this.Active = TU.Activo;
            this.AuthorizeMenus = AuthorizeMenus;
            this.StructuredMenus = StructuredMenus;
        }

        public Int32 IdUserType { get; set; }
        public String User_Type { get; set; } = String.Empty;
        public Boolean Active { get; set; }
        public List<MenuItem> AuthorizeMenus { get; set; } = new List<MenuItem>();
        public List<MenuItem> StructuredMenus { get; set; } = new List<MenuItem>();
    }

    public class MenuItem
    {
        public MenuItem()
        {

        }

        public MenuItem(Pantalla M, Pantalla? padre, Boolean fullControl)
        {
            this.IdScreen = M.Id;
            this.IdParent = M.PadreId;
            this.ParentName = padre != null ? padre.NombrePantalla : String.Empty;
            this.Name = M.NombrePantalla;
            this.Icon = M.Icono;
            this.Url = M.DireccionPantalla;
            this.Selected = false;
            this.fullControl = fullControl;
        }

        public Int32 IdScreen { get; set; }
        public String Name { get; set; } = String.Empty;
        public Int32? Order { get; set; }
        public String Url { get; set; } = String.Empty;
        public String Icon { get; set; } = String.Empty;
        public Int32? IdParent { get; set; }
        public String ParentName { get; set; } = String.Empty;
        public List<MenuItem> SubMenu { get; set; } = new List<MenuItem>();
        public Boolean fullControl { get; set; }
        public Boolean Selected { get; set; }
    }

}
