CREATE proc [dbo].[usp_Activities_Signup_Confirm]
(
	@ActivitiesID int,
	@SignupModel int,
	@SignupPlaces int,
	@EmployeeNo Nvarchar(10),
	@ColumnAnswer_1  Nvarchar(100),
	@ColumnAnswer_2  Nvarchar(100),
	@ColumnAnswer_3  Nvarchar(100),
	@ColumnAnswer_4  Nvarchar(100),
	@ColumnAnswer_5  Nvarchar(100),
	@FamilyNo Nvarchar(50),
	@TimeID int,
	@TeamID Nvarchar(100),
	@TeamName Nvarchar(100),
	@TeamDept Nvarchar(100),
	@MemberEmpNo Nvarchar(10)
)
As
Begin
-- 20171201 Hakkinen 確認報名

-- 個人報名
If @SignupModel = 1
	Begin
		Delete From Shopping_Buyer Where Sid = @ActivitiesID And Status in (0,1) And EmpNo = @EmployeeNo
		Insert into Shopping_Buyer ( SID, EmpNo, AgentEmpNo, Quantity, ForDept, Color, CIndex, OtherColumn1, OtherColumn2, OtherColumn3, OtherColumn4, OtherColumn5, OtherDesc ) 
		Values ( @ActivitiesID, @EmployeeNo, @EmployeeNo, @SignupPlaces, 0, '', '', @ColumnAnswer_1, @ColumnAnswer_2, @ColumnAnswer_3, @ColumnAnswer_4, @ColumnAnswer_5, 'APP報名成功' )
	End
-- 眷屬報名
Else If @SignupModel = 3
	Begin
		--Delete From Shopping_Buyer Where Sid = @ActivitiesID And Status in (0,1) And EmpNo = @EmployeeNo And RF_Index = @FamilyNo
		Insert into Shopping_Buyer ( SID,EmpNo,AgentEmpNo,RF_Index,Quantity,ForDept,Color,CIndex,OtherColumn1, OtherColumn2, OtherColumn3, OtherColumn4, OtherColumn5, OtherDesc ) 
		Values ( @ActivitiesID, @EmployeeNo, @EmployeeNo, @FamilyNo, @SignupPlaces, 0, '', '', @ColumnAnswer_1, @ColumnAnswer_2, @ColumnAnswer_3, @ColumnAnswer_4, @ColumnAnswer_5, 'APP報名成功' )
	End
-- 組隊報名
Else If @SignupModel = 4
	Begin
		Delete From Active_Team_Name Where TeamID = @TeamID
		Insert into Active_Team_Name ( SID, TeamID, DeptNo, TeamName, Agent, Status, OtherDesc ) Values (@ActivitiesID, @TeamID, @TeamDept, @TeamName, @EmployeeNo, 1, 'APP報名成功' )	
		Insert into Active_Team_Member ( SID, TeamID, EmpNo, Agent ) Values ( @ActivitiesID, @TeamID, @MemberEmpNo, @EmployeeNo )
	End
-- 時段報名
Else If @SignupModel = 5
	Begin
		Delete From Shopping_Buyer Where Sid = @ActivitiesID And Status in (0,1) And EmpNo = @EmployeeNo
		Insert into Shopping_Buyer ( SID, EmpNo, AgentEmpNo, Quantity, ForDept, Color, CIndex, OtherColumn1, OtherColumn2, OtherColumn3, OtherColumn4, OtherColumn5, PID, OtherDesc ) 
		Values ( @ActivitiesID, @EmployeeNo, @EmployeeNo, @SignupPlaces, 0, '', '', @ColumnAnswer_1, @ColumnAnswer_2, @ColumnAnswer_3, @ColumnAnswer_4, @ColumnAnswer_5, @TimeID, 'APP報名成功' )	
	End
End


GO


