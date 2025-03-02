USE [sAkCoreBase]
GO
/****** Object:  Table [dbo].[ChatToken]    Script Date: 07/06/2023 11:22:43 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChatToken](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[PropiedadId] [int] NOT NULL,
	[Token] [varchar](200) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[Nombre] [varchar](250) NULL,
	[Telefono] [varchar](250) NULL,
	[Correo] [varchar](250) NULL,
 CONSTRAINT [PK_ChatToken] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatTokenDatos]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ChatTokenPreguntas]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogActividad]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogError]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogIngreso]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pantalla]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Parametro]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permiso]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Propiedad]    Script Date: 07/06/2023 11:22:43 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Propiedad](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[NombrePropiedad] [varchar](250) NOT NULL,
	[WebSite] [varchar](250) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[SaludoInicial] [varchar](500) NULL,
	[SolicitarDatos] [bit] NOT NULL,
	[SolicitarDatosParaIniciar] [bit] NOT NULL,
	[Activo] [bit] NOT NULL,
 CONSTRAINT [PK_Propiedad] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PropiedadLlave]    Script Date: 07/06/2023 11:22:43 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PropiedadLlave](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[PropiedadId] [int] NOT NULL,
	[ApiKey] [varchar](300) NOT NULL,
	[Vigencia] [date] NOT NULL,
	[Activa] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[FechaBaja] [datetime] NULL,
 CONSTRAINT [PK_PropiedadLlave] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PropiedadPregunta]    Script Date: 07/06/2023 11:22:43 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PropiedadPregunta](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[PropiedadId] [int] NOT NULL,
	[Pregunta] [varchar](500) NOT NULL,
 CONSTRAINT [PK_PropiedadConfiguracion] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PropiedadUsuario]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoUsuario]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 07/06/2023 11:22:43 a. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[ChatToken] ON 

INSERT [dbo].[ChatToken] ([id], [PropiedadId], [Token], [FechaCreacion], [Nombre], [Telefono], [Correo]) VALUES (1, 1, N'ZiFtap8HzBDWVnftMsUN7uCLFW15kxla', CAST(N'2023-06-06T21:42:40.883' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[ChatToken] ([id], [PropiedadId], [Token], [FechaCreacion], [Nombre], [Telefono], [Correo]) VALUES (2, 1, N'6e7X1hpJm5w0Y+FHBL+nUeS7rqh4P6Ac', CAST(N'2023-06-06T21:58:20.597' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[ChatToken] ([id], [PropiedadId], [Token], [FechaCreacion], [Nombre], [Telefono], [Correo]) VALUES (3, 1, N'6e7X1hpJm5yJYDxdZY1+/s0XIoUEeNCX', CAST(N'2023-06-06T21:58:36.147' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[ChatToken] ([id], [PropiedadId], [Token], [FechaCreacion], [Nombre], [Telefono], [Correo]) VALUES (4, 1, N'6e7X1hpJm5wefZVqL6on5Zjk8VPfEjHL', CAST(N'2023-06-06T21:59:18.790' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[ChatToken] ([id], [PropiedadId], [Token], [FechaCreacion], [Nombre], [Telefono], [Correo]) VALUES (5, 1, N'6e7X1hpJm5z+Z7+3UOYVRI5Df/9660KT', CAST(N'2023-06-06T21:59:41.987' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[ChatToken] ([id], [PropiedadId], [Token], [FechaCreacion], [Nombre], [Telefono], [Correo]) VALUES (6, 1, N'6e7X1hpJm5y9aKQ4wt3UtXEba7f2skw1', CAST(N'2023-06-06T22:01:07.027' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[ChatToken] ([id], [PropiedadId], [Token], [FechaCreacion], [Nombre], [Telefono], [Correo]) VALUES (7, 1, N'6e7X1hpJm5yK6AkFRL2qkKyIUnvk3Taz', CAST(N'2023-06-06T22:03:01.507' AS DateTime), NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[ChatToken] OFF
GO
SET IDENTITY_INSERT [dbo].[LogActividad] ON 

INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (1, N'TipoDeUsuario', N'Put', 1, N'{"IdUserType":1,"User_Type":"Administrador","Active":true,"AuthorizeMenus":[{"IdScreen":2,"Name":"","Order":null,"Url":"","Icon":"","IdParent":null,"ParentName":"","SubMenu":[],"fullControl":true,"Selected":false},{"IdScreen":3,"Name":"","Order":null,"Url":"","Icon":"","IdParent":null,"ParentName":"","SubMenu":[],"fullControl":true,"Selected":false},{"IdScreen":5,"Name":"","Order":null,"Url":"","Icon":"","IdParent":null,"ParentName":"","SubMenu":[],"fullControl":true,"Selected":false},{"IdScreen":6,"Name":"","Order":null,"Url":"","Icon":"","IdParent":null,"ParentName":"","SubMenu":[],"fullControl":true,"Selected":false},{"IdScreen":7,"Name":"","Order":null,"Url":"","Icon":"","IdParent":null,"ParentName":"","SubMenu":[],"fullControl":true,"Selected":false},{"IdScreen":9,"Name":"","Order":null,"Url":"","Icon":"","IdParent":null,"ParentName":"","SubMenu":[],"fullControl":true,"Selected":false}],"StructuredMenus":[{"IdScreen":1,"Name":"Administración","Order":null,"Url":"#","Icon":"fa-fw fa-users-cog fas","IdParent":null,"ParentName":"","SubMenu":[{"IdScreen":2,"Name":"Roles","Order":null,"Url":"/Administracion/Roles","Icon":"fa-fw fa-users-cog fas","IdParent":1,"ParentName":"Administración","SubMenu":[],"fullControl":true,"Selected":false},{"IdScreen":3,"Name":"Usuarios del sistema","Order":null,"Url":"/Administracion/Usuarios","Icon":"fa-fw fa-users fas","IdParent":1,"ParentName":"Administración","SubMenu":[],"fullControl":true,"Selected":false}],"fullControl":false,"Selected":false}]}', N'A User Type has been Updated', 4, CAST(N'2023-06-05T18:28:55.753' AS DateTime))
INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (2, N'Propiedad', N'Post', 0, N'{"Id":0,"NombrePropiedad":"Aktien Website","WebSite":"www.aktien.mx","FechaCreacion":"2023-06-06T19:28:23.7732751-06:00","SaludoInicial":"","SolicitarDatos":false,"SolicitarDatosParaIniciar":false,"Activo":true,"ChatTokens":[],"PropiedadLlaves":[],"PropiedadPregunta":[],"PropiedadUsuarios":[]}', N'A ownership has been created', 4, CAST(N'2023-06-06T19:28:24.100' AS DateTime))
INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (3, N'Propiedad', N'Post', 0, N'{"Id":0,"NombrePropiedad":"Aktien 2 Website","WebSite":"www.aktien.mx","FechaCreacion":"2023-06-06T19:32:04.3380033-06:00","SaludoInicial":"","SolicitarDatos":false,"SolicitarDatosParaIniciar":false,"Activo":true,"ChatTokens":[],"PropiedadLlaves":[],"PropiedadPregunta":[],"PropiedadUsuarios":[]}', N'A ownership has been created', 4, CAST(N'2023-06-06T19:32:04.623' AS DateTime))
INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (4, N'Propiedad', N'Post', 1, N'{"Id":1,"NombrePropiedad":"Aktien Website","WebSite":"www.aktien.mx","FechaCreacion":"2023-06-06T19:32:13.8060809-06:00","SaludoInicial":"","SolicitarDatos":false,"SolicitarDatosParaIniciar":false,"Activo":true,"ChatTokens":[],"PropiedadLlaves":[],"PropiedadPregunta":[],"PropiedadUsuarios":[]}', N'A ownership has been created', 4, CAST(N'2023-06-06T19:32:13.810' AS DateTime))
INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (5, N'Propiedad', N'Put', 1, N'{"Id":1,"NombrePropiedad":"Aktien Tecnologías","WebSite":"www.aktien.mx","FechaCreacion":"2023-06-06T19:32:13.807","SaludoInicial":"Hola, ¿Cómo podemos ayudarte?","SolicitarDatos":true,"SolicitarDatosParaIniciar":false,"Activo":true,"ChatTokens":[],"PropiedadLlaves":[],"PropiedadPregunta":[],"PropiedadUsuarios":[]}', N'The ownership has been updated', 4, CAST(N'2023-06-06T19:36:42.463' AS DateTime))
INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (6, N'Propiedad', N'Put', 1, N'{"Id":1,"NombrePropiedad":"Aktien TI","WebSite":"www.aktien.mx","FechaCreacion":"2023-06-06T19:32:13.807","SaludoInicial":"Hola, ¿Cómo podemos ayudarte?","SolicitarDatos":true,"SolicitarDatosParaIniciar":false,"Activo":true,"ChatTokens":[],"PropiedadLlaves":[],"PropiedadPregunta":[],"PropiedadUsuarios":[]}', N'The ownership has been updated', 4, CAST(N'2023-06-06T19:36:57.527' AS DateTime))
INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (7, N'Propiedad', N'Put', 1, N'{"Id":1,"Name":"Aktien TI","WebSite":"www.aktien.mx","CreationDate":"0001-01-01T00:00:00","InitialMessage":"Hola, ¿Cómo podemos ayudarte?","RequestInfo":true,"RequestInfoInAdvance":false,"AditionalQuestions":["¿Qué edad tienes?","Eres Hombre o Mujer"],"Active":true}', N'The ownership has been updated', 4, CAST(N'2023-06-06T20:45:09.037' AS DateTime))
INSERT [dbo].[LogActividad] ([id], [Tabla], [Acción], [idRegistro], [Elemento], [Descripcion], [UsuarioCreacion], [FechaHoraCreacion]) VALUES (8, N'Propiedad', N'Put', 1, N'{"Id":1,"Name":"Aktien TI","WebSite":"www.aktien.mx","CreationDate":"0001-01-01T00:00:00","InitialMessage":"Hola, ¿Cómo podemos ayudarte?","RequestInfo":true,"RequestInfoInAdvance":false,"AditionalQuestions":["¿Qué edad tienes?","Eres Hombre o Mujer"],"Active":true}', N'The ownership has been updated', 4, CAST(N'2023-06-06T21:16:09.343' AS DateTime))
SET IDENTITY_INSERT [dbo].[LogActividad] OFF
GO
SET IDENTITY_INSERT [dbo].[Pantalla] ON 

INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (1, NULL, N'Administración', N'#', N'fa-fw fa-users-cog fas', 1, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (2, 1, N'Roles', N'/Administracion/Roles', N'fa-fw fa-users-cog fas', 1, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (3, 1, N'Usuarios del sistema', N'/Administracion/Usuarios', N'fa-fw fa-users fas', 2, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (4, NULL, N'Catálogos', N'#', N'fa-fw fa-list-alt fas', 2, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (5, 4, N'Parámetros', N'/Catalogos/Parametros', N'fa-fw fa-sliders-h fas', 1, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (6, 4, N'Propiedades', N'/Catalogos/Propiedades', N'fa-fw fa-solid fa-book-atlas fas', 2, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (7, 4, N'Propiedad', N'/Catalogos/Propiedad', N'fa-fw fa-solid fa-globe fas', 3, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (8, NULL, N'ChatBot', N'#', N'fa-fw fa-solid fa-comment fas', 3, 1)
INSERT [dbo].[Pantalla] ([id], [PadreId], [NombrePantalla], [DireccionPantalla], [Icono], [Posicion], [Activo]) VALUES (9, 8, N'Chats', N'/Chat/Chats', N'fa-fw fa-solid fa-comments fas ', 1, 1)
SET IDENTITY_INSERT [dbo].[Pantalla] OFF
GO
SET IDENTITY_INSERT [dbo].[Parametro] ON 

INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (1, N'systemName', N'Nombre del sistema en correos y mensajes', N'string', N'text', N'Sistema')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (4, N'systemLink', N'Liga de acceso al sistema', N'https://aktien.mx', N'text', N'Sistema')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (5, N'passwordRecoverySubject', N'Asunto para correo de Recuperación de Contraseña', N'Recuperación de contraseña', N'text', N'Correo')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (9, N'EmailTaskEnable', N'Proceso de Envio de correos (habilitado/deshabilitado)', N'true', N'bit', N'Sistema')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (10, N'EmailInterval', N'Intervalo de envío de correos (Segundos)', N'120', N'int', N'Correo')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (11, N'EmailTaskBlock', N'Cantidad de correos enviados en un bloque (Número)', N'10', N'int', N'Correo')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (12, N'EmailDebug', N'Envio de correos a cuenta única de pruebas', N'true', N'bit', N'Sistema')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (13, N'EmailDebugMail', N'Cuenta de correo al que se envían las pruebas', N'luis.garcia@aktien.mx', N'text', N'Sistema')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (14, N'newUserEmailSubject', N'Asunto para correo de Nuevo Usuario', N'Usuario de Ingreso al Sistema', N'text', N'Correo')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (15, N'newUserEmailText', N'Texto para Correo de Nuevo Usuario', N'PHA+I05PTUJSRTo8L3A+PHA+QmllbnZlbmlkbyBhIGZsZWtrISEhPGJyIC8+PGJyIC8+U2UgaGEgY3JlYWRvIHVuIHVzdWFyaW8gYXNvY2lhZG8gYSB0dSBjb3JyZW8gZWxlY3RyJm9hY3V0ZTtuaWNvIHBhcmEgZWwgI3N5c3RlbU5hbWUuPGJyIC8+PGJyIC8+UG9yIGZhdm9yIGRhIGNsaWMgI0xJR0EgcGFyYSBpbmdyZXNhciwgZGViZXImYWFjdXRlO3MgdXRpbGl6YSBsYXMgc2lndWllbnRlcyBjcmVkZW5jaWFsZXM6PGJyIC8+VXN1YXJpbyAjVVNVQVJJTzxiciAvPkNvbnRyYXNlJm50aWxkZTthOiA8c3Ryb25nPiNQQVNTPC9zdHJvbmc+PC9wPjxwPk5vIGhhY2VyIHVzbyBpbmRlYmlkby48L3A+', N'html', N'Correo')
INSERT [dbo].[Parametro] ([idParametro], [NombreParametro], [DescripcionParametro], [ValorParametro], [TipoParametro], [Categoria]) VALUES (26, N'RolAuthorizeBatch', N'Rol que autoriza la creación de Lotes', N'1', N'rol', N'Sistema')
SET IDENTITY_INSERT [dbo].[Parametro] OFF
GO
SET IDENTITY_INSERT [dbo].[Permiso] ON 

INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (23, 1, 2, 1)
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (24, 1, 3, 1)
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (25, 1, 5, 1)
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (26, 1, 6, 1)
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (27, 1, 7, 1)
INSERT [dbo].[Permiso] ([id], [TipoUsuarioId], [PantallaId], [RealizaCambios]) VALUES (28, 1, 9, 1)
SET IDENTITY_INSERT [dbo].[Permiso] OFF
GO
SET IDENTITY_INSERT [dbo].[Propiedad] ON 

INSERT [dbo].[Propiedad] ([id], [NombrePropiedad], [WebSite], [FechaCreacion], [SaludoInicial], [SolicitarDatos], [SolicitarDatosParaIniciar], [Activo]) VALUES (1, N'Aktien TI', N'www.aktien.mx', CAST(N'2023-06-06T19:32:13.807' AS DateTime), N'Hola, ¿Cómo podemos ayudarte?', 1, 0, 1)
SET IDENTITY_INSERT [dbo].[Propiedad] OFF
GO
SET IDENTITY_INSERT [dbo].[PropiedadLlave] ON 

INSERT [dbo].[PropiedadLlave] ([id], [PropiedadId], [ApiKey], [Vigencia], [Activa], [FechaCreacion], [FechaBaja]) VALUES (1, 1, N'476414798918', CAST(N'2024-06-07' AS Date), 0, CAST(N'2023-06-06T20:21:21.260' AS DateTime), NULL)
INSERT [dbo].[PropiedadLlave] ([id], [PropiedadId], [ApiKey], [Vigencia], [Activa], [FechaCreacion], [FechaBaja]) VALUES (2, 1, N'mEjj4TI7gn6YBpx41ykF4xAzc8SwaAfXE7XRBtVe3jCMeCaWLpGw', CAST(N'2024-06-07' AS Date), 1, CAST(N'2023-06-06T20:22:22.100' AS DateTime), NULL)
SET IDENTITY_INSERT [dbo].[PropiedadLlave] OFF
GO
SET IDENTITY_INSERT [dbo].[PropiedadPregunta] ON 

INSERT [dbo].[PropiedadPregunta] ([id], [PropiedadId], [Pregunta]) VALUES (5, 1, N'¿Qué edad tienes?')
INSERT [dbo].[PropiedadPregunta] ([id], [PropiedadId], [Pregunta]) VALUES (6, 1, N'Eres Hombre o Mujer')
SET IDENTITY_INSERT [dbo].[PropiedadPregunta] OFF
GO
SET IDENTITY_INSERT [dbo].[TipoUsuario] ON 

INSERT [dbo].[TipoUsuario] ([id], [TipoDeUsuario], [Activo]) VALUES (0, N'Sistema', 1)
INSERT [dbo].[TipoUsuario] ([id], [TipoDeUsuario], [Activo]) VALUES (1, N'Administrador', 1)
INSERT [dbo].[TipoUsuario] ([id], [TipoDeUsuario], [Activo]) VALUES (2, N'Gestor de contenido', 1)
SET IDENTITY_INSERT [dbo].[TipoUsuario] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuario] ON 

INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (0, 0, N'webmaster@aktien.mx', N'000000', N'SISTEMA', N'SIN', N'NOMBRE', NULL, NULL, 1, 0, N'JrDyqD4kvEbAQzmhT5e9BA==', N'sDfuInuv1JbAQzmhT5e9BA==', CAST(N'2023-02-21T23:54:12.650' AS DateTime), 1, N'sDfuInuv1JbAQzmhT5e9BA==')
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (4, 1, N'luis.garcia@aktien.mx', N'000001', N'LUIS MIGUEL', N'GARCIA', N'ANAYA', N'', N'/Files/Users/user_00004/profilepic.jpg', 1, 0, N'R3wtn+P9sSN1JbL2/POWuw==', N'yPBQXH5LR/XAQzmhT5e9BA==', CAST(N'2023-03-13T13:00:25.177' AS DateTime), 1, N'RGgtBPKYwH/AQzmhT5e9BA==')
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (5, 1, N'osvaldo.hernandez@aktien.mx', N'', N'OSVALDO', N'HERNANDEZ', N'ORTEGA', N'', N'/images/usericon.png', 1, 0, N'R3wtn+P9sSN1JbL2/POWuw==', N'IEoSjO1fhmPAQzmhT5e9BA==', CAST(N'2023-01-17T12:45:14.930' AS DateTime), 1, N'cNJos0kZdJbAQzmhT5e9BA==')
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (12, 2, N'jk@ja.com', N'987987', N'VICTOR HUGO', N'MÁRQUEZ', N'IBARRA', N'Subdirección Planeación Estratégica', N'/images/usericon.png', 0, 0, N'2zBVav3kWgDAQzmhT5e9BA==', N'xgDFF9dX13whgRABCyQUJQ==', CAST(N'2022-06-26T23:51:40.917' AS DateTime), 1, N'xgDFF9dX13whgRABCyQUJQ==')
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (13, 1, N'vmarquez@flekk.com', N'33', N'VICTOR HUGO', N'MÁRQUEZ ', N'IBARRA', N'Coordinador Planeación Estratégica', NULL, 1, 0, N'xrItxDeIj3eJTb33u+ceug==', N'GBfFNLbUcnHAQzmhT5e9BA==', CAST(N'2023-01-30T16:02:56.650' AS DateTime), 0, NULL)
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (14, 1, N'mgutierrez@flekk.co', N'44', N'MIGUEL ', N'ÁNGEL', N'GUTIERREZ', N'Gerente Administración Chatarra', N'/images/usericon.png', 0, 0, N'2zBVav3kWgDAQzmhT5e9BA==', N'xgDFF9dX13whgRABCyQUJQ==', CAST(N'2022-06-26T23:51:40.917' AS DateTime), 1, N'xgDFF9dX13whgRABCyQUJQ==')
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (15, 1, N'lresendiz@flekk.com', N'14710', N'LUIS', N'RESENDIZ', N'MORALES', N'Analista Chatarra', N'/images/usericon.png', 1, 0, N'3lNepNXCP2vCwpSm/BUOHg==', N'r9EZqqnehBANOdAwk95zFQ==', CAST(N'2023-03-13T10:54:07.177' AS DateTime), 0, NULL)
INSERT [dbo].[Usuario] ([id], [TipoUsuarioId], [Correo], [Numero], [Nombre], [APaterno], [AMaterno], [Area], [Imagen], [Activo], [Deshabilitado], [Contrasena], [UltimaContrasena], [FechaContrasena], [ModoRecuperacion], [ContrasenaTemporal]) VALUES (16, 2, N'kavila@flekk.co', N'3', N'KENIA', N'AVILA', N'M', N'LOGISTICS', N'/images/usericon.png', 1, 0, N'QqI3TRywsszAQzmhT5e9BA==', N'xgDFF9dX13whgRABCyQUJQ==', CAST(N'2022-06-26T23:51:40.933' AS DateTime), 1, N'xgDFF9dX13whgRABCyQUJQ==')
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
ALTER TABLE [dbo].[PropiedadLlave]  WITH CHECK ADD  CONSTRAINT [FK_PropiedadLlave_Propiedad] FOREIGN KEY([PropiedadId])
REFERENCES [dbo].[Propiedad] ([id])
GO
ALTER TABLE [dbo].[PropiedadLlave] CHECK CONSTRAINT [FK_PropiedadLlave_Propiedad]
GO
ALTER TABLE [dbo].[PropiedadPregunta]  WITH CHECK ADD  CONSTRAINT [FK_PropiedadPregunta_Propiedad] FOREIGN KEY([PropiedadId])
REFERENCES [dbo].[Propiedad] ([id])
GO
ALTER TABLE [dbo].[PropiedadPregunta] CHECK CONSTRAINT [FK_PropiedadPregunta_Propiedad]
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
