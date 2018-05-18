

CREATE proc [dbo].[usp_Massage_Booking]
(
	@Site		Nvarchar(3),
	@EmpNo		Nvarchar(50),
	@ReserveDate	Nvarchar(8),
	@BTime		Nvarchar(256)
)
As
Begin

-- 設定參數
Declare @OWVID Bigint
Declare @ConvertSite Nvarchar(3)

-- Insert到Booking Date的參數
Declare @ConvertSTime Datetime
Declare @ConvertETime Datetime

-- Insert到Booking List的參數
Declare @FinalSTime Nvarchar(50)
Declare @FinalETime Nvarchar(50)
Declare @FinalTime Nvarchar(50)

-- 用於判斷的參數
Declare @CursorNum int
Set @CursorNum = 1

-- 查看目前的OWVID
Select @OWVID = OWVID From Massage_OWVID_Veiw

-- Site轉換
If @Site = 'QTY'
	Set @ConvertSite = 'M'
If @Site = 'QTT'
	Set @ConvertSite = 'T'
If @Site = 'QTH'
	Set @ConvertSite = 'N'

-- Cursor迴圈設定
Declare MyCursor Cursor For 

-- 宣告迴圈變數 切割BTime的參數
Select part From Massage_SplitString(@BTime,',')

Open MyCursor

Declare @part nvarchar(25) -- 用來存放BTime的變數

-- 開始迴圈跑Cursor Start
Fetch Next From MyCursor Into @part

While (@@FETCH_STATUS <> -1)

Begin

-- 要Insert Table 時間邏輯的處理
Set @ConvertSTime = Cast( (@ReserveDate + ' ' + @part) as Datetime )
Set @ConvertETime = DateAdd(Minute, 30, @ConvertSTime)

-- Insert Script
Insert into Massage_Booking_Date ( OWVID, EmpNo, ClassIndex, STime, ETime, Status, CreDate )
Values ( @OWVID, @EmpNo, @ConvertSite, @ConvertSTime, @ConvertETime, 1, GetDate() )

--Select @OWVID,@EmpNo, @ConvertSite, @ConvertSTime, @ConvertETime

-- 判斷是否為第一筆並記錄開始時間
if ( @CursorNum = 1)
Begin
	Set @FinalSTime = Convert(Nvarchar(19),@ConvertSTime,25)
End

-- 判斷是否為最後一筆並記錄結束時間
if ( @CursorNum = @@CURSOR_rows)
Begin
	Set @FinalETime = Convert(Nvarchar(19),@ConvertETime,25)
End

-- 設定迴圈參數
Set @CursorNum = @CursorNum + 1

Fetch Next From MyCursor Into @part

End

-- Cursor End
-- 關閉&釋放cursor
Close MyCursor
Deallocate MyCursor

-- 將開始和結束時間組合
Set @FinalTime = Convert(Nvarchar(16),@FinalSTime) + ' ~ ' + Convert(Nvarchar(16),@FinalETime)

--Select @OWVID, @EmpNo, @ConvertSite, @FinalTime, @FinalSTime, @FinalETime

Insert into Massage_Booking_List ( OWVID, EmpNo, ClassIndex, ReservedTime, STime, ETime, Status, CreDate )
Values ( @OWVID, @EmpNo, @ConvertSite, @FinalTime, @FinalSTime, @FinalETime, 1, GetDate() )

End

GO


