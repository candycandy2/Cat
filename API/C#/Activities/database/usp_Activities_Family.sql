CREATE proc [dbo].[usp_Activities_Family]
(
	@EmployeeNo Nvarchar(50)
)
As
Begin

Declare @FamilyRemark nvarchar(256)
Set @FamilyRemark = ( Select Remark From Shopping_Remark with(nolock) Where 1=1 And RegisterMode = 99 )

Select * 
into #Temp_UserAccount_RF_View 
From UserAccount_RF_View 
Where 1=1
	And DeleteMark = 0
	And EmpNo = @EmployeeNo 

-- 20171201 Hakkinen 家屬清單列表
Select Distinct
	rf.RF_Index	 as 'FamilyNo',	
	rf.RF_ID     as 'FamilyID',	
	rf.RF_Name   as 'FamilyName',	
	Convert(int,rf.RF_Sex)          as 'FamilyGender',
	Convert(int,rf.RF_Relationship)	as 'FamilyRelationship',
	Convert(Nvarchar(10),rf.RF_Birthday,111) as 'FamilyBirthday' ,	
	rf.RF_Sex_Desc			as 'GenderDesc',
	rf.RF_Relationship_Desc as 'RelationshipDesc',	
	Case 
		When brf.EventDate >= GetDate() 
		Then 'Y' 
		Else 'N' 
		End as 'IsActivities',
	@FamilyRemark as 'FamilyRemark'
From #Temp_UserAccount_RF_View rf with(nolock)
Left join Shopping_Buyer_With_RF_View brf with(nolock)
	on rf.RF_Index = brf.RF_Index And brf.Status in (0,1)
Where 1=1
--Group by 	
--	rf.RF_Index	 ,		
--	rf.RF_ID  ,		
--	rf.RF_Name  ,	
--	rf.RF_Sex          ,
--	rf.RF_Relationship ,
--	rf.RF_Birthday,	
--	rf.RF_Sex_Desc	,
--	rf.RF_Relationship_Desc ,
--	brf.EventDate

Drop Table #Temp_UserAccount_RF_View 

End


GO


