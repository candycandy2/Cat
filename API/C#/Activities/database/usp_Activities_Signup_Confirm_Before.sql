CREATE proc [dbo].[usp_Activities_Signup_Confirm_Before]
(
	@ActivitiesID int,
	@EmployeeNo Nvarchar(10)
)
As
Begin
--  20171201 Hakkinen 眷屬確認報名前刪除
	Delete From Shopping_Buyer Where Sid = @ActivitiesID And Status in (0,1) And EmpNo = @EmployeeNo 
End

GO


