CREATE proc [dbo].[usp_Activities_Family_Update]
(
	@EmployeeNo Nvarchar(50),
	@FamilyNo int,
	@FamilyID Nvarchar(50),
	@FamilyGender int,
	@FamilyRelationship int,
	@FamilyBirthday Nvarchar(50)

)
As
Begin

-- 20171114 Hakkinen ��s�a�ݸ��
-- �ŧi�]�w�ܼ�
Declare @FamilyGenderToString Nvarchar(1)
Set @FamilyGenderToString = Convert(Nvarchar(1),@FamilyGender)

Update UserAccount_RF 
Set	
	RF_ID = @FamilyID,
	RF_Sex = @FamilyGenderToString,
	RF_Relationship = @FamilyRelationship,
	RF_Birthday = @FamilyBirthday,
	MaintainEmpNo = @EmployeeNo,
	MaintainDate = Getdate()
Where EmpNo = @EmployeeNo
	And RF_index = @FamilyNo

End


GO


