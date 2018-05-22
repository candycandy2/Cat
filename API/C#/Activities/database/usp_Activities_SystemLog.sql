CREATE proc [dbo].[usp_Activities_SystemLog]
(
	@Log_AppName Nvarchar(256),
	@Log_FunctionName Nvarchar(256),
	@Log_Desc Nvarchar(4000)

)
As
Begin
-- 20180321 Hakkinen ¬ö¿ý SystemLog
	Insert into SystemLogByApp ( Log_AppName, Log_FunctionName, Log_Desc, Log_DateTime ) Values ( @Log_AppName, @Log_FunctionName, @Log_Desc, GetDate() )	

End

GO


