CREATE proc [dbo].[usp_Activities_Signup_Cancel]
(
	@ActivitiesID int,
	@SignupNo Nvarchar(200),
	@SignupModel int,
	@EmployeeNo Nvarchar(50)
)
As
Begin
-- 20171201 Hakkinen �������W

-- �ӤH���W
If @SignupModel = 1
	Begin
		Update Shopping_Buyer Set OtherDesc = 'APP�������W',Status=2, DeleteEmpNo = @EmployeeNo, DeleteDate = Getdate() Where Sid = @ActivitiesID And EmpNo = @EmployeeNo And Bid = @SignupNo And Status in (0,1)
	End
-- ���ݳ��W
Else If @SignupModel = 3
	Begin
		Update Shopping_Buyer Set OtherDesc = 'APP�������W',Status=2, DeleteEmpNo = @EmployeeNo, DeleteDate = Getdate() Where Sid = @ActivitiesID And EmpNo = @EmployeeNo And Status in (0,1)
	End
-- �ն����W
Else If @SignupModel = 4
	Begin
		Update Active_Team_Name Set status = 2,UpdateDate = Getdate(), DeleteDate = Getdate(), DeleteEmpNo = @EmployeeNo, OtherDesc = 'APP�������W' Where Sid = @ActivitiesID And TeamID = @SignupNo And Agent = @EmployeeNo And Status in (0,1)
	End
-- �ɬq���W
Else If @SignupModel = 5
	Begin
		Update Shopping_Buyer Set OtherDesc = 'APP�������W',Status=2, DeleteEmpNo = @EmployeeNo, DeleteDate = Getdate() Where Sid = @ActivitiesID And Bid = @SignupNo And Status in (0,1)
	End
End


GO


