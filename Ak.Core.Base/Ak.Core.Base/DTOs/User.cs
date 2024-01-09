using Ak.Core.Base.Entities;
using Microsoft.EntityFrameworkCore;
using System.Runtime.ConstrainedExecution;

namespace Ak.Core.Base.DTOs
{
    public class User
    {
        public User()
        {

        }

        public User(Usuario U)
        {
            this.IdUser = U.Id;
            this.Email = U.Correo;
            this.Password = U.Contrasena;
            this.Number = U.Numero;
            this.Name = U.Nombre;
            this.MiddleName = U.Apaterno;
            this.LastName = U.Amaterno;
            this.FullName = U.Nombre +
                (!String.IsNullOrEmpty(U.Apaterno) ? " " + U.Apaterno : String.Empty) +
                (!String.IsNullOrEmpty(U.Amaterno) ? " " + U.Amaterno : String.Empty);
            this.IdUserType = U.TipoUsuarioId;
            this.RecoveryMode = U.ModoRecuperacion;
            this.Active = U.Activo;

            this.UserType = U.TipoUsuario != null ? new UserType(U.TipoUsuario) : new UserType();
        }

        public User(Usuario U, TipoUsuario TU)
        {
            this.IdUser = U.Id;
            this.Email = U.Correo;
            this.Password = U.Contrasena;
            this.Number = U.Numero;
            this.Name = U.Nombre;
            this.MiddleName = U.Apaterno;
            this.LastName = U.Amaterno;
            this.FullName = U.Nombre +
                (!String.IsNullOrEmpty(U.Apaterno) ? " " + U.Apaterno : String.Empty) +
                (!String.IsNullOrEmpty(U.Amaterno) ? " " + U.Amaterno : String.Empty);
            this.IdUserType = U.TipoUsuarioId;
            this.RecoveryMode = U.ModoRecuperacion;
            this.Active = U.Activo;

            this.UserType = TU != null ? new UserType(TU) : new UserType();
        }

        public Int32 IdUser { get; set; }
        public String Email { get; set; } = String.Empty;
        public String Password { get; set; } = String.Empty;
        public String? Number { get; set; }
        public String Name { get; set; } = String.Empty;
        public String MiddleName { get; set; } = String.Empty;
        public String LastName { get; set; } = String.Empty;
        public String FullName { get; set; } = String.Empty;
        public Int32 IdUserType { get; set; }
        public UserType? UserType { get; set; }
        public Boolean RecoveryMode { get; set; } = false;
        public Boolean Active { get; set; } = false;
    }

}
