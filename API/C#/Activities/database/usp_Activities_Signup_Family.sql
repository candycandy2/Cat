CREATE proc [dbo].[usp_Activities_Signup_Family]
(
	@ActivitiesID int,
	@EmployeeNo Nvarchar(50),
	@IsSignup Nvarchar(1)
)
As
Begin
-- 20171201 Hakkinen 眷屬報名資訊
-- 宣告變數
Declare @ActivitiesName Nvarchar(256)
Declare @ActivitiesImage Nvarchar(256)
Declare @ActivitiesRemark nvarchar(256)
Declare @ColumnName_1 Nvarchar(256)
Declare @ColumnType_1 Nvarchar(256)
Declare @ColumnItem_1 Nvarchar(256)
Declare @ColumnName_2 Nvarchar(256)
Declare @ColumnType_2 Nvarchar(256)
Declare @ColumnItem_2 Nvarchar(256)
Declare @ColumnName_3 Nvarchar(256)
Declare @ColumnType_3 Nvarchar(256)
Declare @ColumnItem_3 Nvarchar(256)
Declare @ColumnName_4 Nvarchar(256)
Declare @ColumnType_4 Nvarchar(256)
Declare @ColumnItem_4 Nvarchar(256)
Declare @ColumnName_5 Nvarchar(256)
Declare @ColumnType_5 Nvarchar(256)
Declare @ColumnItem_5 Nvarchar(256)

-- 設定變數
Set @ActivitiesRemark = ( Select Remark From Shopping_Remark with(nolock) Where 1=1 And RegisterMode = 3 )

Select  
	@ActivitiesName = objectName , 
	@ActivitiesImage = ( 'http://www.myqisda.com/services/Activities/upload/'+imageName ), 
	@ColumnName_1 = OtherColumnName1 ,   
	@ColumnType_1 = OtherColumnType1 ,	
	@ColumnItem_1 = OtherColumnItem1 ,
	@ColumnName_2 = OtherColumnName2 ,   
	@ColumnType_2 = OtherColumnType2 ,	
	@ColumnItem_2 = OtherColumnItem2 ,
	@ColumnName_3 = OtherColumnName3 ,   
	@ColumnType_3 = OtherColumnType3 ,	
	@ColumnItem_3 = OtherColumnItem3 ,
	@ColumnName_4 = OtherColumnName4 ,   
	@ColumnType_4 = OtherColumnType4 ,	
	@ColumnItem_4 = OtherColumnItem4 ,
	@ColumnName_5 = OtherColumnName5 ,   
	@ColumnType_5 = OtherColumnType5 ,	
	@ColumnItem_5 = OtherColumnItem5
From Shopping_Object_View with(nolock) 
Where 1=1 
	And SID = @ActivitiesID

-- 未報名
If @IsSignup = 'N'
	Begin
		Select 
			@ActivitiesID as 'ActivitiesID',
			@ActivitiesName as 'ActivitiesName',
			@ActivitiesImage as 'ActivitiesImage',
			rf.RF_Name as 'FamilyName',
			rf.RF_ID as 'FamilyID',
			rf.RF_Index as 'FamilyNo',
			Convert(Nvarchar(10),rf.RF_Birthday,111) as 'FamilyBirthday',
			rf.RF_Sex_Desc as 'GenderDesc',
			Convert(int,rf.RF_Sex) as 'FamilyGender',
			rf.RF_Relationship_Desc as 'RelationshipDesc',
			Convert(int,rf.RF_Relationship) as 'FamilyRelationship',
			@ColumnName_1 as 'ColumnName_1',   
			@ColumnType_1 as 'ColumnType_1',	
			@ColumnItem_1 as 'ColumnItem_1',
			@ColumnName_2 as 'ColumnName_2',	
			@ColumnType_2 as 'ColumnType_2',	
			@ColumnItem_2 as 'ColumnItem_2',	
			@ColumnName_3 as 'ColumnName_3',	
			@ColumnType_3 as 'ColumnType_3',	
			@ColumnItem_3 as 'ColumnItem_3',
			@ColumnName_4 as 'ColumnName_4',	
			@ColumnType_4 as 'ColumnType_4',	
			@ColumnItem_4 as 'ColumnItem_4',
			@ColumnName_5 as 'ColumnName_5',	
			@ColumnType_5 as 'ColumnType_5',	
			@ColumnItem_5 as 'ColumnItem_5',												
			@ActivitiesRemark as 'ActivitiesRemarks'
		From  UserAccount_RF_View rf with(nolock) ,Shopping_Object_View obv with(nolock)
		Where  1=1
			And obv.SID = @ActivitiesID 
			And obv.RegisterMode = 3
			And rf.EmpNo = @EmployeeNo
			And rf.DeleteMark = 0
		order by rf.RF_Name
	End
-- 已報名
Else
	Begin
	Select-- 'Test'
		@ActivitiesID as 'ActivitiesID',
		@ActivitiesName as 'ActivitiesName',
		@ActivitiesImage as 'ActivitiesImage',
		Case When brf.BID is not null then 'Y' Else 'N' End as 'IsSignup',
		rf.RF_Name as 'FamilyName',
		rf.RF_ID as 'FamilyID',
		rf.RF_Index as 'FamilyNo',
		Convert(Nvarchar(10),rf.RF_Birthday,111) as 'FamilyBirthday',
		Case rf.RF_Sex When 0 then '女' Else '男' End as 'GenderDesc',
		Convert(int,rf.RF_Sex) as 'FamilyGender',
		rfr.RF_Relationship_Desc as 'RelationshipDesc',
		Convert(int,rf.RF_Relationship) as 'FamilyRelationship',
		@ColumnName_1 as 'ColumnName_1',   
		@ColumnType_1 as 'ColumnType_1',	
		@ColumnItem_1 as 'ColumnItem_1',
		isnull(brf.OtherColumn1,'') as 'ColumnAnswer_1',	
		@ColumnName_2 as 'ColumnName_2',	
		@ColumnType_2 as 'ColumnType_2',	
		@ColumnItem_2 as 'ColumnItem_2',	
		isnull(brf.OtherColumn2,'') as 'ColumnAnswer_2',		
		@ColumnName_3 as 'ColumnName_3',	
		@ColumnType_3 as 'ColumnType_3',	
		@ColumnItem_3 as 'ColumnItem_3',
		isnull(brf.OtherColumn3,'') as 'ColumnAnswer_3',			
		@ColumnName_4 as 'ColumnName_4',	
		@ColumnType_4 as 'ColumnType_4',	
		@ColumnItem_4 as 'ColumnItem_4',
		isnull(brf.OtherColumn4,'') as 'ColumnAnswer_4',			
		@ColumnName_5 as 'ColumnName_5',	
		@ColumnType_5 as 'ColumnType_5',	
		@ColumnItem_5 as 'ColumnItem_5',
		isnull(brf.OtherColumn5,'') as 'ColumnAnswer_5',														
		@ActivitiesRemark as 'ActivitiesRemarks'
	From  UserAccount_RF rf with(nolock)
	Left join Shopping_Buyer_With_RF_View brf with(nolock)
	on rf.RF_Index = brf.RF_Index And brf.SID = @ActivitiesID And brf.status in (0,1)
	Left join UserAccount_RF_Desc rfr with(nolock)
	on rf.RF_Relationship = rfr.RF_Relationship
	Where  1=1
		And rf.EmpNo = @EmployeeNo
		And rf.DeleteMark = 0
	order by rf.RF_Name

	End
End




GO


