CREATE proc [dbo].[usp_Activities_List]
(
	@EmployeeNo Nvarchar(50)
)
As
Begin
-- 20171201 Hakkinen 活動清單列表
-- 宣告變數
Declare @Company nvarchar(50) 

-- 設定變數
Set @Company = ( Select Compid From Memberall_Simple Where Emp_No = @EmployeeNo )
Set @Company = '%' + @Company + '%'

Select 
	isnull(a.ActivitiesID,0) as 'ActivitiesID',
	sum(isnull(b.Quantity,0))  As 'TotalQty'
into #Temp_Shopping_Object_Qty_View_For_ActivitiesApp
From  Shopping_Object_For_ActivitiesApp a
Left join Shopping_Buyer b
	on a.ActivitiesID = b.sid And b.Status IN (0, 1)
Group by a.ActivitiesID

Select 
	obv.StartDate,
	obv.ActivitiesID,
	obv.ActivitiesName,
	obv.ActivitiesImage,
	obv.SignupModel,
	obv.QuotaPlaces,
	(obv.QuotaPlaces-obqv.TotalQty) as 'RemainingPlaces',
	obv.SignupDate,
	Case 
		When obv.StartDate < GetDate() And obv.EndDate > GetDate()  
		Then 'Y' 
		When obv.StartDate is null or obv.EndDate is null
		Then 'Y'
		Else 'N' 
		End as 'ActivitiesStatus'
From #Temp_Shopping_Object_Qty_View_For_ActivitiesApp obqv
Left join Shopping_Object_For_ActivitiesApp obv	
	on obqv.ActivitiesID = obv.ActivitiesID
Where
	(
		obv.ActivityStatus=0 
		or 
		(
			obv.ActivityStatus=1 
			and DateDiff( minute,obv.StartDate,getdate() )>= 0 
			and DateDiff( minute,obv.EndDate,getdate() ) <= 0
		) 
	)
	And obv.Role like @Company -- 可報名活動的公司
	And obv.ActivitiesID not in ( Select SID From Restricted_List Group by SID ) -- 限制人員名單
	And obv.OpenStatus = 1 -- OpenStatus ( 開放1 未開放0 ) 
	And obv.SignupModel is not null

union 

Select 
	obv.StartDate,
	obv.ActivitiesID,
	obv.ActivitiesName,
	obv.ActivitiesImage,
	obv.SignupModel,
	obv.QuotaPlaces,
	(obv.QuotaPlaces-obqv.TotalQty) as 'RemainingPlaces',
	obv.SignupDate,
	Case 
		When obv.StartDate < GetDate() And obv.EndDate > GetDate()  
		Then 'Y' 
		When obv.StartDate is null or obv.EndDate is null
		Then 'Y'
		Else 'N' 
		End as 'ActivitiesStatus'
From #Temp_Shopping_Object_Qty_View_For_ActivitiesApp obqv
Left join Shopping_Object_For_ActivitiesApp obv	
	on obqv.ActivitiesID = obv.ActivitiesID
Left join Restricted_List rlv
	on obqv.ActivitiesID = rlv.SID 
Where
	(
		obv.ActivityStatus=0 
		or 
		(
			obv.ActivityStatus=1 
			And DateDiff( minute,obv.StartDate,getdate() )>= 0 
			And DateDiff( minute,obv.EndDate,getdate() ) <= 0
		) 
	)
	And obv.Role like @Company -- 可報名活動的公司
	And rlv.EmpNo = @EmployeeNo
	And obv.OpenStatus = 1 -- OpenStatus ( 開放1 未開放0 ) 
	And obv.SignupModel is not null

union

Select 
	obv.StartDate,
	obv.ActivitiesID,
	obv.ActivitiesName,
	obv.ActivitiesImage,
	obv.SignupModel,
	obv.QuotaPlaces,
	(obv.QuotaPlaces-obqv.TotalQty) as 'RemainingPlaces',
	obv.SignupDate,
	Case 
		When obv.StartDate < GetDate() And obv.EndDate > GetDate()  
		Then 'Y' 
		When obv.StartDate is null or obv.EndDate is null
		Then 'Y'
		Else 'N' 
		End as 'ActivitiesStatus'
From #Temp_Shopping_Object_Qty_View_For_ActivitiesApp obqv
Left join Shopping_Object_For_ActivitiesApp obv	
	on obqv.ActivitiesID = obv.ActivitiesID
Where
	(
			obv.ActivityStatus=1 
			and DateDiff( minute,obv.EndDate,getdate() ) < 0
	)
	And obv.Role like @Company -- 可報名活動的公司
	And obv.ActivitiesID not in ( Select SID From Restricted_List Group by SID ) -- 限制人員名單
	And obv.OpenStatus = 1 -- OpenStatus ( 開放1 未開放0 ) 
	And obv.SignupModel is not null

union 

Select 
	obv.StartDate,
	obv.ActivitiesID,
	obv.ActivitiesName,
	obv.ActivitiesImage,
	obv.SignupModel,
	obv.QuotaPlaces,
	(obv.QuotaPlaces-obqv.TotalQty) as 'RemainingPlaces',
	obv.SignupDate,
	Case 
		When obv.StartDate < GetDate() And obv.EndDate > GetDate()  
		Then 'Y' 
		When obv.StartDate is null or obv.EndDate is null
		Then 'Y'
		Else 'N' 
		End as 'ActivitiesStatus'
From #Temp_Shopping_Object_Qty_View_For_ActivitiesApp obqv
Left join Shopping_Object_For_ActivitiesApp obv	
	on obqv.ActivitiesID = obv.ActivitiesID
Left join Restricted_List rlv
	on obqv.ActivitiesID = rlv.SID 
Where
	(
			obv.ActivityStatus=1 
			And DateDiff( minute,obv.EndDate,getdate() ) < 0
	)
	And obv.Role like @Company -- 可報名活動的公司
	And rlv.EmpNo = @EmployeeNo
	And obv.OpenStatus = 1 -- OpenStatus ( 開放1 未開放0 ) 
	And obv.SignupModel is not null

order by obv.StartDate desc ,ActivitiesName 

Drop Table #Temp_Shopping_Object_Qty_View_For_ActivitiesApp 


End






GO


