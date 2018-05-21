CREATE TABLE [dbo].[SystemLogByApp](
	[Log_ID] [int] IDENTITY(1,1) NOT NULL,
	[Log_AppName] [nvarchar](256) NULL,
	[Log_FunctionName] [nvarchar](256) NULL,
	[Log_Desc] [nvarchar](4000) NULL,
	[Log_DateTime] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Log_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


