USE [sAkCoreBase]
GO
/****** Object:  Table [dbo].[ChatToken]    Script Date: 06/07/23 02:21:19 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatToken](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[PropiedadId] [int] NOT NULL,
	[Token] [varchar](200) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_ChatToken] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatTokenDatos]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatTokenDatos](
	[id] [int] NOT NULL,
	[ChatTokenId] [int] NOT NULL,
	[Etiqueta] [varchar](150) NOT NULL,
	[Dato] [varchar](250) NOT NULL,
 CONSTRAINT [PK_ChatTokenDatos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatTokenPreguntas]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatTokenPreguntas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ChatTokenId] [int] NOT NULL,
	[Pregunta] [varchar](250) NOT NULL,
	[Respuesta] [varchar](1500) NOT NULL,
 CONSTRAINT [PK_ChatTokenPreguntas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogActividad]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogActividad](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Tabla] [varchar](50) NOT NULL,
	[Acción] [varchar](50) NOT NULL,
	[idRegistro] [int] NOT NULL,
	[Elemento] [varchar](max) NOT NULL,
	[Descripcion] [varchar](max) NOT NULL,
	[UsuarioCreacion] [int] NOT NULL,
	[FechaHoraCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_LogActividad] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogError]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogError](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Proceso] [varchar](500) NOT NULL,
	[Detalle] [varchar](max) NOT NULL,
	[Excepcion] [varchar](5000) NOT NULL,
	[InnerExcepcion] [varchar](5000) NOT NULL,
	[UsuarioCreacion] [int] NOT NULL,
	[FechaHoraCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_LogError] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogIngreso]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogIngreso](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[IdUsuario] [int] NULL,
	[idCliente] [int] NULL,
	[idProveedor] [int] NULL,
	[Terminal] [varchar](500) NOT NULL,
	[FechaIngreso] [datetime] NOT NULL,
	[FechaSalida] [datetime] NULL,
 CONSTRAINT [PK_LogIngreso] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pantalla]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pantalla](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[PadreId] [int] NULL,
	[NombrePantalla] [varchar](50) NOT NULL,
	[DireccionPantalla] [varchar](50) NOT NULL,
	[Icono] [varchar](150) NOT NULL,
	[Posicion] [int] NOT NULL,
	[Activo] [bit] NOT NULL,
 CONSTRAINT [PK_Pantallas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Parametro]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Parametro](
	[idParametro] [int] IDENTITY(1,1) NOT NULL,
	[NombreParametro] [varchar](100) NOT NULL,
	[DescripcionParametro] [varchar](500) NOT NULL,
	[ValorParametro] [varchar](5000) NOT NULL,
	[TipoParametro] [varchar](15) NOT NULL,
	[Categoria] [varchar](50) NULL,
 CONSTRAINT [PK_Parametro] PRIMARY KEY CLUSTERED 
(
	[idParametro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permiso]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permiso](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[TipoUsuarioId] [int] NOT NULL,
	[PantallaId] [int] NOT NULL,
	[RealizaCambios] [bit] NOT NULL,
 CONSTRAINT [PK_Permisos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Propiedad]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Propiedad](
	[id] [int] NOT NULL,
	[NombrePropiedad] [varchar](250) NOT NULL,
	[WebSite] [varchar](250) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[Activo] [bit] NOT NULL,
 CONSTRAINT [PK_Propiedad] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PropiedadUsuario]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PropiedadUsuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[UsuarioId] [int] NOT NULL,
	[PropiedadId] [int] NOT NULL,
 CONSTRAINT [PK_PropiedadUsuario] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoUsuario]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TipoUsuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[TipoDeUsuario] [varchar](50) NOT NULL,
	[Activo] [bit] NOT NULL,
 CONSTRAINT [PK_TipoUsuario] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 06/07/23 02:21:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[TipoUsuarioId] [int] NOT NULL,
	[Correo] [varchar](50) NOT NULL,
	[Numero] [varchar](50) NULL,
	[Nombre] [varchar](150) NOT NULL,
	[APaterno] [varchar](150) NOT NULL,
	[AMaterno] [varchar](150) NOT NULL,
	[Area] [varchar](150) NULL,
	[Imagen] [varchar](150) NULL,
	[Activo] [bit] NOT NULL,
	[Deshabilitado] [bit] NOT NULL,
	[Contrasena] [varchar](150) NOT NULL,
	[UltimaContrasena] [varchar](150) NULL,
	[FechaContrasena] [datetime] NOT NULL,
	[ModoRecuperacion] [bit] NOT NULL,
	[ContrasenaTemporal] [varchar](500) NULL,
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Pantalla] ON 
GO
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (1, NULL, N'Administración', N'#', N'fa-fw fa-users-cog fas', 1, 1)
GO
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (2, 1, N'Roles', N'/Administracion/Roles', N'fa-fw fa-users-cog fas', 1, 1)
GO
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (3, 1, N'Usuarios del sistema', N'/Administracion/Usuarios', N'fa-fw fa-users fas', 2, 1)
GO
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (5, NULL, N'Catálogos', N'#', N'fa-fw fa-list-alt fas', 2, 1)
GO
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (52, 5, N'Parámetros', N'/Catalogos/Parametros', N'fa-fw fa-sliders-h fas', 4, 1)
GO
SET IDENTITY_INSERT [dbo].[Pantalla] OFF
GO
SET IDENTITY_INSERT [dbo].[Parametro] ON 
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (1, N'systemName', N'Nombre del sistema en correos y mensajes', N'string', N'text', N'Sistema')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (4, N'systemLink', N'Liga de acceso al sistema', N'https://aktien.mx', N'text', N'Sistema')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (5, N'passwordRecoverySubject', N'Asunto para correo de Recuperación de Contraseña', N'Recuperación de contraseña', N'text', N'Correo')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (9, N'EmailTaskEnable', N'Proceso de Envio de correos (habilitado/deshabilitado)', N'true', N'bit', N'Sistema')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (10, N'EmailInterval', N'Intervalo de envío de correos (Segundos)', N'120', N'int', N'Correo')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (11, N'EmailTaskBlock', N'Cantidad de correos enviados en un bloque (Número)', N'10', N'int', N'Correo')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (12, N'EmailDebug', N'Envio de correos a cuenta única de pruebas', N'true', N'bit', N'Sistema')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (13, N'EmailDebugMail', N'Cuenta de correo al que se envían las pruebas', N'luis.garcia@aktien.mx', N'text', N'Sistema')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (14, N'newUserEmailSubject', N'Asunto para correo de Nuevo Usuario', N'Usuario de Ingreso al Sistema', N'text', N'Correo')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (15, N'newUserEmailText', N'Texto para Correo de Nuevo Usuario', N'PHA+I05PTUJSRTo8L3A+PHA+QmllbnZlbmlkbyBhIGZsZWtrISEhPGJyIC8+PGJyIC8+U2UgaGEgY3JlYWRvIHVuIHVzdWFyaW8gYXNvY2lhZG8gYSB0dSBjb3JyZW8gZWxlY3RyJm9hY3V0ZTtuaWNvIHBhcmEgZWwgI3N5c3RlbU5hbWUuPGJyIC8+PGJyIC8+UG9yIGZhdm9yIGRhIGNsaWMgI0xJR0EgcGFyYSBpbmdyZXNhciwgZGViZXImYWFjdXRlO3MgdXRpbGl6YSBsYXMgc2lndWllbnRlcyBjcmVkZW5jaWFsZXM6PGJyIC8+VXN1YXJpbyAjVVNVQVJJTzxiciAvPkNvbnRyYXNlJm50aWxkZTthOiA8c3Ryb25nPiNQQVNTPC9zdHJvbmc+PC9wPjxwPk5vIGhhY2VyIHVzbyBpbmRlYmlkby48L3A+', N'html', N'Correo')
GO
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (26, N'RolAuthorizeBatch', N'Rol que autoriza la creación de Lotes', N'1', N'rol', N'Sistema')
GO
SET IDENTITY_INSERT [dbo].[Parametro] OFF
GO
SET IDENTITY_INSERT [dbo].[Permiso] ON 
GO
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (1442, 1, 2, 1)
GO
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (1443, 1, 3, 1)
GO
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (1445, 1, 52, 1)
GO
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (1502, 2, 2, 1)
GO
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (1503, 2, 3, 1)
GO
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (1505, 2, 52, 1)
GO
SET IDENTITY_INSERT [dbo].[Permiso] OFF
GO
SET IDENTITY_INSERT [dbo].[TipoUsuario] ON 
GO
INSERT [dbo].[TipoUsuario] ([id], [TipoDeUsuario], [Activo]) VALUES (0, N'Sistema', 1)
GO
INSERT [dbo].[TipoUsuario] ([id], [TipoDeUsuario], [Activo]) VALUES (1, N'Administrador', 1)
GO
INSERT [dbo].[TipoUsuario] ([id], [TipoDeUsuario], [Activo]) VALUES (2, N'Gestor de contenido', 1)
GO
SET IDENTITY_INSERT [dbo].[TipoUsuario] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuario] ON 
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (0, 0, N'webmaster@aktien.mx', N'000000', N'SISTEMA', N'SIN', N'NOMBRE', NULL, NULL, 1, 0, N'JrDyqD4kvEbAQzmhT5e9BA==', N'sDfuInuv1JbAQzmhT5e9BA==', CAST(N'2023-02-21T23:54:12.650' AS DateTime), 1, N'sDfuInuv1JbAQzmhT5e9BA==')
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (4, 1, N'luis.garcia@aktien.mx', N'000001', N'LUIS MIGUEL', N'GARCIA', N'ANAYA', N'', N'/Files/Users/user_00004/profilepic.jpg', 1, 0, N'R3wtn+P9sSN1JbL2/POWuw==', N'yPBQXH5LR/XAQzmhT5e9BA==', CAST(N'2023-03-13T13:00:25.177' AS DateTime), 1, N'RGgtBPKYwH/AQzmhT5e9BA==')
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (5, 1, N'osvaldo.hernandez@aktien.mx', N'', N'OSVALDO', N'HERNANDEZ', N'ORTEGA', N'', N'/images/usericon.png', 1, 0, N'R3wtn+P9sSN1JbL2/POWuw==', N'IEoSjO1fhmPAQzmhT5e9BA==', CAST(N'2023-01-17T12:45:14.930' AS DateTime), 1, N'UCuPx8chsx3AQzmhT5e9BA==')
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (12, 2, N'jk@ja.com', N'987987', N'VICTOR HUGO', N'MÁRQUEZ', N'IBARRA', N'Subdirección Planeación Estratégica', N'/images/usericon.png', 0, 0, N'2zBVav3kWgDAQzmhT5e9BA==', N'xgDFF9dX13whgRABCyQUJQ==', CAST(N'2022-06-26T23:51:40.917' AS DateTime), 1, N'xgDFF9dX13whgRABCyQUJQ==')
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (13, 1, N'vmarquez@flekk.com', N'33', N'VICTOR HUGO', N'MÁRQUEZ ', N'IBARRA', N'Coordinador Planeación Estratégica', NULL, 1, 0, N'xrItxDeIj3eJTb33u+ceug==', N'GBfFNLbUcnHAQzmhT5e9BA==', CAST(N'2023-01-30T16:02:56.650' AS DateTime), 0, NULL)
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (14, 1, N'mgutierrez@flekk.co', N'44', N'MIGUEL ', N'ÁNGEL', N'GUTIERREZ', N'Gerente Administración Chatarra', N'/images/usericon.png', 0, 0, N'2zBVav3kWgDAQzmhT5e9BA==', N'xgDFF9dX13whgRABCyQUJQ==', CAST(N'2022-06-26T23:51:40.917' AS DateTime), 1, N'xgDFF9dX13whgRABCyQUJQ==')
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (15, 1, N'lresendiz@flekk.com', N'14710', N'LUIS', N'RESENDIZ', N'MORALES', N'Analista Chatarra', N'/images/usericon.png', 1, 0, N'3lNepNXCP2vCwpSm/BUOHg==', N'r9EZqqnehBANOdAwk95zFQ==', CAST(N'2023-03-13T10:54:07.177' AS DateTime), 0, NULL)
GO
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (16, 2, N'kavila@flekk.co', N'3', N'KENIA', N'AVILA', N'M', N'LOGISTICS', N'/images/usericon.png', 1, 0, N'QqI3TRywsszAQzmhT5e9BA==', N'xgDFF9dX13whgRABCyQUJQ==', CAST(N'2022-06-26T23:51:40.933' AS DateTime), 1, N'xgDFF9dX13whgRABCyQUJQ==')
GO
SET IDENTITY_INSERT [dbo].[Usuario] OFF
GO
ALTER TABLE [dbo].[ChatToken]  WITH CHECK ADD  CONSTRAINT [FK_ChatToken_Propiedad] FOREIGN KEY([PropiedadId])
REFERENCES [dbo].[Propiedad] ([id])
GO
ALTER TABLE [dbo].[ChatToken] CHECK CONSTRAINT [FK_ChatToken_Propiedad]
GO
ALTER TABLE [dbo].[ChatTokenDatos]  WITH CHECK ADD  CONSTRAINT [FK_ChatTokenDatos_ChatToken] FOREIGN KEY([ChatTokenId])
REFERENCES [dbo].[ChatToken] ([id])
GO
ALTER TABLE [dbo].[ChatTokenDatos] CHECK CONSTRAINT [FK_ChatTokenDatos_ChatToken]
GO
ALTER TABLE [dbo].[ChatTokenPreguntas]  WITH CHECK ADD  CONSTRAINT [FK_ChatTokenPreguntas_ChatToken] FOREIGN KEY([ChatTokenId])
REFERENCES [dbo].[ChatToken] ([id])
GO
ALTER TABLE [dbo].[ChatTokenPreguntas] CHECK CONSTRAINT [FK_ChatTokenPreguntas_ChatToken]
GO
ALTER TABLE [dbo].[LogIngreso]  WITH CHECK ADD  CONSTRAINT [FK_LogIngreso_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([id])
GO
ALTER TABLE [dbo].[LogIngreso] CHECK CONSTRAINT [FK_LogIngreso_Usuario]
GO
ALTER TABLE [dbo].[Pantalla]  WITH CHECK ADD  CONSTRAINT [FK_Pantallas_Pantallas] FOREIGN KEY([PadreId])
REFERENCES [dbo].[Pantalla] ([id])
GO
ALTER TABLE [dbo].[Pantalla] CHECK CONSTRAINT [FK_Pantallas_Pantallas]
GO
ALTER TABLE [dbo].[Permiso]  WITH CHECK ADD  CONSTRAINT [FK_Permisos_Pantallas] FOREIGN KEY([PantallaId])
REFERENCES [dbo].[Pantalla] ([id])
GO
ALTER TABLE [dbo].[Permiso] CHECK CONSTRAINT [FK_Permisos_Pantallas]
GO
ALTER TABLE [dbo].[Permiso]  WITH CHECK ADD  CONSTRAINT [FK_Permisos_TipoUsuario] FOREIGN KEY([TipoUsuarioId])
REFERENCES [dbo].[TipoUsuario] ([id])
GO
ALTER TABLE [dbo].[Permiso] CHECK CONSTRAINT [FK_Permisos_TipoUsuario]
GO
ALTER TABLE [dbo].[PropiedadUsuario]  WITH CHECK ADD  CONSTRAINT [FK_PropiedadUsuario_Propiedad] FOREIGN KEY([PropiedadId])
REFERENCES [dbo].[Propiedad] ([id])
GO
ALTER TABLE [dbo].[PropiedadUsuario] CHECK CONSTRAINT [FK_PropiedadUsuario_Propiedad]
GO
ALTER TABLE [dbo].[PropiedadUsuario]  WITH CHECK ADD  CONSTRAINT [FK_PropiedadUsuario_Usuario] FOREIGN KEY([UsuarioId])
REFERENCES [dbo].[Usuario] ([id])
GO
ALTER TABLE [dbo].[PropiedadUsuario] CHECK CONSTRAINT [FK_PropiedadUsuario_Usuario]
GO
ALTER TABLE [dbo].[Usuario]  WITH CHECK ADD  CONSTRAINT [FK_Usuario_TipoUsuario] FOREIGN KEY([TipoUsuarioId])
REFERENCES [dbo].[TipoUsuario] ([id])
GO
ALTER TABLE [dbo].[Usuario] CHECK CONSTRAINT [FK_Usuario_TipoUsuario]
GO
