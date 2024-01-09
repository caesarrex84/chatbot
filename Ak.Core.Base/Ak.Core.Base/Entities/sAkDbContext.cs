using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Ak.Core.Base.Entities;

public partial class sAkDbContext : DbContext
{
    public sAkDbContext()
    {
    }

    public sAkDbContext(DbContextOptions<sAkDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChatToken> ChatTokens { get; set; }

    public virtual DbSet<ChatTokenDato> ChatTokenDatos { get; set; }

    public virtual DbSet<ChatTokenPregunta> ChatTokenPreguntas { get; set; }

    public virtual DbSet<LogActividad> LogActividads { get; set; }

    public virtual DbSet<LogError> LogErrors { get; set; }

    public virtual DbSet<LogIngreso> LogIngresos { get; set; }

    public virtual DbSet<Pantalla> Pantallas { get; set; }

    public virtual DbSet<Parametro> Parametros { get; set; }

    public virtual DbSet<Permiso> Permisos { get; set; }

    public virtual DbSet<Propiedad> Propiedads { get; set; }

    public virtual DbSet<PropiedadConsumo> PropiedadConsumos { get; set; }

    public virtual DbSet<PropiedadLlave> PropiedadLlaves { get; set; }

    public virtual DbSet<PropiedadPreguntum> PropiedadPregunta { get; set; }

    public virtual DbSet<PropiedadUsuario> PropiedadUsuarios { get; set; }

    public virtual DbSet<TipoUsuario> TipoUsuarios { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChatToken>(entity =>
        {
            entity.ToTable("ChatToken");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Correo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.FechaCreacion).HasColumnType("datetime");
            entity.Property(e => e.Nombre)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Token)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Propiedad).WithMany(p => p.ChatTokens)
                .HasForeignKey(d => d.PropiedadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatToken_Propiedad");
        });

        modelBuilder.Entity<ChatTokenDato>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Dato)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Etiqueta)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.ChatToken).WithMany(p => p.ChatTokenDatos)
                .HasForeignKey(d => d.ChatTokenId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatTokenDatos_ChatToken");
        });

        modelBuilder.Entity<ChatTokenPregunta>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Pregunta)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Respuesta)
                .HasMaxLength(1500)
                .IsUnicode(false);

            entity.HasOne(d => d.ChatToken).WithMany(p => p.ChatTokenPregunta)
                .HasForeignKey(d => d.ChatTokenId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatTokenPreguntas_ChatToken");
        });

        modelBuilder.Entity<LogActividad>(entity =>
        {
            entity.ToTable("LogActividad");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Acción)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Descripcion).IsUnicode(false);
            entity.Property(e => e.Elemento).IsUnicode(false);
            entity.Property(e => e.FechaHoraCreacion).HasColumnType("datetime");
            entity.Property(e => e.IdRegistro).HasColumnName("idRegistro");
            entity.Property(e => e.Tabla)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LogError>(entity =>
        {
            entity.ToTable("LogError");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Detalle).IsUnicode(false);
            entity.Property(e => e.Excepcion)
                .HasMaxLength(5000)
                .IsUnicode(false);
            entity.Property(e => e.FechaHoraCreacion).HasColumnType("datetime");
            entity.Property(e => e.InnerExcepcion)
                .HasMaxLength(5000)
                .IsUnicode(false);
            entity.Property(e => e.Proceso)
                .HasMaxLength(500)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LogIngreso>(entity =>
        {
            entity.ToTable("LogIngreso");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FechaIngreso).HasColumnType("datetime");
            entity.Property(e => e.FechaSalida).HasColumnType("datetime");
            entity.Property(e => e.IdCliente).HasColumnName("idCliente");
            entity.Property(e => e.IdProveedor).HasColumnName("idProveedor");
            entity.Property(e => e.Terminal)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.LogIngresos)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_LogIngreso_Usuario");
        });

        modelBuilder.Entity<Pantalla>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Pantallas");

            entity.ToTable("Pantalla");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DireccionPantalla)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Icono)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.NombrePantalla)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Padre).WithMany(p => p.InversePadre)
                .HasForeignKey(d => d.PadreId)
                .HasConstraintName("FK_Pantallas_Pantallas");
        });

        modelBuilder.Entity<Parametro>(entity =>
        {
            entity.HasKey(e => e.IdParametro);

            entity.ToTable("Parametro");

            entity.Property(e => e.IdParametro).HasColumnName("idParametro");
            entity.Property(e => e.Categoria)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DescripcionParametro)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.NombreParametro)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TipoParametro)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ValorParametro)
                .HasMaxLength(5000)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Permiso>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Permisos");

            entity.ToTable("Permiso");

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.Pantalla).WithMany(p => p.Permisos)
                .HasForeignKey(d => d.PantallaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Permisos_Pantallas");

            entity.HasOne(d => d.TipoUsuario).WithMany(p => p.Permisos)
                .HasForeignKey(d => d.TipoUsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Permisos_TipoUsuario");
        });

        modelBuilder.Entity<Propiedad>(entity =>
        {
            entity.ToTable("Propiedad");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FechaCreacion).HasColumnType("datetime");
            entity.Property(e => e.NombrePropiedad)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.SaludoInicial)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.WebSite)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PropiedadConsumo>(entity =>
        {
            entity.ToTable("PropiedadConsumo");

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.Propiedad).WithMany(p => p.PropiedadConsumos)
                .HasForeignKey(d => d.PropiedadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PropiedadConsumo_Propiedad");
        });

        modelBuilder.Entity<PropiedadLlave>(entity =>
        {
            entity.ToTable("PropiedadLlave");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ApiKey)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaCreacion).HasColumnType("datetime");
            entity.Property(e => e.Vigencia).HasColumnType("date");

            entity.HasOne(d => d.Propiedad).WithMany(p => p.PropiedadLlaves)
                .HasForeignKey(d => d.PropiedadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PropiedadLlave_Propiedad");
        });

        modelBuilder.Entity<PropiedadPreguntum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PropiedadConfiguracion");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Pregunta)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.Propiedad).WithMany(p => p.PropiedadPregunta)
                .HasForeignKey(d => d.PropiedadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PropiedadPregunta_Propiedad");
        });

        modelBuilder.Entity<PropiedadUsuario>(entity =>
        {
            entity.ToTable("PropiedadUsuario");

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.Propiedad).WithMany(p => p.PropiedadUsuarios)
                .HasForeignKey(d => d.PropiedadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PropiedadUsuario_Propiedad");

            entity.HasOne(d => d.Usuario).WithMany(p => p.PropiedadUsuarios)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PropiedadUsuario_Usuario");
        });

        modelBuilder.Entity<TipoUsuario>(entity =>
        {
            entity.ToTable("TipoUsuario");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TipoDeUsuario)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("Usuario");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amaterno)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("AMaterno");
            entity.Property(e => e.Apaterno)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("APaterno");
            entity.Property(e => e.Area)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Contrasena)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.ContrasenaTemporal)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Correo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FechaContrasena).HasColumnType("datetime");
            entity.Property(e => e.Imagen)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Numero)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UltimaContrasena)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.TipoUsuario).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.TipoUsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Usuario_TipoUsuario");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
