CREATE proc [dbo].[usp_Activities_Signup_Places_Check]
(
	@ActivitiesID int,
	@SignupModel int,
	@SignupPlaces int,
	@TimeID int,
	@EmployeeNo Nvarchar(10),
	@IsFull int output
)
As
Begin

-- 20171124 Hakkinen �T�{���W
-- �ŧi�ܼ�
Declare @QuotaPlaces int
Set @QuotaPlaces = 0
Declare @IsSignupPlaces int 
Set @QuotaPlaces = 0
Declare @CanSignupPlaces int 
Set @CanSignupPlaces = 0
Set @IsFull = 0

-- �ӤH���W
If @SignupModel = 1
	Begin
		-- �p��ӤH�w���W�W�B
		Select @IsSignupPlaces = Quantity 
		From Shopping_buyer_View obqv with(nolock)
		Where  1=1 
			And obqv.SID = @ActivitiesID
			And obqv.EmpNo = @EmployeeNo
			And status in (0,1)

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)

		-- �Ѿl�W�B�[�W�w���W�W�B����i���W���W�B
		Select @CanSignupPlaces = ( @IsSignupPlaces + (IsNull(obqv.Quantity,0) - IsNull(obqv.TotalQty,0)) )
		From Shopping_Object_Qty_View obqv with(nolock)
		where  1=1 
			And obqv.SID = @ActivitiesID
		
		-- �P�_�i���W���W�B�����ثe�n���W�W�B�O�_��-1 �p�G�t�Ƭ��W�B����
		If ( @CanSignupPlaces - @SignupPlaces ) >= 0
			Begin
				Set @IsFull = 0
			End
		Else
			Begin
				Set @IsFull = 1
			End
	End
-- ���ݳ��W
Else If @SignupModel = 3
	Begin
		-- �p��ӤH�M���ݤw���W�W�B
		Select @IsSignupPlaces = Sum(Quantity)
		From Shopping_Buyer_With_RF_View obqv with(nolock)
		Where  1=1 
			And obqv.SID = @ActivitiesID
			And obqv.EmpNo = @EmployeeNo
			And status in (0,1)

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)
		
		-- �Ѿl�W�B�[�W�w���W�W�B����i���W���W�B
		Select @CanSignupPlaces = ( @IsSignupPlaces + (IsNull(obqv.Quantity,0) - IsNull(obqv.TotalQty,0)) )
		From Shopping_Object_Qty_View obqv with(nolock)
		where  1=1 
			And obqv.SID = @ActivitiesID

		-- �P�_�i���W���W�B�����ثe�n���W�W�B�O�_��-1 �p�G�t�Ƭ��W�B����
		If ( @CanSignupPlaces - @SignupPlaces ) >= 0
			Begin
				Set @IsFull = 0
			End
		Else
			Begin
				Set @IsFull = 1
			End
	End
-- �ն����W
Else If @SignupModel = 4
	Begin
	    -- �i���W���ռ�
		Select @QuotaPlaces = ( Quantity / TeamNumber )
		From Shopping_Object_View
		Where SID = @ActivitiesID

		-- �w���W���ռ�
		Select @IsSignupPlaces = Count(Distinct TeamID) 
		From Active_Team_Member_View with(nolock)
		Where SID = @ActivitiesID And Status = 1 

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)

		-- �P�_���ʳ��W�ռƦ����w���W�ռƩM�ثe���W�ռƬO�_��-1 �p�G�t�Ƭ��W�B����
		If ( @QuotaPlaces - @IsSignupPlaces - 1 ) >= 0
			Begin
				Set @IsFull = 0
			End
		Else
			Begin
				Set @IsFull = 1
			End
	End
-- �ɬq���W
Else If @SignupModel = 5
	Begin
		-- �Ӯɬq�i���W���W�B
		Select @QuotaPlaces = Number
		From Active_Period with(nolock)
		Where 1=1
			And SID = @ActivitiesID
			And PID = @TimeID
		
		-- �w���W���W�B
		Select @IsSignupPlaces = Sum(Quantity)
		From Shopping_buyer_View obqv with(nolock)
		where  1=1 
			 And obqv.SID = @ActivitiesID
			 And obqv.PID = @TimeID
			 And obqv.status in (0,1) 

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)
		
		-- �P�_�i���W���W�B�����ثe�n���W�W�B�O�_��-1 �p�G�t�Ƭ��W�B����
		If ( @QuotaPlaces - @IsSignupPlaces - @SignupPlaces ) >= 0
			Begin
				Set @IsFull = 0
			End
		Else
			Begin
			 	Set @IsFull = 1
			End
	End
End

GO


