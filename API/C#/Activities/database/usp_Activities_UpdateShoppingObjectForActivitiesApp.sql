Create proc [dbo].[usp_Activities_UpdateShoppingObjectForActivitiesApp]

As
Begin

-- 20180511 Hakkinen ���ʲM�椤�~���s

-- �M�����ʲM�檺���~��
Delete From [MyQisda].[dbo].[Shopping_Object_For_ActivitiesApp]

-- �s�W���ʲM�檺���~��
Insert into [MyQisda].[dbo].[Shopping_Object_For_ActivitiesApp]
Select [SID] as 'ActivitiesID'
      ,[ClassNo]
      ,[ClassDesc]
      ,[ObjectName] as 'ActivitiesName'
      ,[ObjectDesc] as 'ActivitiesContent'
      ,'http://www.myqisda.com/services/Activities/upload/'+ [ImageName] as 'ActivitiesImage'
      ,[Quantity]
      ,[QuantityLimit]
      ,[ActivityStatus]
      ,[StartDate]
      ,[EndDate]
      ,[OpenStatus]
      ,[PersonalQtyLimit]  as 'LimitPlaces'
      ,[SecClassNo]
      ,[SecClassDesc]
      ,[QtyStatus]
      ,[QtyLimit]
      ,[OtherColumnName1]
      ,[OtherColumnType1]
      ,[OtherColumnItem1]
      ,[OtherColumnName2]
      ,[OtherColumnType2]
      ,[OtherColumnItem2]
      ,[OtherColumnName3]
      ,[OtherColumnType3]
      ,[OtherColumnItem3]
      ,[OtherColumnName4]
      ,[OtherColumnType4]
      ,[OtherColumnItem4]
      ,[OtherColumnName5]
      ,[OtherColumnType5]
      ,[OtherColumnItem5]
      ,[RegisterMode]
      ,[TeamNumber]
      ,[Role]
      ,[EventDate]
	  ,Isnull((Convert(Nvarchar,StartDate,111) + ' ' + Substring(Convert(Nvarchar,StartDate,114),0,6) + ' ~ ' + 
	   Convert(Nvarchar,EndDate,111) + ' ' + Substring(Convert(Nvarchar,EndDate,114),0,6)),'��������W�ɶ�') as 'SignupDate',
	   Convert(Nvarchar,IsNull(EndDate,Getdate()),111)  + ' ' + Substring(Convert(Nvarchar,IsNull(EndDate,DateAdd( mi, 30, Getdate())),114),0,6) as 'Deadline',
	   Convert(int,RegisterMode) as 'SignupModel'
	  ,isnull(Quantity,0) as 'QuotaPlaces'
From [MyQisda].[dbo].[Shopping_Object_View] wtih(nolock)
Where StartDate Between DateAdd(Month, - 2, GetDate()) And DateAdd(Month, 1, GetDate()) -- ��e��Ӥ�M���Ӥ@�Ӥ�
order by [StartDate]


End
Go


