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

-- 20171124 Hakkinen 確認報名
-- 宣告變數
Declare @QuotaPlaces int
Set @QuotaPlaces = 0
Declare @IsSignupPlaces int 
Set @QuotaPlaces = 0
Declare @CanSignupPlaces int 
Set @CanSignupPlaces = 0
Set @IsFull = 0

-- 個人報名
If @SignupModel = 1
	Begin
		-- 計算個人已報名名額
		Select @IsSignupPlaces = Quantity 
		From Shopping_buyer_View obqv with(nolock)
		Where  1=1 
			And obqv.SID = @ActivitiesID
			And obqv.EmpNo = @EmployeeNo
			And status in (0,1)

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)

		-- 剩餘名額加上已報名名額等於可報名的名額
		Select @CanSignupPlaces = ( @IsSignupPlaces + (IsNull(obqv.Quantity,0) - IsNull(obqv.TotalQty,0)) )
		From Shopping_Object_Qty_View obqv with(nolock)
		where  1=1 
			And obqv.SID = @ActivitiesID
		
		-- 判斷可報名的名額扣掉目前要報名名額是否為-1 如果負數為名額不足
		If ( @CanSignupPlaces - @SignupPlaces ) >= 0
			Begin
				Set @IsFull = 0
			End
		Else
			Begin
				Set @IsFull = 1
			End
	End
-- 眷屬報名
Else If @SignupModel = 3
	Begin
		-- 計算個人和眷屬已報名名額
		Select @IsSignupPlaces = Sum(Quantity)
		From Shopping_Buyer_With_RF_View obqv with(nolock)
		Where  1=1 
			And obqv.SID = @ActivitiesID
			And obqv.EmpNo = @EmployeeNo
			And status in (0,1)

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)
		
		-- 剩餘名額加上已報名名額等於可報名的名額
		Select @CanSignupPlaces = ( @IsSignupPlaces + (IsNull(obqv.Quantity,0) - IsNull(obqv.TotalQty,0)) )
		From Shopping_Object_Qty_View obqv with(nolock)
		where  1=1 
			And obqv.SID = @ActivitiesID

		-- 判斷可報名的名額扣掉目前要報名名額是否為-1 如果負數為名額不足
		If ( @CanSignupPlaces - @SignupPlaces ) >= 0
			Begin
				Set @IsFull = 0
			End
		Else
			Begin
				Set @IsFull = 1
			End
	End
-- 組隊報名
Else If @SignupModel = 4
	Begin
	    -- 可報名的組數
		Select @QuotaPlaces = ( Quantity / TeamNumber )
		From Shopping_Object_View
		Where SID = @ActivitiesID

		-- 已報名的組數
		Select @IsSignupPlaces = Count(Distinct TeamID) 
		From Active_Team_Member_View with(nolock)
		Where SID = @ActivitiesID And Status = 1 

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)

		-- 判斷活動報名組數扣掉已報名組數和目前報名組數是否為-1 如果負數為名額不足
		If ( @QuotaPlaces - @IsSignupPlaces - 1 ) >= 0
			Begin
				Set @IsFull = 0
			End
		Else
			Begin
				Set @IsFull = 1
			End
	End
-- 時段報名
Else If @SignupModel = 5
	Begin
		-- 該時段可報名的名額
		Select @QuotaPlaces = Number
		From Active_Period with(nolock)
		Where 1=1
			And SID = @ActivitiesID
			And PID = @TimeID
		
		-- 已報名的名額
		Select @IsSignupPlaces = Sum(Quantity)
		From Shopping_buyer_View obqv with(nolock)
		where  1=1 
			 And obqv.SID = @ActivitiesID
			 And obqv.PID = @TimeID
			 And obqv.status in (0,1) 

		Select @IsSignupPlaces = IsNull(@IsSignupPlaces,0)
		
		-- 判斷可報名的名額扣掉目前要報名名額是否為-1 如果負數為名額不足
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


