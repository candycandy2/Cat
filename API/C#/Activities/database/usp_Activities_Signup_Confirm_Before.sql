CREATE proc [dbo].[usp_Activities_Signup_Confirm_Before]
(
	@ActivitiesID int,
	@EmployeeNo Nvarchar(10)
)
As
Begin
--  20171201 Hakkinen ���ݽT�{���W�e�R��
	Delete From Shopping_Buyer Where Sid = @ActivitiesID And Status in (0,1) And EmpNo = @EmployeeNo 
End

GO


