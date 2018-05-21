CREATE proc [dbo].[usp_Activities_Record]
(
	@EmployeeNo Nvarchar(50)
)
As
Begin
-- 20171201 Hakkinen 已報名資訊

Select *
into #Temp_Shopping_Object_View
From Shopping_Object_View with(nolock)
Where 1=1 
	And Convert(Nvarchar(10),EventDate ,120) + '22:00:00' >= Convert(Nvarchar(19),GetDate() ,120)

Select *
into #Temp_Shopping_Buyer_With_RF_View
From Shopping_Buyer_With_RF_View with(nolock)
Where 1=1 
	And EmpNo = @EmployeeNo
	And Status in ( 0, 1)
	And Convert(Nvarchar(10),EventDate ,120) + '22:00:00' >= Convert(Nvarchar(19),GetDate() ,120)

Select *
into #Temp_Active_Team_Member_View
From Active_Team_Member_View with(nolock)
Where 1=1 
	And MemberEmpNo = @EmployeeNo 
	And Status = 1

Select 
	obv.SID as 'ActivitiesID',
	obv.ObjectName as 'ActivitiesName',
	obv.RegisterMode as 'SignupModel',
	Case 
		When atm.TeamID Is Not Null then Convert(bigint,atm.TeamID)
		Else btf.BID
		End as 'SignupNo',
	Case 
		When obv.RegisterMode = 4 then 1 
		Else btf.Quantity 
		End as 'SignupPlaces',
	Case 
		When btf.EmpNo Is Not Null then btf.EmpNo 
		When atm.MemberEmpNo Is Not Null then atm.MemberEmpNo 
		Else '' 
		End as 'EmployeeNo',
	Case 
		When btf.EmpNo <> btf.RF_Index And btf.RF_Index Is Not Null then btf.RF_Name
		When btf.nam Is Not Null then btf.nam 
		When atm.MemberName Is Not Null then atm.MemberName 
		Else '' 
		End as 'SignupName',
	Case 
		When obv.RegisterMode <> 3  or btf.EmpNo = btf.RF_Index then '同仁'
		Else btf.RF_Relationship_Desc 
		End as 'SignupRelationship',
	Case 
		When btf.EmpNo <> btf.RF_Index And btf.RF_Index Is Not Null then 'N'
		When atm.Agent <> atm.MemberEmpNo then 'N' 
		When GetDate() > obv.EndDate then 'N' 
		Else 'Y' 
		End as 'CanCancel',
	IsNull(btf.Period, '') as 'SignupTime',
	IsNull(atm.TeamName, '') as 'SignupTeamName',
	Convert(Nvarchar,obv.EndDate,111)  + ' ' + Substring(Convert(Nvarchar,obv.EndDate,114),0,6) as 'Deadline'
From #Temp_Shopping_Object_View obv with(nolock)
Left join #Temp_Shopping_Buyer_With_RF_View btf with(nolock)
	on obv.SID = btf.SID 
	--And btf.EmpNo = @EmployeeNo
	--And btf.Status in ( 0, 1)
Left join #Temp_Active_Team_Member_View atm with(nolock)
	on obv.SID = atm.SID 
	--And atm.MemberEmpNo = @EmployeeNo 
	--And atm.Status = 1
Where 1=1 
	And 
	( 
		btf.BID Is Not Null  
		or atm.SID Is Not Null 
	)
--And obv.EventDate >= GetDate()
--order by obv.SID desc
order by obv.EventDate, SignupNo Asc

Drop Table #Temp_Shopping_Object_View
Drop Table #Temp_Shopping_Buyer_With_RF_View
Drop Table #Temp_Active_Team_Member_View

End


GO


