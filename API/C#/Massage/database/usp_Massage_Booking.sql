

CREATE proc [dbo].[usp_Massage_Booking]
(
	@Site		Nvarchar(3),
	@EmpNo		Nvarchar(50),
	@ReserveDate	Nvarchar(8),
	@BTime		Nvarchar(256)
)
As
Begin

-- �]�w�Ѽ�
Declare @OWVID Bigint
Declare @ConvertSite Nvarchar(3)

-- Insert��Booking Date���Ѽ�
Declare @ConvertSTime Datetime
Declare @ConvertETime Datetime

-- Insert��Booking List���Ѽ�
Declare @FinalSTime Nvarchar(50)
Declare @FinalETime Nvarchar(50)
Declare @FinalTime Nvarchar(50)

-- �Ω�P�_���Ѽ�
Declare @CursorNum int
Set @CursorNum = 1

-- �d�ݥثe��OWVID
Select @OWVID = OWVID From Massage_OWVID_Veiw

-- Site�ഫ
If @Site = 'QTY'
	Set @ConvertSite = 'M'
If @Site = 'QTT'
	Set @ConvertSite = 'T'
If @Site = 'QTH'
	Set @ConvertSite = 'N'

-- Cursor�j��]�w
Declare MyCursor Cursor For 

-- �ŧi�j���ܼ� ����BTime���Ѽ�
Select part From Massage_SplitString(@BTime,',')

Open MyCursor

Declare @part nvarchar(25) -- �ΨӦs��BTime���ܼ�

-- �}�l�j��]Cursor Start
Fetch Next From MyCursor Into @part

While (@@FETCH_STATUS <> -1)

Begin

-- �nInsert Table �ɶ��޿誺�B�z
Set @ConvertSTime = Cast( (@ReserveDate + ' ' + @part) as Datetime )
Set @ConvertETime = DateAdd(Minute, 30, @ConvertSTime)

-- Insert Script
Insert into Massage_Booking_Date ( OWVID, EmpNo, ClassIndex, STime, ETime, Status, CreDate )
Values ( @OWVID, @EmpNo, @ConvertSite, @ConvertSTime, @ConvertETime, 1, GetDate() )

--Select @OWVID,@EmpNo, @ConvertSite, @ConvertSTime, @ConvertETime

-- �P�_�O�_���Ĥ@���ðO���}�l�ɶ�
if ( @CursorNum = 1)
Begin
	Set @FinalSTime = Convert(Nvarchar(19),@ConvertSTime,25)
End

-- �P�_�O�_���̫�@���ðO�������ɶ�
if ( @CursorNum = @@CURSOR_rows)
Begin
	Set @FinalETime = Convert(Nvarchar(19),@ConvertETime,25)
End

-- �]�w�j��Ѽ�
Set @CursorNum = @CursorNum + 1

Fetch Next From MyCursor Into @part

End

-- Cursor End
-- ����&����cursor
Close MyCursor
Deallocate MyCursor

-- �N�}�l�M�����ɶ��զX
Set @FinalTime = Convert(Nvarchar(16),@FinalSTime) + ' ~ ' + Convert(Nvarchar(16),@FinalETime)

--Select @OWVID, @EmpNo, @ConvertSite, @FinalTime, @FinalSTime, @FinalETime

Insert into Massage_Booking_List ( OWVID, EmpNo, ClassIndex, ReservedTime, STime, ETime, Status, CreDate )
Values ( @OWVID, @EmpNo, @ConvertSite, @FinalTime, @FinalSTime, @FinalETime, 1, GetDate() )

End

GO


