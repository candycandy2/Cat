CREATE proc [dbo].[usp_Activities_Family_Delete]
(
	@EmployeeNo Nvarchar(50),
	@FamilyNo int
)
As
Begin
-- 20171201 Hakkinen �R���a�ݸ��

Update UserAccount_RF 
Set	
	DeleteMark = 1,
	DeleteDate = Getdate(),
	DeleteEmpNo = @EmployeeNo
Where EmpNo = @EmployeeNo 
	And RF_index = @FamilyNo

End



GO


