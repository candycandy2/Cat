CREATE proc [dbo].[usp_Activities_Signup_Employee]
(
	@Employee Nvarchar(50)
)
As
Begin
-- 20171201 Hakkinen 查詢人員資料

	Select Top 50
		deptNo as 'EmployeeDept', 
		enam as 'EmployeeName', 
		emp_no as 'EmployeeNo' 
	From memberall_simple with(nolock)
	Where 1=1 
		And status = 0 
		And ( emp_no like '%' + @Employee + '%' or enam like '%' + @Employee + '%' )
	Order by enam
End
GO


