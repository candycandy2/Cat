CREATE proc [dbo].[usp_Activities_Signup_Manage]
(
	@ActivitiesID int,
	@SignupModel int,
	@EmployeeNo Nvarchar(50)
)
As
Begin
-- 20171201 Hakkinen 活動詳情內容
-- 宣告變數
Declare @ActivitiesImageURL nvarchar(50) 
Declare @ActivitiesRemark nvarchar(256)

-- 設定變數
Set @ActivitiesImageURL = 'http://www.myqisda.com/services/Activities/upload/'
Set @ActivitiesRemark = ( Select Remark From Shopping_Remark with(nolock) Where 1=1 And RegisterMode = @SignupModel )

-- 個人報名
If @SignupModel = 1
	Begin
		Select 
			obqv.SID as 'ActivitiesID',
			obqv.ObjectName as 'ActivitiesName',
			@ActivitiesImageURL + obqv.imageName as 'ActivitiesImage',
			obqv.PersonalQtyLimit as 'LimitPlaces',
			IsNull(sp.SignupPlaces,0) as 'SignupPlaces',
			Case 
				When (IsNull(obqv.Quantity,0)-IsNull(obqv.TotalQty,0)) = 0 then 'Y' 
				Else 'N' 
				End As 'IsFull',
			obv.OtherColumnName1 as 'ColumnName_1',   
			obv.OtherColumnType1 as 'ColumnType_1',
			obv.OtherColumnitem1 as 'ColumnItem_1',	
			bv.OtherColumn1 as 'ColumnAnswer_1',	
			obv.OtherColumnName2 as 'ColumnName_2',	
			obv.OtherColumnType2 as 'ColumnType_2',
			obv.OtherColumnitem2 as 'ColumnItem_2',	
			bv.OtherColumn2 as 'ColumnAnswer_2',	
			obv.OtherColumnName3 as 'ColumnName_3',	
			obv.OtherColumnType3 as 'ColumnType_3',
			obv.OtherColumnitem3 as 'ColumnItem_3',	
			bv.OtherColumn3 as 'ColumnAnswer_3',	
			obv.OtherColumnName4 as 'ColumnName_4',	
			obv.OtherColumnType4 as 'ColumnType_4',
			obv.OtherColumnitem4 as 'ColumnItem_4',	
			bv.OtherColumn4 as 'ColumnAnswer_4',	
			obv.OtherColumnName5 as 'ColumnName_5',	
			obv.OtherColumnType5 as 'ColumnType_5',
			obv.OtherColumnitem5 as 'ColumnItem_5',	
			bv.OtherColumn5 as 'ColumnAnswer_5',
			@ActivitiesRemark as 'ActivitiesRemarks',
			bv.nam as 'EmployeeName',
			bv.BID as 'SignupNo',
			obqv.PersonalQtyStatus
		From Shopping_Object_Qty_View obqv with(nolock)
		Left join Shopping_Object_View obv with(nolock)	
			on obqv.SID = obv.SID
		Left join 
		(
			Select SID,SecClassNo,EmpNo,
			Sum(Quantity) as 'SignupPlaces'
			From Shopping_Buyer_View with(nolock)
			Where status in (0,1)	
			Group by SID,EmpNo,SecClassNo
		) sp 
			on obqv.SID = sp.SID And sp.EmpNo = @EmployeeNo
		Left join Shopping_Buyer_View bv with(nolock)
			on obqv.SID = bv.SID And bv.EmpNo = @EmployeeNo And bv.status in (0,1)	
		Where  1=1 
			And obqv.SID = @ActivitiesID 
	End
-- 眷屬報名
Else If @SignupModel = 3
	Begin
		Select 
			obv.SID as 'ActivitiesID',
			obv.ObjectName as 'ActivitiesName',
			@ActivitiesImageURL + obv.imageName as 'ActivitiesImage',
			obv.PersonalQtyLimit as 'LimitPlaces',
			IsNull(sp.SignupPlaces,0)  as 'SignupPlaces',
			ms.nam as 'EmployeeName',
			ms.id as 'EmpoyeeID',
			--Convert(Nvarchar(10),ms.Birthday,111) as 'EmployeeBirthday',
			Substring(Convert(Nvarchar(10),ms.Birthday),1,4) + '/' +
			Substring(Convert(Nvarchar(10),ms.Birthday),5,2) + '/' +
			Substring(Convert(Nvarchar(10),ms.Birthday),7,2)		
			as 'EmployeeBirthday',
			Case When ms.Gender = 0 then '女' Else '男' End as 'EmployeeGender',
			'同仁' as 'EmployeeRelationship',
			obv.OtherColumnName1 as 'ColumnName_1',   
			obv.OtherColumnType1 as 'ColumnType_1',	
			obv.OtherColumnItem1 as 'ColumnItem_1',
			rf.OtherColumn1 as 'ColumnAnswer_1',	
			obv.OtherColumnName2 as 'ColumnName_2',	
			obv.OtherColumnType2 as 'ColumnType_2',	
			obv.OtherColumnItem2 as 'ColumnItem_2',	
			rf.OtherColumn2 as 'ColumnAnswer_2',
			obv.OtherColumnName3 as 'ColumnName_3',	
			obv.OtherColumnType3 as 'ColumnType_3',	
			obv.OtherColumnItem3 as 'ColumnItem_3',	
			rf.OtherColumn3 as 'ColumnAnswer_3',
			obv.OtherColumnName4 as 'ColumnName_4',	
			obv.OtherColumnType4 as 'ColumnType_4',	
			obv.OtherColumnItem4 as 'ColumnItem_4',	
			rf.OtherColumn4 as 'ColumnAnswer_4',
			obv.OtherColumnName5 as 'ColumnName_5',	
			obv.OtherColumnType5 as 'ColumnType_5',	
			obv.OtherColumnItem5 as 'ColumnItem_5',	
			rf.OtherColumn5 as 'ColumnAnswer_5',											
			@ActivitiesRemark as 'ActivitiesRemarks',
			Case 
				When ( IsNull(obqv.Quantity,0) - IsNull(obqv.TotalQty,0) ) = 0 then 'Y' 
				Else 'N' 
				End As 'IsFull'
		From  memberall_simple ms with(nolock) ,Shopping_Object_View obv with(nolock)
		Left join 
		(
			Select SID,SecClassNo,EmpNo,
			Sum(Quantity) as 'SignupPlaces'
			From Shopping_Buyer_View with(nolock)
			Where status in (0,1)		
			Group by SID,EmpNo,SecClassNo
		) sp 
			on obv.SID = sp.SID And sp.EmpNo = @EmployeeNo
		Left join Shopping_Buyer_With_RF_View rf with(nolock)
			on obv.SID = rf.SID And rf.RF_Index = @EmployeeNo
		Left join Shopping_Object_Qty_View obqv with(nolock)
			on obqv.SID = obv.SID
		Where  1=1
			And obv.SID = @ActivitiesID 
			And obv.RegisterMode = @SignupModel
			And ms.Emp_No = @EmployeeNo
			And rf.status in (0 ,1)
	End
-- 組隊報名
Else If @SignupModel = 4
	Begin
		Select 
			obv.SID as 'ActivitiesID',
			obv.ObjectName as 'ActivitiesName',
			@ActivitiesImageURL + obv.imageName as 'ActivitiesImage',							
			@ActivitiesRemark as 'ActivitiesRemarks',
			(
				Select Count(*) as Qty 
				From Active_Team_Name with(nolock) 
				Where 1=1
					And sid = @ActivitiesID 
					And status = 1 
					And Agent = @EmployeeNo
			) as 'SignupTeam',
			--tn.TeamNo,
			atn.TeamID as 'TeamID',
			atn.TeamName as 'TeamName',
			atn.DeptNo as 'TeamDept',
			atn.MemberEName as 'TeamMember',
			atn.MemberDept as 'TeamMemberDept'
		From Shopping_Object_View obv
		Left join Active_Team_Member_View atn with(nolock)
			on obv.SID = atn.SID
		--Left join Active_Team_Member atm with(nolock)
		--	on atn.TeamID = atm.TeamID
		--Left join  memberall_simple ms with(nolock)
		--	on atm.EmpNo = ms.emp_no
		--Left join 
		--( 
		--	Select Row_Number() Over(Order By TeamID) As TeamNo, TeamID From Active_Team_Name with(nolock) 	Where 1=1 And sid = @ActivitiesID And status = 1 And Agent = @EmployeeNo
		--) tn
		--on atn.TeamID = tn.TeamID
		Where 1 = 1 
			And atn.Status = 1
			--And atn.DeleteDate is null
			And atn.Agent = @EmployeeNo
			And obv.SID = @ActivitiesID 
		order by atn.TeamID
	End
-- 時段報名
Else If @SignupModel = 5
	Begin
		Select 
			obqv.SID as 'ActivitiesID',
			obqv.ObjectName as 'ActivitiesName',
			@ActivitiesImageURL + obqv.imageName as 'ActivitiesImage',
			tm.PID as 'TimeID',
			tm.Seq as 'TimeSort',
			tm.Period as 'SignupTime',
			tm.Number as 'QuotaPlaces',
			IsNull(tm.Number,0) - IsNull(tm.TotalQty,0)  as 'RemainingPlaces',
			IsNull(rf.Period,'') as 'isSignupTime',
			obv.OtherColumnName1 as 'ColumnName_1',
			obv.OtherColumnType1 as 'ColumnType_1',	
			IsNull(rf.OtherColumn1,'') as 'ColumnAnswer_1',
			obv.OtherColumnName2 as 'ColumnName_2',
			obv.OtherColumnType2 as 'ColumnType_2',	
			IsNull(rf.OtherColumn2,'') as 'ColumnAnswer_2',
			obv.OtherColumnName3 as 'ColumnName_3',
			obv.OtherColumnType3 as 'ColumnType_3',	
			IsNull(rf.OtherColumn3,'') as 'ColumnAnswer_3',
			obv.OtherColumnName4 as 'ColumnName_4',
			obv.OtherColumnType4 as 'ColumnType_4',	
			IsNull(rf.OtherColumn4,'') as 'ColumnAnswer_4',
			obv.OtherColumnName5 as 'ColumnName_5',
			obv.OtherColumnType5 as 'ColumnType_5',	
			IsNull(rf.OtherColumn5,'') as 'ColumnAnswer_5',
			@ActivitiesRemark as 'ActivitiesRemarks',
			rf.nam as 'EmployeeName',
			rf.BID as 'SignupNo'
		From   Shopping_Object_View obv with(nolock) ,Shopping_Object_Qty_View obqv with(nolock)	
		Left join 
		(
			Select *,IsNull
			(
				(
					Select Sum(quantity) 
					From Shopping_Buyer 
					Where 1=1
						And Status in(0,1) 
						And Shopping_Buyer.sid = Active_Period.sid 
						And Shopping_Buyer.pid = Active_Period.pid
				),0
			) as TotalQty 
			From Active_Period 
			Where 1=1 
				And sid = @ActivitiesID 
		) tm 
			on obqv.SID = tm.SID
		Left join Shopping_Buyer_With_RF_View rf with(nolock)
			on obqv.SID = rf.SID And tm.PID = rf.PID And rf.status in (0,1) And rf.empno = @EmployeeNo
		Where  1=1 
			And obv.SID = @ActivitiesID 
			And obqv.SID = @ActivitiesID 
	End
End




GO


