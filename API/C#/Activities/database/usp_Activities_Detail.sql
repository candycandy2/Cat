CREATE proc [dbo].[usp_Activities_Detail]
(
	@ActivitiesID int,
	@EmployeeNo Nvarchar(50)
)
As
Begin

-- 20171201 Hakkinen 活動詳情內容
-- 宣告變數
Declare @ActivitiesImageURL Nvarchar(50) 
Declare @SignupPlaces int 
Declare @ActivitiesPlaces int 
Declare @SignupModel int 

-- 設定變數

Set @SignupPlaces = 0
Set @ActivitiesPlaces = 0

Select @SignupModel = RegisterMode From Shopping_Object_For_ActivitiesApp with(nolock) Where 1=1 And ActivitiesID = @ActivitiesID 


Select       
dbo.Shopping_Buyer.SID, 
dbo.Shopping_Buyer.EmpNo, 
Convert(int, dbo.Shopping_Buyer.Quantity) as Quantity, 
dbo.Shopping_Object_For_ActivitiesApp.ClassNo, 
dbo.Shopping_Object_For_ActivitiesApp.SecClassNo
into #Temp_Shopping_Buyer
From  Shopping_Buyer with(nolock)
Left join Shopping_Object_For_ActivitiesApp with(nolock)
	ON dbo.Shopping_Buyer.SID = dbo.Shopping_Object_For_ActivitiesApp.ActivitiesID 
Where Shopping_Buyer.CreDate Between DateAdd(Month, - 2, GetDate()) And GetDate()
	And dbo.Shopping_Buyer.EmpNo = @EmployeeNo
	And dbo.Shopping_Buyer.Status in (0,1)


if @SignupModel = 4
Begin
	-- 20180122 Hakkinen 組隊
	-- 組隊 - 個人已報名組數
	Select @SignupPlaces = Count(Distinct TeamID) 
	From Active_Team_Member_View with(nolock)
		Where 1=1 
			And Status = 1 
			And SID = @ActivitiesID 
			And Agent = @EmployeeNo
	Group by SID, Agent

	-- 組隊 - 已報名組數
	Select @ActivitiesPlaces = Count(Distinct TeamID)
	From Active_Team_Member_View with(nolock)
		Where 1=1 
			And Status = 1 
			And SID = @ActivitiesID
	Group by SID

Select 
	obv.ActivitiesID,
	obv.ActivitiesName,
	obv.ActivitiesImage,
	obv.ActivitiesContent,
	obv.SignupModel,
	obv.SignupDate,
	obv.Deadline,
	( IsNull(obv.QuotaPlaces,0) / isnull(obv.TeamNumber,0) ) as 'QuotaPlaces',
	IsNull(@ActivitiesPlaces,0) as 'ActivitiesPlaces',
	obv.LimitPlaces,
	IsNull(@SignupPlaces,0) as 'SignupPlaces',
	Case 
		When @SignupPlaces <> 0 
		Then 'Y' 
		Else 'N' 
		End As 'IsSignup',
	'N' As 'IsRepeatSignup',
	Case 
		When ( (IsNull(obv.Quantity,0) / IsNull(obv.TeamNumber,0) ) - IsNull(@ActivitiesPlaces,0) ) <= 0 
		Then 'Y' 
		Else 'N' 
		End As 'IsFull'
From Shopping_Object_For_ActivitiesApp obv with(nolock)	
Where 1=1 
	And obv.ActivitiesID = @ActivitiesID
	And obv.SignupModel = 4

End

Else

Begin

Select @ActivitiesPlaces = IsNull(Sum(Quantity),0) From Shopping_Buyer with(nolock) Where 1=1 And SID = @ActivitiesID And status in ( 0, 1 )
Select @SignupPlaces = IsNull(Sum(Quantity),0) From #Temp_Shopping_Buyer with(nolock) Where 1=1 And SID = @ActivitiesID 

-- Select 活動詳情內容
Select 
	obv.ActivitiesID,
	obv.ActivitiesName,
	obv.ActivitiesImage,
	obv.ActivitiesContent,
	obv.SignupModel,
	obv.SignupDate,
	obv.Deadline,
	obv.QuotaPlaces,
	IsNull(@ActivitiesPlaces,0) as 'ActivitiesPlaces',
    obv.LimitPlaces,
	--IsNull(sb.SignupPlaces,0) as 'SignupPlaces',
	--Case 
	--	When sb.EmpNo is not null 
	--	Then 'Y' 
	--	Else 'N' 
	--	End As 'IsSignup',
	IsNull(@SignupPlaces,0) as 'SignupPlaces',
	Case 
		When @SignupPlaces <> 0
		Then 'Y' 
		Else 'N' 
		End As 'IsSignup',
	Case 
		When su.EmpNo is not null 
		Then 'Y' 
		Else 'N' 
		End As 'IsRepeatSignup',
	Case 
		When ( IsNull(obv.QuotaPlaces,0) - IsNull(@ActivitiesPlaces,0) ) = 0 
		Then 'Y' 
		Else 'N' 
		End As 'IsFull'
From Shopping_Object_For_ActivitiesApp obv with(nolock)	
--Left join 
--(
--	Select SID,SecClassNo,EmpNo,
--	Sum(Quantity) as 'SignupPlaces'
--	From #Temp_Shopping_Buyer with(nolock)
--	--Where Status in (0,1)	
--	Group by SID,EmpNo,SecClassNo
--) sb 
--	on obv.ActivitiesID = sb.SID --And sb.EmpNo = @EmployeeNo
Left join
(
	Select SecClassNo,EmpNo
	From #Temp_Shopping_Buyer with(nolock)	
	--Where Status in (0,1)
	Group by SID,EmpNo,SecClassNo
) su
	on obv.SecClassNo = su.SecClassNo --And su.EmpNo = @EmployeeNo
Where 1=1 
	And obv.ActivitiesID = @ActivitiesID
	And obv.SignupModel in ( 1,3,5 )

End 

Drop table #Temp_Shopping_Buyer

End



GO


