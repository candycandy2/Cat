CREATE proc [dbo].[usp_Activities_Signup_Cancel]
(
	@ActivitiesID int,
	@SignupNo Nvarchar(200),
	@SignupModel int,
	@EmployeeNo Nvarchar(50)
)
As
Begin
-- 20171201 Hakkinen 取消報名

-- 個人報名
If @SignupModel = 1
	Begin
		Update Shopping_Buyer Set OtherDesc = 'APP取消報名',Status=2, DeleteEmpNo = @EmployeeNo, DeleteDate = Getdate() Where Sid = @ActivitiesID And EmpNo = @EmployeeNo And Bid = @SignupNo And Status in (0,1)
	End
-- 眷屬報名
Else If @SignupModel = 3
	Begin
		Update Shopping_Buyer Set OtherDesc = 'APP取消報名',Status=2, DeleteEmpNo = @EmployeeNo, DeleteDate = Getdate() Where Sid = @ActivitiesID And EmpNo = @EmployeeNo And Status in (0,1)
	End
-- 組隊報名
Else If @SignupModel = 4
	Begin
		Update Active_Team_Name Set status = 2,UpdateDate = Getdate(), DeleteDate = Getdate(), DeleteEmpNo = @EmployeeNo, OtherDesc = 'APP取消報名' Where Sid = @ActivitiesID And TeamID = @SignupNo And Agent = @EmployeeNo And Status in (0,1)
	End
-- 時段報名
Else If @SignupModel = 5
	Begin
		Update Shopping_Buyer Set OtherDesc = 'APP取消報名',Status=2, DeleteEmpNo = @EmployeeNo, DeleteDate = Getdate() Where Sid = @ActivitiesID And Bid = @SignupNo And Status in (0,1)
	End
End


GO


