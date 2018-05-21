CREATE proc [dbo].[usp_Activities_Family_Add]
(
	@EmployeeNo Nvarchar(50),
	@FamilyID Nvarchar(50),
	@FamilyName Nvarchar(50),
	@FamilyGender int,
	@FamilyRelationship int,
	@FamilyBirthday Nvarchar(50)

)
As
Begin
-- 20171201 Hakkinen 新增家屬資料
-- 宣告設定變數
Declare @FamilyGenderToString Nvarchar(1)
Set @FamilyGenderToString = Convert(Nvarchar(1),@FamilyGender)

Insert into UserAccount_RF 
(
	EmpNo,
    RF_ID,
    RF_Name,
    RF_Sex,
    RF_Relationship,
    RF_Birthday,
    CreDate,
    DeleteMark,
    DeleteDate,
    DeleteEmpNo,
    MaintainEmpNo,
    MaintainDate
)
Values 
(
	@EmployeeNo,
	@FamilyID,
	@FamilyName,
	@FamilyGenderToString,
	@FamilyRelationship,
	@FamilyBirthday,
	GetDate(),
	0,
	Null,
	Null,
	@EmployeeNo,
	GetDate()
)

End


GO


