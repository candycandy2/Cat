CREATE proc [dbo].[usp_Activities_Signup]
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
			obv.SID as 'ActivitiesID',
			obv.ObjectName as 'ActivitiesName',
			@ActivitiesImageURL + obv.imageName as 'ActivitiesImage',
			obv.PersonalQtyLimit as 'LimitPlaces',
			obv.OtherColumnName1 as 'ColumnName_1',   
			obv.OtherColumnType1 as 'ColumnType_1',	
			obv.OtherColumnItem1 as 'ColumnItem_1',	
			obv.OtherColumnName2 as 'ColumnName_2',	
			obv.OtherColumnType2 as 'ColumnType_2',	
			obv.OtherColumnItem2 as 'ColumnItem_2',	
			obv.OtherColumnName3 as 'ColumnName_3',	
			obv.OtherColumnType3 as 'ColumnType_3',	
			obv.OtherColumnItem3 as 'ColumnItem_3',	
			obv.OtherColumnName4 as 'ColumnName_4',	
			obv.OtherColumnType4 as 'ColumnType_4',	
			obv.OtherColumnItem4 as 'ColumnItem_4',	
			obv.OtherColumnName5 as 'ColumnName_5',	
			obv.OtherColumnType5 as 'ColumnType_5',	
			obv.OtherColumnItem5 as 'ColumnItem_5',
			@ActivitiesRemark as 'ActivitiesRemarks',
			Case 
				When rsp.EmpNo is not null 
				Then 'Y' 
				Else 'N' 
				End as 'IsRepeatSignup'
		From  Shopping_Object_View obv with(nolock)	
		Left join
		(
			Select SecClassNo,EmpNo
			From Shopping_Buyer_View c with(nolock)	
			Where Status in (0,1)
			Group by SID,EmpNo,SecClassNo
		) rsp
		on obv.SecClassNo = rsp.SecClassNo and rsp.EmpNo = @EmployeeNo
		Where 1=1 
			And obv.SID = @ActivitiesID 
			And obv.RegisterMode = @SignupModel
	End
-- 眷屬報名
Else If @SignupModel = 3
	Begin
		Select 
			obv.SID as 'ActivitiesID',
			obv.ObjectName as 'ActivitiesName',
			@ActivitiesImageURL + obv.imageName as 'ActivitiesImage',
			obv.PersonalQtyLimit as 'LimitPlaces',
			IsNull(sp.SignupPlaces,0) as 'SignupPlaces',
			ms.nam as 'EmployeeName',
			ms.id as 'EmpoyeeID',
			--Convert(Nvarchar(10),ms.Birthday,111) as 'EmployeeBirthday',
			Substring(Convert(Nvarchar(10),ms.Birthday),1,4) + '/' +
			Substring(Convert(Nvarchar(10),ms.Birthday),5,2) + '/' +
			Substring(Convert(Nvarchar(10),ms.Birthday),7,2)		
			as 'EmployeeBirthday',
			Case
				when ms.Gender = 0 then '女'
				Else '男'
				End as 'EmployeeGender',
			'同仁' as 'EmployeeRelationship',
			obv.OtherColumnName1 as 'ColumnName_1',   
			obv.OtherColumnType1 as 'ColumnType_1',	
			obv.OtherColumnItem1 as 'ColumnItem_1',	
			obv.OtherColumnName2 as 'ColumnName_2',	
			obv.OtherColumnType2 as 'ColumnType_2',	
			obv.OtherColumnItem2 as 'ColumnItem_2',	
			obv.OtherColumnName3 as 'ColumnName_3',	
			obv.OtherColumnType3 as 'ColumnType_3',	
			obv.OtherColumnItem3 as 'ColumnItem_3',	
			obv.OtherColumnName4 as 'ColumnName_4',	
			obv.OtherColumnType4 as 'ColumnType_4',	
			obv.OtherColumnItem4 as 'ColumnItem_4',	
			obv.OtherColumnName5 as 'ColumnName_5',	
			obv.OtherColumnType5 as 'ColumnType_5',	
			obv.OtherColumnItem5 as 'ColumnItem_5',												
			@ActivitiesRemark as 'ActivitiesRemarks',
			Case 
				When rsp.EmpNo is not null 
				Then 'Y'
				Else 'N' 
				End as 'IsRepeatSignup'
		From  memberall_simple ms with(nolock) ,Shopping_Object_View obv with(nolock)
		Left join 
		(
			Select SID,SecClassNo,EmpNo,
			Sum(Quantity) as 'SignupPlaces'
			From Shopping_Buyer_View with(nolock)
			Where Status in (0,1)	
			Group by SID,EmpNo,SecClassNo
		) sp 
		on obv.SID = sp.SID and sp.EmpNo = @EmployeeNo
		Left join
		(
			Select SecClassNo,EmpNo
			From Shopping_Buyer_View c with(nolock)	
			Where Status in (0,1)
			Group by SID,EmpNo,SecClassNo
		) rsp
		on obv.SecClassNo = rsp.SecClassNo and rsp.EmpNo = @EmployeeNo
		Where  1=1
			And obv.SID = @ActivitiesID 
			And obv.RegisterMode = @SignupModel
			And ms.Emp_No = @EmployeeNo
	End
-- 組隊報名
Else If @SignupModel = 4
	Begin
		Select 
			SID as 'ActivitiesID',
			ObjectName as 'ActivitiesName',
			Convert(int,TeamNumber) as 'LimitPlaces',
			@ActivitiesImageURL + imageName as 'ActivitiesImage',							
			@ActivitiesRemark as 'ActivitiesRemarks',
			'N' as 'IsRepeatSignup'
		From Shopping_Object_View with(nolock)	
		Where  1=1
			And SID = @ActivitiesID 
	End
-- 時段報名
Else If @SignupModel = 5
	Begin
		Select 
			obv.SID as 'ActivitiesID',
			obv.ObjectName as 'ActivitiesName',
			@ActivitiesImageURL + obv.imageName as 'ActivitiesImage',
			obv.RegisterMode as 'SignupModel',
			obv.PersonalQtyLimit as 'LimitPlaces',
			obv.OtherColumnName1 as 'ColumnName_1',   
			obv.OtherColumnType1 as 'ColumnType_1',	
			obv.OtherColumnItem1 as 'ColumnItem_1',	
			obv.OtherColumnName2 as 'ColumnName_2',	
			obv.OtherColumnType2 as 'ColumnType_2',	
			obv.OtherColumnItem2 as 'ColumnItem_2',	
			obv.OtherColumnName3 as 'ColumnName_3',	
			obv.OtherColumnType3 as 'ColumnType_3',	
			obv.OtherColumnItem3 as 'ColumnItem_3',	
			obv.OtherColumnName4 as 'ColumnName_4',	
			obv.OtherColumnType4 as 'ColumnType_4',	
			obv.OtherColumnItem4 as 'ColumnItem_4',	
			obv.OtherColumnName5 as 'ColumnName_5',	
			obv.OtherColumnType5 as 'ColumnType_5',	
			obv.OtherColumnItem5 as 'ColumnItem_5',
			t.PID as 'TimeID',
			t.Seq as 'TimeSort',
			t.Period as 'SignupTime',
			t.Number as 'QuotaPlaces',
			IsNull(t.Number,0) - IsNull(t.TotalQty,0) as 'RemainingPlaces',
			@ActivitiesRemark as 'ActivitiesRemarks',
			Case 
				When rsp.EmpNo is not null 
				Then 'Y' 
				Else 'N' 
				End as 'IsRepeatSignup'
		From  Shopping_Object_View obv with(nolock)	
		Left join 
		(
			Select *,		
				IsNull
				(
					(	
						Select Sum(quantity) 
						From Shopping_Buyer with(nolock)
						Where 1=1
							And status in (0,1) 
							And Shopping_Buyer.sid = Active_Period.sid 
							And Shopping_Buyer.pid = Active_Period.pid
					),0 
				) as TotalQty 
			From Active_Period with(nolock) 
			Where 1=1 
				And sid= @ActivitiesID 
		) t 
		on obv.SID = t.SID
		Left join
		(
			Select SecClassNo,EmpNo
			From Shopping_Buyer_View c with(nolock)
			Where Status in (0,1)	
			Group by SID,EmpNo,SecClassNo
		) rsp
		on obv.SecClassNo = rsp.SecClassNo And rsp.EmpNo = @EmployeeNo
		Where  1=1
			And obv.SID = @ActivitiesID 
			And obv.RegisterMode = @SignupModel
	End
End




GO


