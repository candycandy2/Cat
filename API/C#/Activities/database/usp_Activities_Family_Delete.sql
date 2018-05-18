CREATE proc [dbo].[usp_Activities_Family_Delete]
(
	@EmployeeNo Nvarchar(50),
	@FamilyNo int
)
As
Begin
-- 20171201 Hakkinen 刪除家屬資料

Update UserAccount_RF 
Set	
	DeleteMark = 1,
	DeleteDate = Getdate(),
	DeleteEmpNo = @EmployeeNo
Where EmpNo = @EmployeeNo 
	And RF_index = @FamilyNo

End



GO


